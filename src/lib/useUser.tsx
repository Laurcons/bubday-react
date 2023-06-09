import axiosStatic, { AxiosInstance } from 'axios';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { Config } from 'src/lib/config';
import { Invitee } from 'src/lib/types';

const throws = () => {
  throw new Error('Context not initialized yet');
};

const InviteeContext = createContext<{
  invitee: Invitee | null;
  isLoading: boolean;
  refetch: () => Promise<unknown>;
  setUrlCode: (code: string) => void;
  axios: AxiosInstance;
}>({
  invitee: null,
  isLoading: true,
  refetch: throws,
  setUrlCode: throws,
  axios: null as any,
});

export function useInvitee() {
  return useContext(InviteeContext);
}

export function InviteeProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState('');
  const [urlCode, setUrlCode] = useState('');
  useEffect(() => {
    if (!urlCode) return;
    (async () => {
      const { token } = await axiosStatic
        .post(`${Config.apiUrl}/auth/login`, {
          urlCode,
        })
        .then((d) => d.data);
      setToken(token);
    })();
  }, [urlCode]);

  const axios = useMemo(
    () =>
      axiosStatic.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: Config.apiUrl,
      }),
    [token]
  );

  const {
    data: invitee,
    isLoading,
    refetch,
  } = useQuery(
    ['invitee', 'me'],
    () => axios.get(`/invitee/me`).then((d) => d.data),
    { enabled: !!token }
  );

  const ctx = {
    invitee,
    isLoading: isLoading || (!token && !urlCode) || (!token && !!urlCode),
    refetch,
    setUrlCode,
    axios,
  };

  return (
    <InviteeContext.Provider value={ctx}>{children}</InviteeContext.Provider>
  );
}

import dayjs from 'dayjs';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useInvitee } from 'src/lib/useUser';

const DeadlineContext = createContext<{
  isLoading: boolean;
  deadline: dayjs.Dayjs | null;
  isPastDeadline: boolean;
}>({
  isLoading: true,
  deadline: null,
  isPastDeadline: false,
});

export function useDeadline() {
  return useContext(DeadlineContext);
}

export function DeadlineProvider({ children }: PropsWithChildren) {
  const { isLoggedIn, axios } = useInvitee();
  const [isLoading, setIsLoading] = useState(true);
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    axios
      .get('/deadline')
      .then((d) => d.data)
      .then((ddl) => {
        setDeadline(dayjs(ddl.deadline));
        setIsLoading(false);
      });
  }, [isLoggedIn, axios]);

  const ctx = {
    isLoading,
    deadline,
    isPastDeadline: dayjs().isAfter(deadline),
    // isPastDeadline: true,
  };

  return (
    <DeadlineContext.Provider value={ctx}>{children}</DeadlineContext.Provider>
  );
}

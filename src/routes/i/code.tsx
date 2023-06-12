import { useCallback, useEffect, useMemo, useRef } from 'react';
import Layout from 'src/components/Layout';
import dipicLogo from 'src/assets/dipic.webp';
import BubdayLogo from 'src/components/ui/BubdayLogo';
import P from 'src/components/ui/P';
import { useInvitee } from 'src/lib/useUser';
import { useParams } from 'react-router-dom';
import { PresenceStatus } from 'src/lib/types';
import { useMutation, useQuery } from 'react-query';
import {
  FavoriteSongSignupPart,
  ForDetailsSignupPart,
  GreatSignupPart,
  PastDeadlineSignupPart,
  PizzaPreferenceSignupPart,
  PresenceStatusSignupPart,
} from 'src/routes/i/_signup-parts';
import Loading from 'src/components/ui/Loading';
import { toast } from 'react-toastify';
import { useDeadline } from 'src/lib/useDeadline';

export default function InvitationPage() {
  const { invitee, isLoading, setUrlCode, axios, refetch } = useInvitee();
  const { urlCode } = useParams();
  const { isPastDeadline } = useDeadline();
  const finalPartRef = useRef<HTMLHeadingElement>(null);

  const {
    data: stats,
    isFetching: isStatsLoading,
    refetch: refetchStats,
  } = useQuery(
    ['invitee', 'stats'],
    () => axios.get('/invitee/stats').then((d) => d.data),
    {
      enabled: !!invitee,
      refetchInterval: 10 * 1000,
    }
  );

  const scrollToFinalPart = () => {
    setTimeout(
      () => finalPartRef.current?.scrollIntoView({ behavior: 'smooth' }),
      100
    );
  };

  const presenceStatusM = useMutation({
    mutationFn: (presenceStatus: PresenceStatus) =>
      axios.patch('/invitee/me', { presenceStatus }),
    async onSuccess(data, variables, context) {
      await refetch();
      scrollToFinalPart();
    },
    async onError() {
      toast.error('Ceva a mers prost');
    },
  });
  const pizzaM = useMutation({
    mutationFn: (pizzaPreference: string) =>
      axios.patch('/invitee/me', { pizzaPreference }),
    async onSuccess(data, variables, context) {
      const firstTime = !invitee?.pizzaPreference;
      await refetch();
      if (firstTime) {
        scrollToFinalPart();
      }
    },
    async onError() {
      toast.error('Ceva a mers prost');
    },
  });
  const favSongM = useMutation({
    mutationFn: (favoriteSong: string) =>
      axios.patch('/invitee/me', { favoriteSong }),
    async onSuccess() {
      const firstTime = !invitee?.favoriteSong;
      await refetch();
      if (firstTime) {
        refetchStats();
        scrollToFinalPart();
      }
    },
    async onError() {
      toast.error('Ceva a mers prost');
    },
  });

  useEffect(() => {
    urlCode && setUrlCode(urlCode);
  }, [urlCode]);

  const screens = useMemo(
    () =>
      [
        {
          name: 'te bagi',
          title: 'Te bagi?',
          isLoading: presenceStatusM.isLoading,
          if: !isPastDeadline,
          children: (
            <PresenceStatusSignupPart mutate={presenceStatusM.mutateAsync} />
          ),
        },
        {
          name: 'pizza',
          title: 'Ce pizza dorești?',
          isLoading: pizzaM.isLoading,
          if:
            !isPastDeadline &&
            invitee?.presenceStatus === PresenceStatus.confirmed,
          children: <PizzaPreferenceSignupPart mutate={pizzaM.mutateAsync} />,
        },
        {
          name: 'fav song',
          title: 'Care e piesa ta preferată?',
          isLoading: favSongM.isLoading,
          if:
            !isPastDeadline &&
            invitee?.presenceStatus === PresenceStatus.confirmed &&
            !!invitee?.pizzaPreference,
          children: <FavoriteSongSignupPart mutate={favSongM.mutateAsync} />,
        },
        {
          name: 'past ddl',
          title: 'Deadline-ul de completare a fost depășit 😶‍🌫️',
          isLoading: false,
          if: isPastDeadline,
          children: <PastDeadlineSignupPart />,
        },
        {
          name: 'great',
          title: 'Super! Te aștept la ziua mea 🙌',
          isLoading: isStatsLoading,
          if:
            invitee?.presenceStatus === PresenceStatus.confirmed &&
            !!invitee?.pizzaPreference &&
            !!invitee?.favoriteSong,
          children: <GreatSignupPart stats={stats} />,
        },
        {
          name: 'maybe',
          title: 'Ok! Aștept cu nerăbdare răspunsul tău 🥺',
          isLoading: false,
          if:
            !isPastDeadline &&
            invitee?.presenceStatus === PresenceStatus.possible,
          children: <ForDetailsSignupPart />,
        },
        {
          name: 'not coming',
          title: 'Îmi pare rău 🥺 Sper totuși să ne vedem și cu altă ocazie!',
          isLoading: false,
          if:
            (!isPastDeadline &&
              invitee?.presenceStatus === PresenceStatus.negated) ||
            (isPastDeadline &&
              invitee?.presenceStatus !== PresenceStatus.confirmed),
          children: <ForDetailsSignupPart />,
        },
      ].filter((s) => s.if),
    [
      invitee,
      presenceStatusM.isLoading,
      pizzaM.isLoading,
      favSongM.isLoading,
      isStatsLoading,
    ]
  );

  const salutation = useMemo(() => {
    const choices = ['Salut', 'Bună', 'Hey', 'Hewwo'];
    return choices[Math.floor(Math.random() * choices.length)];
  }, []);

  if (!isLoading && !invitee) {
    return <Layout>Ceva a mers prost.</Layout>;
  }

  return (
    <Layout isLoading={isLoading}>
      <div className="flex h-32 justify-around">
        <div className="flex-grow basis-0">
          <a href="https://dipicfun.ro" target="_blank">
            <img src={dipicLogo} className="h-14" />
          </a>
        </div>
        <div>&amp;</div>
        <div className="flex-grow basis-0">
          <BubdayLogo />
        </div>
      </div>
      <div className="relative text-center text-gray-200 text-3xl font-bold tracking-tight z-0 px-3 mb-10">
        {salutation} {invitee?.nickname}! Ești{' '}
        {invitee?.gender === 'male' ? 'invitat' : 'invitată'} la Laser Tag, de
        ziua mea.
        <div className="absolute -z-10 right-7 bottom-0 flex flex-col justify-center">
          <div className="opacity-80 font-medium text-amber-600 animate-bounce">
            <div className="rotate-12">20</div>
          </div>
        </div>
      </div>
      <P>
        Ultimele mele două aniversări au trecut la fel cum au venit, fiind
        cuprins în sfera bacului sau a facultății.
      </P>
      <P>
        Însă în prima mea aniversare în calitate de salariat, doresc să
        organizez o ieșire la activitatea mea preferată din Cluj: Laser Tag!
      </P>
      <div className="text-gray-200 text-xl leading-loose">
        <div>Hai să ne vedem,</div>
        <div className="font-bold text-amber-600">Duminică, 2 iulie</div>
        <div>
          la{' '}
          <span className="font-bold text-amber-600">
            Dipic Fun Cluj Napoca
          </span>
          <div className="text-sm italic text-slate-400">
            Piața 1 Mai, nr. 4-5, Cluj Napoca (în clădirea Clujana), în curtea
            interioară, etaj 1
          </div>
        </div>
        <div>
          la <span className="font-bold text-amber-600">ora 14</span>
        </div>
      </div>
      <P className="text-gray-200 mb-10">
        pentru a sărbători împreună jucând Laser Tag și mâncând o pizza
        împreună.
      </P>
      {screens.map((screen, idx) => (
        <>
          <h1
            ref={idx === screens.length - 1 ? finalPartRef : undefined}
            className="text-gray-200 text-2xl mb-3"
          >
            {screen.title}
            {screen.isLoading && (
              <div className="float-right">
                <Loading className="w-6" />
              </div>
            )}
          </h1>
          {screen.children}
          <div className="mb-10"></div>
        </>
      ))}
    </Layout>
  );
}

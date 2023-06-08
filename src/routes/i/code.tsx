import { useEffect, useMemo, useRef } from 'react';
import Layout from 'src/components/Layout';
import dipicLogo from 'src/assets/dipic.webp';
import BubdayLogo from 'src/components/ui/BubdayLogo';
import P from 'src/components/ui/P';
import { useInvitee } from 'src/lib/useUser';
import { useParams } from 'react-router-dom';
import Button from 'src/components/ui/Button';
import { PresenceStatus } from 'src/lib/types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Select from 'src/components/ui/Select';
import loading from 'src/assets/loading.svg';

export default function InvitationPage() {
  const { invitee, isLoading, setUrlCode, axios, refetch } = useInvitee();
  const { urlCode } = useParams();
  const afterPresenceRef = useRef<HTMLHeadingElement>(null);
  const finalRef = useRef<HTMLHeadingElement>(null);

  const { data: stats, isFetching: isStatsLoading } = useQuery(
    ['invitee', 'stats'],
    () => axios.get('/invitee/stats').then((d) => d.data),
    {
      refetchInterval: 10 * 1000,
    }
  );

  const presenceStatusM = useMutation({
    mutationFn: (presenceStatus: PresenceStatus) =>
      axios.patch('/invitee/me', { presenceStatus }),
    mutationKey: ['invitee', 'me'],
    async onSuccess(data, variables, context) {
      await refetch();
      setTimeout(
        () => afterPresenceRef.current?.scrollIntoView({ behavior: 'smooth' }),
        100
      );
    },
  });
  const pizzaM = useMutation({
    mutationFn: (pizzaPreference: string) =>
      axios.patch('/invitee/me', { pizzaPreference }),
    mutationKey: ['invitee', 'me'],
    async onSuccess(data, variables, context) {
      const firstTime = !invitee?.pizzaPreference;
      await refetch();
      if (firstTime) {
        setTimeout(
          () => finalRef.current?.scrollIntoView({ behavior: 'smooth' }),
          100
        );
      }
    },
  });

  useEffect(() => {
    urlCode && setUrlCode(urlCode);
  }, [urlCode]);

  const salutation = useMemo(() => {
    const choices = ['Salut!', 'Bună!', 'Hey!', 'Hewwo!'];
    return choices[Math.floor(Math.random() * choices.length)];
  }, []);

  if (!isLoading && !invitee) {
    return <Layout>Ceva a mers prost.</Layout>;
  }

  return (
    <Layout isLoading={isLoading}>
      <div className="flex h-32 justify-around">
        <div className="flex-grow basis-0">
          <img src={dipicLogo} className="h-14" />
        </div>
        <div>&times;</div>
        <div className="flex-grow basis-0">
          <BubdayLogo />
        </div>
      </div>
      <div className="relative text-center text-gray-200 text-3xl font-bold tracking-tight z-0 px-3 mb-10">
        {salutation} Ești invitat la Laser Tag, de ziua mea.
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
          la <span className="font-bold text-amber-600">ora 18</span>?
        </div>
      </div>
      <P className="text-gray-200 mb-10">
        pentru a sărbători împreună jucând Laser Tag, pe console, și mâncând o
        pizza împreună.
      </P>
      <h1 className="text-gray-200 text-2xl mb-3">
        Te bagi?
        {presenceStatusM.isLoading && (
          <div className="float-right">
            <img src={loading} className="w-6" />
          </div>
        )}
      </h1>
      <P className="text-sm">Ai timp să te răzgândești până în 25 iunie.</P>
      {Object.values(PresenceStatus).map((status) => (
        <>
          <Button
            variant={
              status === PresenceStatus.confirmed ? 'primary' : 'secondary'
            }
            type="button"
            className="mb-2"
            selected={invitee?.presenceStatus === status}
            onClick={() => presenceStatusM.mutateAsync(status)}
          >
            {status === PresenceStatus.confirmed && <>Da, frate!</>}
            {status === PresenceStatus.possible && (
              <>Nu știu, trebuie să îmi consult pisica</>
            )}
            {status === PresenceStatus.negated && <>Nu ajung :(</>}
          </Button>
        </>
      ))}
      <div className="mb-4"></div>
      {invitee?.presenceStatus === PresenceStatus.confirmed && (
        <>
          <h1 ref={afterPresenceRef} className="text-gray-200 text-2xl mb-3">
            Ce pizza dorești?
            {pizzaM.isLoading && (
              <div className="float-right">
                <img src={loading} className="w-6" />
              </div>
            )}
          </h1>
          <P className="text-sm">
            De la Restaurant Big Belly. Ai timp să te răzgândești până în 25
            iunie.
          </P>
          <Select
            value={invitee.pizzaPreference}
            onChange={(ev) => pizzaM.mutateAsync(ev.target.value)}
            className="mb-6"
          >
            <option value="" disabled>
              Alege...
            </option>
            {['Capriciosa', 'Big Belly', 'Carbonara', 'Quatro Stagioni'].map(
              (text) => (
                <>
                  <option value={text}>{text}</option>
                </>
              )
            )}
          </Select>
        </>
      )}
      {invitee?.presenceStatus === PresenceStatus.confirmed &&
        !!invitee?.pizzaPreference && (
          <>
            <h1 ref={finalRef} className="text-gray-200 text-2xl mb-3">
              Super! Te aștept la ziua mea 🙌
              {isStatsLoading && (
                <div className="float-right">
                  <img src={loading} className="w-6" />
                </div>
              )}
            </h1>
            {stats.confirmedCount !== 1 ? (
              <P>
                Tu și alți{' '}
                <span className="text-amber-500">
                  {stats.confirmedCount - 1}
                </span>{' '}
                invitați ați confirmat prezența până acum.
              </P>
            ) : (
              <P className="text-gray-200">
                Ești primul care a confirmat prezența!
              </P>
            )}
            <P>
              Pentru orice alte detalii, sau dacă vrei să îmi spui ceva,
              contactează-mă pe WhatsApp / Discord.
            </P>
          </>
        )}
      {invitee?.presenceStatus === PresenceStatus.possible && (
        <>
          <h1 ref={afterPresenceRef} className="text-gray-200 text-2xl mb-3">
            Ok! Aștept cu nerăbdare un răspuns 🙌
          </h1>
          <P>
            Pentru orice alte detalii, sau dacă vrei să îmi spui ceva,
            contactează-mă pe WhatsApp / Discord.
          </P>
        </>
      )}
      {invitee?.presenceStatus === PresenceStatus.negated && (
        <>
          <h1 ref={afterPresenceRef} className="text-gray-200 text-2xl mb-3">
            Îmi pare rău. Ne vedem cu altă ocazie!
          </h1>
          <P>
            Pentru orice alte detalii, sau dacă vrei să îmi spui ceva,
            contactează-mă pe WhatsApp / Discord.
          </P>
        </>
      )}
    </Layout>
  );
}

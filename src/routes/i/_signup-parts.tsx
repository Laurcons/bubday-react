import { useMemo, useState } from 'react';
import Button from 'src/components/ui/Button';
import Input from 'src/components/ui/Input';
import P from 'src/components/ui/P';
import Select from 'src/components/ui/Select';
import { PresenceStatus } from 'src/lib/types';
import { useInvitee } from 'src/lib/useUser';
import menuPdf from 'src/assets/meniu-bubday.pdf';
import A from 'src/components/ui/A';
import Deadline from 'src/components/Deadline';
import { useDeadline } from 'src/lib/useDeadline';

export function PresenceStatusSignupPart({
  mutate,
}: {
  mutate: (presenceStatus: PresenceStatus) => Promise<any>;
}) {
  const { invitee } = useInvitee();
  return (
    <>
      <P className="text-sm">
        Ai timp să te {!!invitee?.presenceStatus ? 'răz' : 'mai '}gândești până
        în <Deadline />.
      </P>
      <div className="flex flex-col gap-2">
        {Object.values(PresenceStatus).map((status) => (
          <Button
            variant={
              status === PresenceStatus.confirmed ? 'primary' : 'secondary'
            }
            type="button"
            className="w-full"
            selected={invitee?.presenceStatus === status}
            onClick={() => mutate(status)}
          >
            {status === PresenceStatus.confirmed && <>Da, frate!</>}
            {status === PresenceStatus.possible && (
              <>Nu știu, trebuie să îmi consult pisica</>
            )}
            {status === PresenceStatus.negated && <>Nu ajung :(</>}
          </Button>
        ))}
      </div>
    </>
  );
}

export function PizzaPreferenceSignupPart({
  mutate,
}: {
  mutate: (pref: string) => Promise<any>;
}) {
  const { invitee } = useInvitee();
  return (
    <>
      <P className="text-sm">
        <A href={menuPdf} target="_blank">
          Vezi meniu.
        </A>{' '}
        Ai timp să te {!!invitee?.pizzaPreference ? 'răz' : 'mai '}gândești până
        în <Deadline />.
      </P>
      <Select
        value={invitee!.pizzaPreference}
        onChange={(ev) => mutate(ev.target.value)}
      >
        <option value="" selected disabled>
          Alege...
        </option>
        {[
          'Nazareth',
          'Gourmet',
          'Diavolo',
          'Prosciutto Cotto',
          'Carbonara',
          'Big Belly',
          'Quatro Stagioni',
          'Provinciale',
          'Canibale',
          'Prosciutto e Rucola',
          'Prosciutto e Funghi',
          'Prosciutto Crudo',
          'Pizza cu Ton',
          'Capriciosa',
          'Hawaii',
          'Margherita',
          'Vegetariană',
          'Quatro Formaggi',
          'Panne',
        ].map((text) => (
          <>
            <option value={text}>{text}</option>
          </>
        ))}
      </Select>
    </>
  );
}

export function FavoriteSongSignupPart({
  mutate,
}: {
  mutate: (song: string) => Promise<unknown>;
}) {
  const { invitee } = useInvitee();
  const [text, setText] = useState(invitee?.favoriteSong ?? '');
  return (
    <>
      <P className="text-sm">
        Lasă aici un link la piesa ta preferată, sau o dedicație pentru mine.
        Dacă nu vrei, lasă orice alt text. Ai timp să te{' '}
        {!!invitee?.favoriteSong ? 'răz' : 'mai '}gândești până în <Deadline />.
      </P>
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          className="grow"
          placeholder="... https://youtu.be/dQw4w9WgXcQ"
          value={text}
          onChange={(ev) => setText(ev.target.value)}
        />
        <Button
          variant="secondary"
          className="border border-amber-700"
          onClick={() => mutate(text)}
        >
          ✅
        </Button>
      </div>
      {!text && (
        <P className="text-sm">
          Prezența ta nu va fi confirmată cât timp <em>nu</em> ai ales încă
          preferințele.
        </P>
      )}
    </>
  );
}

export function GreatSignupPart({ stats }: { stats: any }) {
  const { isPastDeadline } = useDeadline();
  const { invitee } = useInvitee();
  return (
    <>
      {stats?.confirmedCount > 1 ? (
        <P>
          Tu și alți{' '}
          <span className="text-amber-500">
            {stats ? stats.confirmedCount - 1 : '?'}
          </span>{' '}
          invitați ați confirmat prezența până acum.
        </P>
      ) : (
        <P className="text-gray-200">
          Ești {invitee?.gender === 'male' ? 'primul' : 'prima'} care a
          confirmat prezența!
        </P>
      )}
      {!isPastDeadline && (
        <P>
          Te poți oricând întoarce pe această pagină pentru a revizui
          preferințele tale.
        </P>
      )}
      <ForDetailsSignupPart />
      <P>
        Site hostat prin DigitalOcean. Obține $200 cu care să te joci folosind{' '}
        <A
          target="_blank"
          href="https://www.digitalocean.com/?refcode=72172f34b447&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
        >
          codul meu promoțional
        </A>
        . Vezi proiectul pe{' '}
        <A href="https://github.com/Laurcons/bubday-api" target="_blank">
          GitHub
        </A>
        .
      </P>
    </>
  );
}

export function ForDetailsSignupPart() {
  return (
    <>
      <P>
        Pentru orice alte detalii, sau dacă vrei să îmi spui ceva,
        contactează-mă pe WhatsApp / Discord.
      </P>
    </>
  );
}

export function PastDeadlineSignupPart() {
  const { invitee } = useInvitee();
  const isComing = useMemo(
    () => invitee?.presenceStatus === PresenceStatus.confirmed,
    [invitee?.presenceStatus]
  );
  return (
    <>
      {isComing ? (
        <>
          <P>Preferințele tale:</P>
          <ol className="list-disc ml-7 mb-3">
            <li>
              Pizza: {invitee?.pizzaPreference} (
              <A href={menuPdf} target="_blank">
                vezi meniu
              </A>
              )
            </li>
            <li>Piesă preferată / dedicație: {invitee?.favoriteSong}</li>
          </ol>
        </>
      ) : (
        <>
          <P>Nu ai confirmat prezența.</P>
        </>
      )}
      <P>Pentru orice schimbări, te rog adresează-mi-te direct.</P>
    </>
  );
}

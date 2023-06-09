import { useState } from 'react';
import { Mutation } from 'react-query';
import Button from 'src/components/ui/Button';
import Input from 'src/components/ui/Input';
import P from 'src/components/ui/P';
import Select from 'src/components/ui/Select';
import { PresenceStatus } from 'src/lib/types';
import { useInvitee } from 'src/lib/useUser';

export function PresenceStatusSignupPart({
  mutate,
}: {
  mutate: (presenceStatus: PresenceStatus) => Promise<any>;
}) {
  const { invitee } = useInvitee();
  return (
    <>
      <P className="text-sm">Ai timp să te răzgândești până în 25 iunie.</P>
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
        De la Restaurant Big Belly. Ai timp să te răzgândești până în 25 iunie.
      </P>
      <Select
        value={invitee!.pizzaPreference}
        onChange={(ev) => mutate(ev.target.value)}
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
        Dacă nu vrei, lasă orice alt text.
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
  return (
    <>
      {stats?.confirmedCount !== 1 ? (
        <P>
          Tu și alți{' '}
          <span className="text-amber-500">
            {stats ? stats.confirmedCount - 1 : '?'}
          </span>{' '}
          invitați ați confirmat prezența până acum.
        </P>
      ) : (
        <P className="text-gray-200">Ești primul care a confirmat prezența!</P>
      )}
      <P>
        Te poți oricând întoarce pe această pagină pentru a revizui preferințele
        tale.
      </P>
      <ForDetailsSignupPart />
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

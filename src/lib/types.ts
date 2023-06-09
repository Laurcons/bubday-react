export interface Invitee {
  id: number;
  urlCode: string;

  nickname: string;
  fullName: string;

  presenceStatus: PresenceStatus;
  pizzaPreference: string;
  favoriteSong: string;
}

export enum PresenceStatus {
  confirmed = 'confirmed',
  possible = 'possible',
  negated = 'negated',
}

export interface Invitee {
  id: number;
  urlCode: string;

  nickname: string;
  fullName: string;
  gender: 'male' | 'female';

  presenceStatus: PresenceStatus;
  pizzaPreference: string;
  favoriteSong: string;
}

export enum PresenceStatus {
  confirmed = 'confirmed',
  possible = 'possible',
  negated = 'negated',
}

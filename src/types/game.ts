export type Genre =
  | 'strategy'
  | 'luck'
  | 'negotiation'
  | 'cooperative'
  | 'memory';

export type Game = {
  id: string;
  name: string;
  genres: Genre[];
  isPreset: boolean;
  createdAt: string;
};

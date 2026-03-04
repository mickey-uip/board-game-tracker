export type PlayerResult = {
  playerId: string;
  rank: number;
};

export type GameRecord = {
  id: string;
  gameId: string;
  date: string;
  playerResults: PlayerResult[];
  createdAt: string;
};

import type { Genre } from './game';

export type GenreWinRate = {
  genre: Genre;
  winRate: number;
  playCount: number;
};

export type PlayerStats = {
  playerId: string;
  totalGames: number;
  wins: number;
  winRate: number;
  genreStats: GenreWinRate[];
  favoriteGenre: Genre | null;
};

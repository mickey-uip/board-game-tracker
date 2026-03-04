import type { Game, GameRecord, Genre, PlayerStats, GenreWinRate } from '../types';

const ALL_GENRES: Genre[] = ['strategy', 'luck', 'negotiation', 'cooperative', 'memory'];

export function calcPlayerStats(
  playerId: string,
  records: GameRecord[],
  getGame: (id: string) => Game | null
): PlayerStats {
  const playerRecords = records.filter((r) =>
    r.playerResults.some((pr) => pr.playerId === playerId)
  );

  const totalGames = playerRecords.length;
  const wins = playerRecords.filter((r) => {
    const result = r.playerResults.find((pr) => pr.playerId === playerId);
    return result?.rank === 1;
  }).length;
  const winRate = totalGames > 0 ? wins / totalGames : 0;

  const genreWins: Record<Genre, number> = {
    strategy: 0,
    luck: 0,
    negotiation: 0,
    cooperative: 0,
    memory: 0,
  };
  const genrePlays: Record<Genre, number> = {
    strategy: 0,
    luck: 0,
    negotiation: 0,
    cooperative: 0,
    memory: 0,
  };

  for (const record of playerRecords) {
    const game = getGame(record.gameId);
    if (!game) continue;
    const result = record.playerResults.find((pr) => pr.playerId === playerId);
    const isWin = result?.rank === 1;
    for (const genre of game.genres) {
      genrePlays[genre] += 1;
      if (isWin) genreWins[genre] += 1;
    }
  }

  const genreStats: GenreWinRate[] = ALL_GENRES.map((genre) => ({
    genre,
    winRate: genrePlays[genre] > 0 ? genreWins[genre] / genrePlays[genre] : 0,
    playCount: genrePlays[genre],
  }));

  const favoriteGenre = genreStats.reduce<Genre | null>((best, cur) => {
    if (cur.playCount === 0) return best;
    if (!best) return cur.genre;
    const bestStat = genreStats.find((g) => g.genre === best)!;
    return cur.winRate > bestStat.winRate ? cur.genre : best;
  }, null);

  return { playerId, totalGames, wins, winRate, genreStats, favoriteGenre };
}

export function calcAllPlayersWinRate(
  playerIds: string[],
  records: GameRecord[],
  getGame: (id: string) => Game | null
): { playerId: string; winRate: number; wins: number; totalGames: number }[] {
  return playerIds
    .map((id) => {
      const stats = calcPlayerStats(id, records, getGame);
      return { playerId: id, winRate: stats.winRate, wins: stats.wins, totalGames: stats.totalGames };
    })
    .sort((a, b) => b.winRate - a.winRate);
}

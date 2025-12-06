import type { LeaderboardEntry } from '@/types';

export const leaderboardData: LeaderboardEntry[] = [
  { userId: '10', userName: 'Marta Wiśniewska', points: 2450, rank: 1 },
  { userId: '11', userName: 'Piotr Kowalczyk', points: 2100, rank: 2 },
  { userId: '12', userName: 'Katarzyna Lewandowska', points: 1890, rank: 3 },
  { userId: '13', userName: 'Michał Wójcik', points: 1750, rank: 4 },
  { userId: '14', userName: 'Agnieszka Kamińska', points: 1620, rank: 5 },
  { userId: '3', userName: 'Anna Nowak', points: 1450, rank: 6 },
  { userId: '15', userName: 'Tomasz Zieliński', points: 1320, rank: 7 },
  { userId: '16', userName: 'Joanna Szymańska', points: 1180, rank: 8 },
  { userId: '17', userName: 'Krzysztof Woźniak', points: 1050, rank: 9 },
  { userId: '18', userName: 'Monika Dąbrowska', points: 920, rank: 10 },
];

export const getLeaderboard = (period: 'week' | 'all' = 'week'): LeaderboardEntry[] => {
  // In a real app, this would filter by date
  // For demo, we'll just return the same data with slightly different points for "all time"
  if (period === 'all') {
    return leaderboardData.map(entry => ({
      ...entry,
      points: entry.points * 4,
    }));
  }
  return leaderboardData;
};

export const getUserRank = (userId: string, period: 'week' | 'all' = 'week'): LeaderboardEntry | null => {
  const leaderboard = getLeaderboard(period);
  return leaderboard.find(entry => entry.userId === userId) || null;
};

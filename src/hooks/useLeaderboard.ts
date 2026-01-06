import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  rank: number;
}

export function useLeaderboard(period: 'week' | 'all' = 'week') {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('user_daily_stats')
          .select(`
            user_id,
            xp_earned,
            date
          `);

        // Filter by date range for weekly leaderboard
        if (period === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          query = query.gte('date', weekAgo.toISOString().split('T')[0]);
        }

        const { data: statsData, error: statsError } = await query;

        if (statsError) throw statsError;

        // Aggregate XP by user
        const userXpMap = new Map<string, number>();
        statsData?.forEach(stat => {
          const current = userXpMap.get(stat.user_id) || 0;
          userXpMap.set(stat.user_id, current + (stat.xp_earned || 0));
        });

        // Get user profiles for names
        const userIds = Array.from(userXpMap.keys());
        if (userIds.length === 0) {
          setLeaderboard([]);
          setIsLoading(false);
          return;
        }

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Create leaderboard entries
        const entries: LeaderboardEntry[] = [];
        profilesData?.forEach(profile => {
          const points = userXpMap.get(profile.id) || 0;
          if (points > 0) {
            entries.push({
              userId: profile.id,
              userName: profile.name,
              points,
              rank: 0,
            });
          }
        });

        // Sort by points and assign ranks
        entries.sort((a, b) => b.points - a.points);
        entries.forEach((entry, index) => {
          entry.rank = index + 1;
        });

        setLeaderboard(entries.slice(0, 50)); // Top 50
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      }

      setIsLoading(false);
    };

    fetchLeaderboard();
  }, [period]);

  return { leaderboard, isLoading, error };
}

export function useUserRank(userId: string | undefined, period: 'week' | 'all' = 'week') {
  const { leaderboard } = useLeaderboard(period);
  
  if (!userId) return null;
  
  return leaderboard.find(entry => entry.userId === userId) || null;
}
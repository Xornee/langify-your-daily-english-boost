import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalLessonsCompleted: number;
  activeToday: number;
  averageStreak: number;
}

export interface DailyStat {
  date: string;
  users: number;
  lessons: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total lessons completed
        const { data: statsData } = await supabase
          .from('user_daily_stats')
          .select('lessons_completed, xp_earned, date, user_id');

        let totalLessons = 0;
        statsData?.forEach(stat => {
          totalLessons += stat.lessons_completed || 0;
        });

        // Get active users today
        const today = new Date().toISOString().split('T')[0];
        const { data: todayData } = await supabase
          .from('user_daily_stats')
          .select('user_id')
          .eq('date', today);

        const activeToday = new Set(todayData?.map(d => d.user_id)).size;

        // Calculate daily stats for last 7 days
        const last7Days: DailyStat[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayStats = statsData?.filter(s => s.date === dateStr) || [];
          const uniqueUsers = new Set(dayStats.map(d => d.user_id)).size;
          const lessonsCount = dayStats.reduce((sum, d) => sum + (d.lessons_completed || 0), 0);
          
          last7Days.push({
            date: dateStr,
            users: uniqueUsers,
            lessons: lessonsCount,
          });
        }

        // Calculate average streak (simplified)
        const avgStreak = activeToday > 0 ? Math.round((totalLessons / (userCount || 1)) * 10) / 10 : 0;

        setStats({
          totalUsers: userCount || 0,
          totalLessonsCompleted: totalLessons,
          activeToday,
          averageStreak: Math.min(avgStreak, 30), // Cap at 30 for display
        });

        setDailyStats(last7Days);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      }

      setIsLoading(false);
    };

    fetchStats();
  }, []);

  return { stats, dailyStats, isLoading, error };
}
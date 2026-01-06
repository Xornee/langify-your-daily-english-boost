import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type DailyGoal = Database['public']['Tables']['daily_goals']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];

export interface UserStats {
  totalXp: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  todayXp: number;
  todayLessonsCompleted: number;
  goalMet: boolean;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const fetchUserData = useCallback(async (userId: string) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileData) {
      setProfile(profileData);
      // User has completed onboarding if they have an industry_context set (including 'general')
      setHasCompletedOnboarding(!!profileData.industry_context);
    }

    // Fetch daily goal
    const { data: goalData } = await supabase
      .from('daily_goals')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (goalData) {
      setDailyGoal(goalData);
    }

    // Fetch user roles
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (rolesData) {
      setUserRoles(rolesData);
    }

    // Fetch stats
    await fetchUserStats(userId);
  }, []);

  const fetchUserStats = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's stats
    const { data: todayStats } = await supabase
      .from('user_daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    // Get all stats for totals and streak calculation
    const { data: allStats } = await supabase
      .from('user_daily_stats')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    // Get daily goal for goal_met calculation
    const { data: goalData } = await supabase
      .from('daily_goals')
      .select('target_xp_per_day')
      .eq('user_id', userId)
      .maybeSingle();

    // Calculate totals
    let totalXp = 0;
    let totalLessons = 0;
    if (allStats) {
      allStats.forEach(stat => {
        totalXp += stat.xp_earned || 0;
        totalLessons += stat.lessons_completed || 0;
      });
    }

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    if (allStats && allStats.length > 0) {
      const sortedStats = [...allStats].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      let prevDate: Date | null = null;
      for (const stat of sortedStats) {
        if (stat.goal_met) {
          if (!prevDate) {
            tempStreak = 1;
          } else {
            const dayDiff = Math.floor((prevDate.getTime() - new Date(stat.date).getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff === 1) {
              tempStreak++;
            } else {
              if (tempStreak > longestStreak) longestStreak = tempStreak;
              tempStreak = 1;
            }
          }
          prevDate = new Date(stat.date);
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 0;
          prevDate = null;
        }
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      
      // Current streak - check if today or yesterday had goal met
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const yesterdayDate = new Date(todayDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      
      currentStreak = 0;
      for (const stat of sortedStats) {
        const statDate = new Date(stat.date);
        statDate.setHours(0, 0, 0, 0);
        
        if (stat.goal_met) {
          if (statDate.getTime() === todayDate.getTime() || 
              (currentStreak === 0 && statDate.getTime() === yesterdayDate.getTime())) {
            currentStreak++;
          } else if (currentStreak > 0) {
            const expectedDate = new Date(todayDate);
            expectedDate.setDate(expectedDate.getDate() - currentStreak);
            if (statDate.getTime() === expectedDate.getTime()) {
              currentStreak++;
            } else {
              break;
            }
          } else {
            break;
          }
        } else if (statDate.getTime() !== todayDate.getTime()) {
          break;
        }
      }
    }

    const todayXp = todayStats?.xp_earned || 0;
    const todayLessons = todayStats?.lessons_completed || 0;
    const targetXp = goalData?.target_xp_per_day || 50;
    const goalMet = todayXp >= targetXp;

    setUserStats({
      totalXp,
      totalLessonsCompleted: totalLessons,
      currentStreak,
      longestStreak,
      todayXp,
      todayLessonsCompleted: todayLessons,
      goalMet,
    });
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setDailyGoal(null);
          setUserRoles([]);
          setUserStats(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name },
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (error) throw error;
    
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateDailyGoal = async (updates: Partial<DailyGoal>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('daily_goals')
      .update(updates)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    setDailyGoal(prev => prev ? { ...prev, ...updates } : null);
  };

  const addXp = async (amount: number) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const targetXp = dailyGoal?.target_xp_per_day || 50;
    
    // Upsert today's stats
    const { data: existing } = await supabase
      .from('user_daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();
    
    if (existing) {
      const newXp = (existing.xp_earned || 0) + amount;
      const goalMet = newXp >= targetXp;
      
      await supabase
        .from('user_daily_stats')
        .update({ 
          xp_earned: newXp,
          goal_met: goalMet 
        })
        .eq('id', existing.id);
    } else {
      const goalMet = amount >= targetXp;
      await supabase
        .from('user_daily_stats')
        .insert({
          user_id: user.id,
          date: today,
          xp_earned: amount,
          lessons_completed: 0,
          goal_met: goalMet,
        });
    }
    
    await fetchUserStats(user.id);
  };

  const completeLesson = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabase
      .from('user_daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();
    
    if (existing) {
      await supabase
        .from('user_daily_stats')
        .update({ 
          lessons_completed: (existing.lessons_completed || 0) + 1 
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('user_daily_stats')
        .insert({
          user_id: user.id,
          date: today,
          xp_earned: 0,
          lessons_completed: 1,
          goal_met: false,
        });
    }
    
    await fetchUserStats(user.id);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const hasRole = (role: 'admin' | 'teacher' | 'user'): boolean => {
    return userRoles.some(r => r.role === role);
  };

  return {
    user,
    session,
    profile,
    dailyGoal,
    userStats,
    isLoading,
    isAuthenticated: !!user,
    hasCompletedOnboarding,
    login,
    register,
    logout,
    updateProfile,
    updateDailyGoal,
    addXp,
    completeLesson,
    completeOnboarding,
    hasRole,
    refetchStats: () => user && fetchUserStats(user.id),
  };
}
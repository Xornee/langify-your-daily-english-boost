import React, { createContext, useContext } from 'react';
import { useSupabaseAuth, UserStats } from '@/hooks/useSupabaseAuth';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type DailyGoal = Database['public']['Tables']['daily_goals']['Row'];

// Mapped user interface for compatibility
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'TEACHER' | 'ADMIN';
  preferredInterfaceLanguage: string;
  industryContext: 'it' | 'finance' | 'office' | 'general';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userStats: UserStats | null;
  dailyGoal: { targetXpPerDay: number; targetLessonsPerDay: number } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<{ industryContext: string; preferredInterfaceLanguage: string; name: string }>) => Promise<void>;
  updateDailyGoal: (goal: Partial<{ targetXpPerDay: number; targetLessonsPerDay: number }>) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  completeLesson: () => Promise<void>;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  hasRole: (role: 'admin' | 'teacher' | 'user') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfileToUser(profile: Profile | null, hasRole: (role: 'admin' | 'teacher' | 'user') => boolean): User | null {
  if (!profile) return null;
  
  let role: 'USER' | 'TEACHER' | 'ADMIN' = 'USER';
  if (hasRole('admin')) role = 'ADMIN';
  else if (hasRole('teacher')) role = 'TEACHER';
  
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role,
    preferredInterfaceLanguage: profile.preferred_interface_language || 'pl',
    industryContext: profile.industry_context || 'general',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSupabaseAuth();
  
  const user = mapProfileToUser(auth.profile, auth.hasRole);
  
  const dailyGoal = auth.dailyGoal ? {
    targetXpPerDay: auth.dailyGoal.target_xp_per_day || 50,
    targetLessonsPerDay: auth.dailyGoal.target_lessons_per_day || 1,
  } : null;

  const updateUserProfile = async (updates: Partial<{ industryContext: string; preferredInterfaceLanguage: string; name: string }>) => {
    const mappedUpdates: Partial<Profile> = {};
    if (updates.industryContext) {
      mappedUpdates.industry_context = updates.industryContext as any;
    }
    if (updates.preferredInterfaceLanguage) {
      mappedUpdates.preferred_interface_language = updates.preferredInterfaceLanguage;
    }
    if (updates.name) {
      mappedUpdates.name = updates.name;
    }
    await auth.updateProfile(mappedUpdates);
  };

  const updateDailyGoal = async (goal: Partial<{ targetXpPerDay: number; targetLessonsPerDay: number }>) => {
    const mappedGoal: Partial<DailyGoal> = {};
    if (goal.targetXpPerDay !== undefined) {
      mappedGoal.target_xp_per_day = goal.targetXpPerDay;
    }
    if (goal.targetLessonsPerDay !== undefined) {
      mappedGoal.target_lessons_per_day = goal.targetLessonsPerDay;
    }
    await auth.updateDailyGoal(mappedGoal);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        userStats: auth.userStats,
        dailyGoal,
        login: auth.login,
        register: auth.register,
        logout: auth.logout,
        updateUserProfile,
        updateDailyGoal,
        addXp: auth.addXp,
        completeLesson: auth.completeLesson,
        hasCompletedOnboarding: auth.hasCompletedOnboarding,
        completeOnboarding: auth.completeOnboarding,
        hasRole: auth.hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, IndustryContext, InterfaceLanguage, UserStats, DailyGoal } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userStats: UserStats | null;
  dailyGoal: DailyGoal | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  updateDailyGoal: (goal: Partial<DailyGoal>) => void;
  addXp: (amount: number) => void;
  completLesson: () => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<string, { user: User; password: string }> = {
  'admin@langify.com': {
    user: {
      id: '1',
      email: 'admin@langify.com',
      name: 'Admin',
      role: 'ADMIN',
      preferredInterfaceLanguage: 'pl',
      industryContext: 'general',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    password: 'admin123',
  },
  'teacher@langify.com': {
    user: {
      id: '2',
      email: 'teacher@langify.com',
      name: 'Jan Kowalski',
      role: 'TEACHER',
      preferredInterfaceLanguage: 'pl',
      industryContext: 'it',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    password: 'teacher123',
  },
  'user@langify.com': {
    user: {
      id: '3',
      email: 'user@langify.com',
      name: 'Anna Nowak',
      role: 'USER',
      preferredInterfaceLanguage: 'pl',
      industryContext: 'finance',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    password: 'user123',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('langify-user');
    const storedOnboarding = localStorage.getItem('langify-onboarding-complete');
    const storedStats = localStorage.getItem('langify-stats');
    const storedGoal = localStorage.getItem('langify-goal');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedOnboarding === 'true') {
      setHasCompletedOnboarding(true);
    }
    if (storedStats) {
      setUserStats(JSON.parse(storedStats));
    } else {
      setUserStats({
        totalXp: 0,
        totalLessonsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        todayXp: 0,
        todayLessonsCompleted: 0,
        goalMet: false,
      });
    }
    if (storedGoal) {
      setDailyGoal(JSON.parse(storedGoal));
    } else {
      setDailyGoal({
        userId: '',
        targetXpPerDay: 50,
        targetLessonsPerDay: 1,
      });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const demoUser = demoUsers[email.toLowerCase()];
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      localStorage.setItem('langify-user', JSON.stringify(demoUser.user));
      return;
    }
    
    // Check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem('langify-registered-users') || '{}');
    if (registeredUsers[email.toLowerCase()] && registeredUsers[email.toLowerCase()].password === password) {
      setUser(registeredUsers[email.toLowerCase()].user);
      localStorage.setItem('langify-user', JSON.stringify(registeredUsers[email.toLowerCase()].user));
      return;
    }
    
    throw new Error('Invalid email or password');
  };

  const register = async (email: string, password: string, name: string) => {
    if (demoUsers[email.toLowerCase()]) {
      throw new Error('Email already exists');
    }
    
    const registeredUsers = JSON.parse(localStorage.getItem('langify-registered-users') || '{}');
    if (registeredUsers[email.toLowerCase()]) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: 'USER',
      preferredInterfaceLanguage: 'pl',
      industryContext: 'general',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    registeredUsers[email.toLowerCase()] = { user: newUser, password };
    localStorage.setItem('langify-registered-users', JSON.stringify(registeredUsers));
    
    setUser(newUser);
    localStorage.setItem('langify-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('langify-user');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      setUser(updatedUser);
      localStorage.setItem('langify-user', JSON.stringify(updatedUser));
      
      // Also update in registered users if applicable
      const registeredUsers = JSON.parse(localStorage.getItem('langify-registered-users') || '{}');
      if (registeredUsers[user.email.toLowerCase()]) {
        registeredUsers[user.email.toLowerCase()].user = updatedUser;
        localStorage.setItem('langify-registered-users', JSON.stringify(registeredUsers));
      }
    }
  };

  const updateDailyGoal = (goal: Partial<DailyGoal>) => {
    const newGoal = { ...dailyGoal, ...goal } as DailyGoal;
    setDailyGoal(newGoal);
    localStorage.setItem('langify-goal', JSON.stringify(newGoal));
  };

  const addXp = (amount: number) => {
    if (userStats && dailyGoal) {
      const newStats: UserStats = {
        ...userStats,
        totalXp: userStats.totalXp + amount,
        todayXp: userStats.todayXp + amount,
        goalMet: (userStats.todayXp + amount) >= dailyGoal.targetXpPerDay,
      };
      
      // Update streak if goal met
      if (newStats.goalMet && !userStats.goalMet) {
        newStats.currentStreak = userStats.currentStreak + 1;
        newStats.longestStreak = Math.max(newStats.currentStreak, userStats.longestStreak);
      }
      
      setUserStats(newStats);
      localStorage.setItem('langify-stats', JSON.stringify(newStats));
    }
  };

  const completLesson = () => {
    if (userStats) {
      const newStats: UserStats = {
        ...userStats,
        totalLessonsCompleted: userStats.totalLessonsCompleted + 1,
        todayLessonsCompleted: userStats.todayLessonsCompleted + 1,
      };
      setUserStats(newStats);
      localStorage.setItem('langify-stats', JSON.stringify(newStats));
    }
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('langify-onboarding-complete', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        userStats,
        dailyGoal,
        login,
        register,
        logout,
        updateUserProfile,
        updateDailyGoal,
        addXp,
        completLesson,
        hasCompletedOnboarding,
        completeOnboarding,
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

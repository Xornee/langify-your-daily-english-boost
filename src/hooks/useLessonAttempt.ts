import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useLessonAttempt() {
  const createAttempt = async (
    userId: string,
    lessonId: string
  ): Promise<string | null> => {
    const { data, error } = await supabase
      .from('lesson_attempts')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating lesson attempt:', error);
      return null;
    }

    return data.id;
  };

  const completeAttempt = async (
    attemptId: string,
    scorePercent: number,
    totalQuestions: number,
    correctAnswers: number,
    xpEarned: number
  ) => {
    const { error } = await supabase
      .from('lesson_attempts')
      .update({
        completed_at: new Date().toISOString(),
        score_percent: scorePercent,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        xp_earned: xpEarned,
      })
      .eq('id', attemptId);

    if (error) {
      console.error('Error completing lesson attempt:', error);
      return false;
    }

    return true;
  };

  const checkLessonCompleted = async (
    userId: string,
    lessonId: string
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from('lesson_attempts')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .not('completed_at', 'is', null)
      .limit(1);

    if (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  };

  return { createAttempt, completeAttempt, checkLessonCompleted };
}

// Hook to get all completed lesson IDs for a user
export function useCompletedLessons(userId: string | undefined) {
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompletedLessons = useCallback(async () => {
    if (!userId) {
      setCompletedLessonIds(new Set());
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('lesson_attempts')
      .select('lesson_id')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    if (error) {
      console.error('Error fetching completed lessons:', error);
    } else {
      setCompletedLessonIds(new Set(data?.map(d => d.lesson_id) ?? []));
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCompletedLessons();
  }, [fetchCompletedLessons]);

  return { completedLessonIds, isLoading, refetch: fetchCompletedLessons };
}
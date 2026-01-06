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

  return { createAttempt, completeAttempt };
}
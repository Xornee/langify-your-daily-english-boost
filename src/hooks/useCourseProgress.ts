import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  isStarted: boolean;
  isCompleted: boolean;
  progressPercent: number;
}

export function useCourseProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Map<string, CourseProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(new Map());
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setIsLoading(true);

      // Get all courses with their lesson counts
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, lessons_count')
        .eq('is_published', true);

      // Get all lesson IDs per course
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, course_id');

      // Get user's completed lessons (lessons where they have a completed attempt)
      const { data: attemptsData } = await supabase
        .from('lesson_attempts')
        .select('lesson_id, completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      // Build progress map
      const progressMap = new Map<string, CourseProgress>();
      const completedLessonIds = new Set(attemptsData?.map(a => a.lesson_id) || []);
      
      // Group lessons by course
      const lessonsByCourse = new Map<string, string[]>();
      lessonsData?.forEach(lesson => {
        const lessons = lessonsByCourse.get(lesson.course_id) || [];
        lessons.push(lesson.id);
        lessonsByCourse.set(lesson.course_id, lessons);
      });

      coursesData?.forEach(course => {
        const courseLessons = lessonsByCourse.get(course.id) || [];
        const completedCount = courseLessons.filter(id => completedLessonIds.has(id)).length;
        const totalLessons = course.lessons_count || courseLessons.length;
        
        progressMap.set(course.id, {
          courseId: course.id,
          completedLessons: completedCount,
          totalLessons,
          isStarted: completedCount > 0,
          isCompleted: totalLessons > 0 && completedCount >= totalLessons,
          progressPercent: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        });
      });

      setProgress(progressMap);
      setIsLoading(false);
    };

    fetchProgress();
  }, [user]);

  return { progress, isLoading };
}

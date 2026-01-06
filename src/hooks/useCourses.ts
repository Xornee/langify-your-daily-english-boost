import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type VocabularyItem = Database['public']['Tables']['vocabulary_items']['Row'];
type IndustryTag = Database['public']['Enums']['industry_context'];
type Level = Database['public']['Enums']['level'];

// Secure task type without correct_answer (for students)
export type SecureTask = Omit<Task, 'correct_answer'>;

export function useCourses(industryFilter?: string, levelFilter?: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    let query = supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (industryFilter && industryFilter !== 'all') {
      query = query.eq('industry_tag', industryFilter as IndustryTag);
    }
    
    if (levelFilter && levelFilter !== 'all') {
      query = query.eq('level', levelFilter as Level);
    }
    
    const { data, error } = await query;
    
    if (error) {
      setError(error.message);
    } else {
      setCourses(data || []);
    }
    setIsLoading(false);
  }, [industryFilter, levelFilter]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, isLoading, error, refetch: fetchCourses };
}

export function useCourse(courseId: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setIsLoading(false);
      return;
    }

    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();
      
      if (courseError) {
        setError(courseError.message);
        setIsLoading(false);
        return;
      }
      
      setCourse(courseData);
      
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_in_course', { ascending: true });
      
      if (lessonsError) {
        setError(lessonsError.message);
      } else {
        setLessons(lessonsData || []);
      }
      
      setIsLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  return { course, lessons, isLoading, error };
}

export function useLesson(lessonId: string | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [tasks, setTasks] = useState<SecureTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) {
      setIsLoading(false);
      return;
    }

    const fetchLesson = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .maybeSingle();
      
      if (lessonError) {
        setError(lessonError.message);
        setIsLoading(false);
        return;
      }
      
      setLesson(lessonData);
      
      // Use the secure view that doesn't expose correct_answer
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks_secure')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_in_lesson', { ascending: true });
      
      if (tasksError) {
        setError(tasksError.message);
      } else {
        setTasks((tasksData || []) as SecureTask[]);
      }
      
      setIsLoading(false);
    };

    fetchLesson();
  }, [lessonId]);

  return { lesson, tasks, isLoading, error };
}

// Function to check answer using secure RPC
export async function checkTaskAnswer(taskId: string, userAnswer: string): Promise<{
  is_correct: boolean;
  correct_answer: string;
  error?: string;
}> {
  const { data, error } = await supabase.rpc('check_task_answer', {
    p_task_id: taskId,
    p_user_answer: userAnswer
  });
  
  if (error) {
    console.error('Error checking answer:', error);
    return { is_correct: false, correct_answer: '', error: error.message };
  }
  
  return data as { is_correct: boolean; correct_answer: string };
}

// Function to get shuffled task options securely
export async function getTaskOptions(taskId: string): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_task_options', {
    p_task_id: taskId
  });
  
  if (error) {
    console.error('Error getting task options:', error);
    return [];
  }
  
  return (data || []) as string[];
}

export function useVocabularyItem(vocabularyId: string | undefined) {
  const [vocabularyItem, setVocabularyItem] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    if (!vocabularyId) return;

    const fetchVocabulary = async () => {
      const { data } = await supabase
        .from('vocabulary_items')
        .select('*')
        .eq('id', vocabularyId)
        .maybeSingle();
      
      setVocabularyItem(data);
    };

    fetchVocabulary();
  }, [vocabularyId]);

  return vocabularyItem;
}
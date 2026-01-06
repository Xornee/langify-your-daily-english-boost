import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StudentActivity {
  id: string;
  name: string;
  email: string;
  totalXp: number;
  lessonsCompleted: number;
  coursesStarted: number;
  coursesCompleted: number;
  lastActive: string | null;
  currentStreak: number;
}

export interface CourseStats {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  completedStudents: number;
  avgProgress: number;
  totalLessons: number;
}

export interface StudentCourseProgress {
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  lastAttempt: string | null;
  avgScore: number;
}

export function useTeacherStats() {
  const [students, setStudents] = useState<StudentActivity[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentCourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      // Fetch all profiles (students)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email');

      // Fetch all courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, lessons_count')
        .eq('is_published', true);

      // Fetch all lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, course_id');

      // Fetch all lesson attempts
      const { data: attempts } = await supabase
        .from('lesson_attempts')
        .select('user_id, lesson_id, completed_at, score_percent, started_at');

      // Fetch all daily stats
      const { data: dailyStats } = await supabase
        .from('user_daily_stats')
        .select('user_id, xp_earned, lessons_completed, date, goal_met')
        .order('date', { ascending: false });

      // Build student activity data
      const studentMap = new Map<string, StudentActivity>();
      
      profiles?.forEach(profile => {
        const userStats = dailyStats?.filter(s => s.user_id === profile.id) || [];
        const userAttempts = attempts?.filter(a => a.user_id === profile.id) || [];
        
        // Calculate total XP
        const totalXp = userStats.reduce((sum, s) => sum + (s.xp_earned || 0), 0);
        
        // Calculate lessons completed (unique completed lessons)
        const completedLessonIds = new Set(
          userAttempts.filter(a => a.completed_at).map(a => a.lesson_id)
        );
        
        // Calculate courses started/completed
        const lessonsByCourse = new Map<string, Set<string>>();
        lessons?.forEach(l => {
          if (!lessonsByCourse.has(l.course_id)) {
            lessonsByCourse.set(l.course_id, new Set());
          }
          lessonsByCourse.get(l.course_id)?.add(l.id);
        });
        
        let coursesStarted = 0;
        let coursesCompleted = 0;
        
        courses?.forEach(course => {
          const courseLessonIds = lessonsByCourse.get(course.id) || new Set();
          const userCompletedForCourse = [...courseLessonIds].filter(id => completedLessonIds.has(id)).length;
          
          if (userCompletedForCourse > 0) {
            coursesStarted++;
            if (userCompletedForCourse >= (course.lessons_count || courseLessonIds.size)) {
              coursesCompleted++;
            }
          }
        });
        
        // Calculate streak
        let currentStreak = 0;
        const sortedStats = userStats.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        const today = new Date().toISOString().split('T')[0];
        for (const stat of sortedStats) {
          if (stat.goal_met) {
            currentStreak++;
          } else if (stat.date !== today) {
            break;
          }
        }
        
        // Last active date
        const lastActive = sortedStats[0]?.date || null;
        
        studentMap.set(profile.id, {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          totalXp,
          lessonsCompleted: completedLessonIds.size,
          coursesStarted,
          coursesCompleted,
          lastActive,
          currentStreak,
        });
      });
      
      setStudents(Array.from(studentMap.values()).sort((a, b) => b.totalXp - a.totalXp));

      // Build course stats
      const courseStatsData: CourseStats[] = [];
      
      courses?.forEach(course => {
        const courseLessonIds = lessons?.filter(l => l.course_id === course.id).map(l => l.id) || [];
        const totalLessons = course.lessons_count || courseLessonIds.length;
        
        let studentsWithProgress = 0;
        let studentsCompleted = 0;
        let totalProgress = 0;
        
        profiles?.forEach(profile => {
          const userAttempts = attempts?.filter(a => 
            a.user_id === profile.id && 
            courseLessonIds.includes(a.lesson_id) &&
            a.completed_at
          ) || [];
          
          const uniqueCompleted = new Set(userAttempts.map(a => a.lesson_id)).size;
          
          if (uniqueCompleted > 0) {
            studentsWithProgress++;
            const progress = totalLessons > 0 ? (uniqueCompleted / totalLessons) * 100 : 0;
            totalProgress += progress;
            
            if (uniqueCompleted >= totalLessons) {
              studentsCompleted++;
            }
          }
        });
        
        courseStatsData.push({
          courseId: course.id,
          courseTitle: course.title,
          totalStudents: studentsWithProgress,
          completedStudents: studentsCompleted,
          avgProgress: studentsWithProgress > 0 ? Math.round(totalProgress / studentsWithProgress) : 0,
          totalLessons,
        });
      });
      
      setCourseStats(courseStatsData.sort((a, b) => b.totalStudents - a.totalStudents));

      // Build detailed student-course progress
      const progressData: StudentCourseProgress[] = [];
      
      profiles?.forEach(profile => {
        courses?.forEach(course => {
          const courseLessonIds = lessons?.filter(l => l.course_id === course.id).map(l => l.id) || [];
          const userAttempts = attempts?.filter(a => 
            a.user_id === profile.id && 
            courseLessonIds.includes(a.lesson_id)
          ) || [];
          
          if (userAttempts.length > 0) {
            const completedAttempts = userAttempts.filter(a => a.completed_at);
            const uniqueCompleted = new Set(completedAttempts.map(a => a.lesson_id)).size;
            const totalLessons = course.lessons_count || courseLessonIds.length;
            
            const avgScore = completedAttempts.length > 0
              ? Math.round(completedAttempts.reduce((sum, a) => sum + (a.score_percent || 0), 0) / completedAttempts.length)
              : 0;
            
            const lastAttempt = userAttempts
              .map(a => a.started_at)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null;
            
            progressData.push({
              studentId: profile.id,
              studentName: profile.name,
              courseId: course.id,
              courseTitle: course.title,
              completedLessons: uniqueCompleted,
              totalLessons,
              progressPercent: totalLessons > 0 ? Math.round((uniqueCompleted / totalLessons) * 100) : 0,
              lastAttempt,
              avgScore,
            });
          }
        });
      });
      
      setStudentProgress(progressData.sort((a, b) => {
        // Sort by student name, then by progress
        if (a.studentName === b.studentName) {
          return b.progressPercent - a.progressPercent;
        }
        return a.studentName.localeCompare(b.studentName);
      }));

      setIsLoading(false);
    };

    fetchStats();
  }, []);

  return { students, courseStats, studentProgress, isLoading };
}

import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCourse } from '@/hooks/useCourses';
import { ArrowLeft, Clock, BookOpen, Play, Loader2 } from 'lucide-react';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { t, language } = useLanguage();

  const { course, lessons, isLoading, error } = useCourse(courseId);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            {language === 'pl' ? 'Kurs nie został znaleziony' : 'Course not found'}
          </p>
          <Button asChild className="mt-4">
            <Link to="/courses">{t('common.back')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Link>
        </Button>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {course.level}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              {course.lessons_count} {t('courses.lessons')}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {course.estimated_minutes} {t('courses.minutes')}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.description}</p>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {language === 'pl' ? 'Lekcje' : 'Lessons'}
          </h2>
          
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="flex items-center gap-4 p-4 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{lesson.tasks_count} {language === 'pl' ? 'zadań' : 'tasks'}</span>
                      <span>{lesson.estimated_minutes} {t('courses.minutes')}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    <Play className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
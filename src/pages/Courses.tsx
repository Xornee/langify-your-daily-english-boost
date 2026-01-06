import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { Clock, BookOpen, ChevronRight, Loader2 } from 'lucide-react';

export default function Courses() {
  const { t, language } = useLanguage();
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  
  const { courses, isLoading, error } = useCourses(industryFilter, levelFilter);

  const industryOptions = [
    { value: 'all', label: t('courses.all') },
    { value: 'it', label: 'IT' },
    { value: 'finance', label: language === 'pl' ? 'Finanse' : 'Finance' },
    { value: 'office', label: language === 'pl' ? 'Biuro' : 'Office' },
    { value: 'general', label: language === 'pl' ? 'Ogólne' : 'General' },
  ];

  const levelOptions = [
    { value: 'all', label: t('courses.all') },
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
  ];

  const industryColors: Record<string, string> = {
    it: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    finance: 'bg-green-500/10 text-green-600 dark:text-green-400',
    office: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    general: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('courses.title')}</h1>
          <p className="text-muted-foreground">
            {language === 'pl'
              ? 'Wybierz kurs i zacznij się uczyć'
              : 'Choose a course and start learning'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{t('courses.filter.industry')}:</span>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{t('courses.filter.level')}:</span>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-all group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${industryColors[course.industry_tag || 'general']}`}>
                        {industryOptions.find(o => o.value === course.industry_tag)?.label || course.industry_tag}
                      </span>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons_count} {t('courses.lessons')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.estimated_minutes} {t('courses.minutes')}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full group-hover:bg-primary" asChild>
                      <Link to={`/courses/${course.id}`}>
                        {t('courses.start')}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'pl'
                    ? 'Nie znaleziono kursów dla wybranych filtrów'
                    : 'No courses found for selected filters'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
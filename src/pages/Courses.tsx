import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { courses, getLessonsForCourse } from '@/data/courses';
import type { IndustryContext, Level } from '@/types';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';

export default function Courses() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

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

  const filteredCourses = courses.filter((course) => {
    const matchesIndustry = industryFilter === 'all' || course.industryTag === industryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesIndustry && matchesLevel;
  });

  const industryColors: Record<IndustryContext, string> = {
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

        {/* Course Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${industryColors[course.industryTag]}`}>
                    {industryOptions.find(o => o.value === course.industryTag)?.label || course.industryTag}
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
                      {course.lessonsCount} {t('courses.lessons')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.estimatedMinutes} {t('courses.minutes')}
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

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === 'pl'
                ? 'Nie znaleziono kursów dla wybranych filtrów'
                : 'No courses found for selected filters'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

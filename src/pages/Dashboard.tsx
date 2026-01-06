import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCourses } from '@/hooks/useCourses';
import { 
  Flame, 
  Target, 
  BookOpen, 
  Trophy, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const { user, userStats, dailyGoal, isLoading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  
  const { courses, isLoading: coursesLoading } = useCourses(user?.industryContext, undefined);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const industryLabel: Record<string, string> = {
    it: language === 'pl' ? 'IT / Technologii' : 'IT / Technology',
    finance: language === 'pl' ? 'Finansów' : 'Finance',
    office: language === 'pl' ? 'Biura' : 'Office',
    general: language === 'pl' ? 'Ogólne' : 'General',
  };

  const progressPercent = dailyGoal && userStats 
    ? Math.min(100, (userStats.todayXp / dailyGoal.targetXpPerDay) * 100)
    : 0;

  const suggestedCourses = courses.slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('dashboard.greeting')}, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.englishFor')} {industryLabel[user.industryContext || 'general']}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Daily Goal */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{t('dashboard.todayGoal')}</span>
                </div>
                {userStats?.goalMet && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{userStats?.todayXp || 0} / {dailyGoal?.targetXpPerDay || 50} XP</span>
                  <span className="font-medium text-foreground">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              {userStats?.goalMet && (
                <p className="mt-2 text-sm text-primary font-medium">
                  {t('dashboard.goalComplete')} 🎉
                </p>
              )}
            </CardContent>
          </Card>

          {/* Streak */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-accent-foreground" />
                <span className="font-medium text-foreground">{t('dashboard.streak')}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {userStats?.currentStreak || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                {(userStats?.currentStreak || 0) === 1 ? t('dashboard.day') : t('dashboard.days')}
              </p>
            </CardContent>
          </Card>

          {/* Total XP */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{t('dashboard.totalXp')}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {userStats?.totalXp || 0}
              </p>
              <p className="text-sm text-muted-foreground">XP</p>
            </CardContent>
          </Card>

          {/* Lessons Completed */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{t('dashboard.lessonsCompleted')}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {userStats?.totalLessonsCompleted || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'pl' ? 'lekcji' : 'lessons'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">{t('dashboard.continue')}</h3>
              <p className="text-primary-foreground/80 mb-4">
                {language === 'pl' 
                  ? 'Kontynuuj od miejsca, w którym skończyłeś'
                  : 'Pick up where you left off'}
              </p>
              <Button variant="secondary" asChild>
                <Link to="/courses">
                  {t('dashboard.startLesson')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-accent-foreground" />
                <h3 className="text-xl font-bold text-foreground">{t('nav.leaderboard')}</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {language === 'pl'
                  ? 'Sprawdź swoją pozycję w rankingu'
                  : 'Check your position in the ranking'}
              </p>
              <Button variant="outline" asChild>
                <Link to="/leaderboard">
                  {language === 'pl' ? 'Zobacz ranking' : 'View ranking'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Courses */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {t('dashboard.suggestedForYou')}
          </h2>
          {coursesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestedCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {course.estimated_minutes} {t('courses.minutes')}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {course.lessons_count} {t('courses.lessons')}
                      </span>
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.id}`}>
                          {t('courses.start')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Shield, Users, BookOpen, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { t, language } = useLanguage();
  const { hasRole, isLoading: authLoading } = useAuth();
  const { stats, dailyStats, isLoading, error } = useAdminStats();

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // For demo purposes, allow all authenticated users to see admin panel
  // In production, you would check: if (!hasRole('admin')) return <Navigate to="/dashboard" />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('admin.title')}</h1>
            <p className="text-muted-foreground">
              {language === 'pl' ? 'Statystyki i analityka' : 'Statistics and analytics'}
            </p>
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
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{t('admin.totalUsers')}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalUsers.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pl' ? 'zarejestrowanych' : 'registered'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{t('admin.totalLessons')}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalLessonsCompleted.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pl' ? 'ukończonych' : 'completed'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{t('admin.activeToday')}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats?.activeToday || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pl' ? 'aktywnych użytkowników' : 'active users'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {language === 'pl' ? 'Średnia seria' : 'Avg. Streak'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats?.averageStreak || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pl' ? 'dni' : 'days'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Stats Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.dailyStats')}</CardTitle>
                <CardDescription>
                  {language === 'pl' ? 'Statystyki z ostatnich 7 dni' : 'Statistics from the last 7 days'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          {language === 'pl' ? 'Data' : 'Date'}
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          {language === 'pl' ? 'Aktywni użytkownicy' : 'Active Users'}
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          {language === 'pl' ? 'Ukończone lekcje' : 'Lessons Completed'}
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          {language === 'pl' ? 'Śr. lekcji/użytkownik' : 'Avg. Lessons/User'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyStats.map((day) => (
                        <tr key={day.date} className="border-b border-border last:border-0">
                          <td className="py-3 px-4 text-foreground">{day.date}</td>
                          <td className="py-3 px-4 text-right text-foreground">{day.users}</td>
                          <td className="py-3 px-4 text-right text-foreground">{day.lessons}</td>
                          <td className="py-3 px-4 text-right text-foreground">
                            {day.users > 0 ? (day.lessons / day.users).toFixed(1) : '0'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Retention Chart */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{language === 'pl' ? 'Aktywność w czasie' : 'Activity Over Time'}</CardTitle>
                <CardDescription>
                  {language === 'pl' 
                    ? 'Liczba ukończonych lekcji na dzień' 
                    : 'Number of completed lessons per day'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-around gap-2 bg-accent/30 rounded-lg p-4">
                  {dailyStats.map((day, index) => {
                    const maxLessons = Math.max(...dailyStats.map(d => d.lessons), 1);
                    const height = (day.lessons / maxLessons) * 120;
                    return (
                      <div key={day.date} className="flex flex-col items-center">
                        <div
                          className="w-10 bg-primary rounded-t transition-all"
                          style={{ height: `${Math.max(height, 4)}px` }}
                        />
                        <span className="text-xs text-muted-foreground mt-1">
                          {new Date(day.date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
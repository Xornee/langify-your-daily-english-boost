import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react';

export default function Admin() {
  const { t, language } = useLanguage();

  // Demo stats
  const stats = {
    totalUsers: 1247,
    totalLessonsCompleted: 8934,
    activeToday: 234,
    averageStreak: 4.2,
  };

  const dailyStats = [
    { date: '2024-01-01', users: 180, lessons: 450 },
    { date: '2024-01-02', users: 195, lessons: 520 },
    { date: '2024-01-03', users: 210, lessons: 580 },
    { date: '2024-01-04', users: 188, lessons: 490 },
    { date: '2024-01-05', users: 220, lessons: 610 },
    { date: '2024-01-06', users: 234, lessons: 670 },
    { date: '2024-01-07', users: 245, lessons: 720 },
  ];

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

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{t('admin.totalUsers')}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                +12% {language === 'pl' ? 'w tym tygodniu' : 'this week'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{t('admin.totalLessons')}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalLessonsCompleted.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                +8% {language === 'pl' ? 'w tym tygodniu' : 'this week'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{t('admin.activeToday')}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.activeToday}</p>
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
              <p className="text-3xl font-bold text-foreground">{stats.averageStreak}</p>
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
                        {(day.lessons / day.users).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Retention Chart Placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{language === 'pl' ? 'Retencja użytkowników' : 'User Retention'}</CardTitle>
            <CardDescription>
              {language === 'pl' 
                ? 'Procent użytkowników powracających każdego dnia' 
                : 'Percentage of users returning each day'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-accent/30 rounded-lg">
              <div className="flex gap-2 items-end">
                {[85, 72, 65, 58, 52, 48, 45].map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-10 bg-primary rounded-t"
                      style={{ height: `${value * 1.5}px` }}
                    />
                    <span className="text-xs text-muted-foreground mt-1">D{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4">
              {language === 'pl' 
                ? 'D1-D7: Dni od rejestracji' 
                : 'D1-D7: Days since registration'}
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLeaderboard, getUserRank } from '@/data/leaderboard';
import { Trophy, Medal, Crown, User } from 'lucide-react';

export default function Leaderboard() {
  const { user, userStats } = useAuth();
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState<'week' | 'all'>('week');

  const leaderboard = getLeaderboard(period);
  const userRank = user ? getUserRank(user.id, period) : null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-medium">{rank}</span>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('leaderboard.title')}</h1>
          <p className="text-muted-foreground">
            {language === 'pl'
              ? 'Rywalizuj z innymi i zdobywaj punkty!'
              : 'Compete with others and earn points!'}
          </p>
        </div>

        <Tabs value={period} onValueChange={(v) => setPeriod(v as 'week' | 'all')} className="max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="week">{t('leaderboard.thisWeek')}</TabsTrigger>
            <TabsTrigger value="all">{t('leaderboard.allTime')}</TabsTrigger>
          </TabsList>

          <TabsContent value={period}>
            {/* Top 3 Podium */}
            <div className="flex justify-center items-end gap-4 mb-8">
              {/* 2nd place */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-card border-2 border-gray-400 flex items-center justify-center mb-2">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground text-sm text-center">
                  {leaderboard[1]?.userName.split(' ')[0]}
                </p>
                <p className="text-sm text-muted-foreground">{leaderboard[1]?.points} {t('leaderboard.points')}</p>
                <div className="w-20 h-24 bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-lg mt-2 flex items-center justify-center">
                  <Medal className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center -mt-8">
                <div className="w-20 h-20 rounded-full bg-card border-4 border-yellow-500 flex items-center justify-center mb-2">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground text-center">
                  {leaderboard[0]?.userName.split(' ')[0]}
                </p>
                <p className="text-sm text-primary font-medium">{leaderboard[0]?.points} {t('leaderboard.points')}</p>
                <div className="w-24 h-32 bg-gradient-to-t from-yellow-400 to-yellow-300 dark:from-yellow-600 dark:to-yellow-500 rounded-t-lg mt-2 flex items-center justify-center">
                  <Crown className="h-10 w-10 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-card border-2 border-amber-600 flex items-center justify-center mb-2">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground text-sm text-center">
                  {leaderboard[2]?.userName.split(' ')[0]}
                </p>
                <p className="text-sm text-muted-foreground">{leaderboard[2]?.points} {t('leaderboard.points')}</p>
                <div className="w-20 h-16 bg-gradient-to-t from-amber-500 to-amber-400 dark:from-amber-700 dark:to-amber-600 rounded-t-lg mt-2 flex items-center justify-center">
                  <Medal className="h-6 w-6 text-amber-700 dark:text-amber-300" />
                </div>
              </div>
            </div>

            {/* Full List */}
            <Card>
              <CardContent className="p-0">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.userId === user?.id;
                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center gap-4 p-4 border-b border-border last:border-0 ${
                        isCurrentUser ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="w-8 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {entry.userName}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {language === 'pl' ? 'Ty' : 'You'}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        {entry.points} <span className="text-sm text-muted-foreground">{t('leaderboard.points')}</span>
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Current user position if not in top 10 */}
            {user && !userRank && userStats && (
              <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <p className="text-center text-muted-foreground mb-2">
                    {t('leaderboard.yourPosition')}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {userStats.totalXp} {t('leaderboard.points')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

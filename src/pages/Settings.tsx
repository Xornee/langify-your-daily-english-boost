import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { IndustryContext, InterfaceLanguage } from '@/types';
import { Settings as SettingsIcon, Globe, Moon, Volume2, Briefcase, Target, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, updateUserProfile, dailyGoal, updateDailyGoal } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [muteMode, setMuteMode] = useState(() => 
    localStorage.getItem('langify-mute') === 'true'
  );

  const handleLanguageChange = (value: InterfaceLanguage) => {
    setLanguage(value);
    updateUserProfile({ preferredInterfaceLanguage: value });
  };

  const handleIndustryChange = (value: IndustryContext) => {
    updateUserProfile({ industryContext: value });
    toast({
      title: t('settings.saved'),
      description: language === 'pl' ? 'Branża została zaktualizowana' : 'Industry has been updated',
    });
  };

  const handleMuteChange = (checked: boolean) => {
    setMuteMode(checked);
    localStorage.setItem('langify-mute', String(checked));
  };

  const handleGoalChange = (value: number[]) => {
    const xpValues = [50, 100, 150, 200];
    const lessonValues = [1, 2, 3, 4];
    updateDailyGoal({
      targetXpPerDay: xpValues[value[0]],
      targetLessonsPerDay: lessonValues[value[0]],
    });
  };

  const currentGoalIndex = dailyGoal 
    ? [50, 100, 150, 200].indexOf(dailyGoal.targetXpPerDay)
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('settings.language')}</CardTitle>
              </div>
              <CardDescription>
                {language === 'pl' 
                  ? 'Wybierz język interfejsu aplikacji'
                  : 'Choose the app interface language'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('settings.darkMode')}</CardTitle>
              </div>
              <CardDescription>
                {language === 'pl'
                  ? 'Włącz ciemny motyw interfejsu'
                  : 'Enable dark theme for the interface'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center gap-2">
                  {theme === 'dark' ? (language === 'pl' ? 'Włączony' : 'On') : (language === 'pl' ? 'Wyłączony' : 'Off')}
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mute Mode */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('settings.muteMode')}</CardTitle>
              </div>
              <CardDescription>
                {t('settings.muteDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="mute-mode" className="flex items-center gap-2">
                  {muteMode ? (language === 'pl' ? 'Włączony' : 'On') : (language === 'pl' ? 'Wyłączony' : 'Off')}
                </Label>
                <Switch
                  id="mute-mode"
                  checked={muteMode}
                  onCheckedChange={handleMuteChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Industry Context */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('settings.industry')}</CardTitle>
              </div>
              <CardDescription>
                {language === 'pl'
                  ? 'Dopasowujemy słownictwo do Twojej branży'
                  : "We'll tailor vocabulary to your industry"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={user?.industryContext || 'general'} 
                onValueChange={handleIndustryChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">💻 IT / {language === 'pl' ? 'Technologie' : 'Technology'}</SelectItem>
                  <SelectItem value="finance">💰 {language === 'pl' ? 'Finanse' : 'Finance'}</SelectItem>
                  <SelectItem value="office">🏢 {language === 'pl' ? 'Biuro' : 'Office'}</SelectItem>
                  <SelectItem value="general">🌐 {language === 'pl' ? 'Ogólne' : 'General'}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Daily Goal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('settings.dailyGoal')}</CardTitle>
              </div>
              <CardDescription>
                {language === 'pl'
                  ? 'Ustaw ile chcesz się uczyć każdego dnia'
                  : 'Set how much you want to learn each day'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={[currentGoalIndex >= 0 ? currentGoalIndex : 0]}
                  onValueChange={handleGoalChange}
                  max={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5 min</span>
                  <span>10 min</span>
                  <span>15 min</span>
                  <span>20 min</span>
                </div>
                <p className="text-center text-sm text-foreground">
                  {language === 'pl' ? 'Aktualny cel:' : 'Current goal:'}{' '}
                  <span className="font-medium text-primary">
                    {dailyGoal?.targetXpPerDay || 50} XP / {language === 'pl' ? 'dzień' : 'day'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

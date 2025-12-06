import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import type { IndustryContext } from '@/types';
import { 
  Monitor, 
  DollarSign, 
  Building2, 
  Globe,
  ArrowRight,
  Target,
  Clock
} from 'lucide-react';

type OnboardingStep = 'industry' | 'goal';

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUserProfile, updateDailyGoal, completeOnboarding } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<OnboardingStep>('industry');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryContext>('general');
  const [selectedGoal, setSelectedGoal] = useState<number>(1);

  const industries = [
    { id: 'it' as IndustryContext, icon: Monitor, label: t('onboarding.it') },
    { id: 'finance' as IndustryContext, icon: DollarSign, label: t('onboarding.finance') },
    { id: 'office' as IndustryContext, icon: Building2, label: t('onboarding.office') },
    { id: 'general' as IndustryContext, icon: Globe, label: t('onboarding.general') },
  ];

  const goals = [
    { lessons: 1, xp: 50, label: t('onboarding.minutes5') },
    { lessons: 2, xp: 100, label: t('onboarding.minutes10') },
    { lessons: 3, xp: 150, label: t('onboarding.minutes15') },
  ];

  const handleNext = () => {
    if (step === 'industry') {
      updateUserProfile({ industryContext: selectedIndustry });
      setStep('goal');
    } else {
      const goal = goals[selectedGoal];
      updateDailyGoal({ 
        targetLessonsPerDay: goal.lessons,
        targetXpPerDay: goal.xp,
      });
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-accent/30 to-background px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              {step === 'industry' ? (
                <Building2 className="h-7 w-7 text-primary-foreground" />
              ) : (
                <Target className="h-7 w-7 text-primary-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === 'industry' ? t('onboarding.chooseIndustry') : t('onboarding.setGoal')}
            </CardTitle>
            <CardDescription>
              {step === 'industry' ? t('onboarding.industryDesc') : t('onboarding.goalDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'industry' ? (
              <div className="grid grid-cols-2 gap-4">
                {industries.map((industry) => {
                  const Icon = industry.icon;
                  const isSelected = selectedIndustry === industry.id;
                  return (
                    <button
                      key={industry.id}
                      onClick={() => setSelectedIndustry(industry.id)}
                      className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-medium text-foreground">{industry.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal, index) => {
                  const isSelected = selectedGoal === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedGoal(index)}
                      className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                      }`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{goal.label}</p>
                        <p className="text-sm text-muted-foreground">{goal.xp} XP / dzień</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                {t('onboarding.skip')}
              </Button>
              <Button onClick={handleNext} className="flex-1">
                {step === 'goal' ? t('onboarding.start') : 'Dalej'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Step indicator */}
            <div className="mt-6 flex justify-center gap-2">
              <div className={`h-2 w-8 rounded-full ${step === 'industry' ? 'bg-primary' : 'bg-border'}`} />
              <div className={`h-2 w-8 rounded-full ${step === 'goal' ? 'bg-primary' : 'bg-border'}`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { 
  BookOpen, 
  Target, 
  Zap, 
  Trophy,
  ArrowRight,
  Globe,
  Briefcase,
  TrendingUp
} from 'lucide-react';

export default function Landing() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Briefcase,
      title: t('landing.features.personalized'),
      description: t('landing.features.personalizedDesc'),
    },
    {
      icon: Trophy,
      title: t('landing.features.gamification'),
      description: t('landing.features.gamificationDesc'),
    },
    {
      icon: Zap,
      title: t('landing.features.quick'),
      description: t('landing.features.quickDesc'),
    },
  ];

  const industries = [
    { icon: '💻', name: language === 'pl' ? 'IT / Technologie' : 'IT / Technology' },
    { icon: '💰', name: language === 'pl' ? 'Finanse' : 'Finance' },
    { icon: '🏢', name: language === 'pl' ? 'Biuro' : 'Office' },
    { icon: '📊', name: language === 'pl' ? 'Marketing' : 'Marketing' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'pl' ? 'Dołącz do 10,000+ uczących się' : 'Join 10,000+ learners'}
              </span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              {t('landing.title')}
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl">
              {t('landing.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/auth/register">
                  {t('landing.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/auth/login">
                  {t('auth.login')}
                </Link>
              </Button>
            </div>

            {/* Industry tags */}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {industries.map((industry) => (
                <div
                  key={industry.name}
                  className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2"
                >
                  <span>{industry.icon}</span>
                  <span className="text-sm font-medium text-foreground">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/50 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {language === 'pl' ? 'Dlaczego Langify?' : 'Why Langify?'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {language === 'pl' ? 'Jak to działa?' : 'How it works?'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: language === 'pl' ? 'Wybierz branżę' : 'Choose your industry',
                description: language === 'pl' 
                  ? 'Dopasujemy słownictwo do Twojej pracy'
                  : "We'll tailor vocabulary to your work",
              },
              {
                step: '2',
                title: language === 'pl' ? 'Ustaw cel' : 'Set your goal',
                description: language === 'pl'
                  ? 'Zdecyduj ile chcesz uczyć się dziennie'
                  : 'Decide how much you want to learn daily',
              },
              {
                step: '3',
                title: language === 'pl' ? 'Ucz się codziennie' : 'Learn daily',
                description: language === 'pl'
                  ? 'Krótkie sesje, duże postępy'
                  : 'Short sessions, big progress',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            {language === 'pl' ? 'Gotowy do nauki?' : 'Ready to learn?'}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {language === 'pl'
              ? 'Dołącz do tysięcy osób, które codziennie rozwijają swój angielski z Langify.'
              : 'Join thousands of people who improve their English with Langify every day.'}
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <Link to="/auth/register">
              {t('landing.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

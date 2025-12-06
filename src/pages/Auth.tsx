import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { BookOpen, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const location = useLocation();
  const isLogin = location.pathname === '/auth/login';
  const navigate = useNavigate();
  const { login, register, hasCompletedOnboarding } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
      } else {
        if (password !== confirmPassword) {
          setError('Hasła nie są identyczne');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Hasło musi mieć minimum 6 znaków');
          setIsLoading(false);
          return;
        }
        await register(email, password, name);
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-accent/30 to-background px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? t('auth.login') : t('auth.register')}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Zaloguj się, aby kontynuować naukę'
                : 'Utwórz konto i zacznij się uczyć'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jan Kowalski"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Ładowanie...' : isLogin ? t('auth.login') : t('auth.register')}
              </Button>

              {/* Demo accounts info */}
              {isLogin && (
                <div className="rounded-lg bg-accent/50 p-3 text-sm">
                  <p className="font-medium text-foreground mb-2">Konta testowe:</p>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• admin@langify.com / admin123 (Admin)</li>
                    <li>• teacher@langify.com / teacher123 (Nauczyciel)</li>
                    <li>• user@langify.com / user123 (Użytkownik)</li>
                  </ul>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              {isLogin ? (
                <>
                  {t('auth.noAccount')}{' '}
                  <Link to="/auth/register" className="font-medium text-primary hover:underline">
                    {t('auth.register')}
                  </Link>
                </>
              ) : (
                <>
                  {t('auth.hasAccount')}{' '}
                  <Link to="/auth/login" className="font-medium text-primary hover:underline">
                    {t('auth.login')}
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

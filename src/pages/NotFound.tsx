import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-accent/30 to-background px-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-8xl font-bold text-primary">404</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            {language === 'pl' ? 'Strona nie znaleziona' : 'Page not found'}
          </h1>
          <p className="mb-8 text-muted-foreground max-w-md">
            {language === 'pl' 
              ? 'Przepraszamy, strona której szukasz nie istnieje lub została przeniesiona.'
              : "Sorry, the page you're looking for doesn't exist or has been moved."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'pl' ? 'Wróć' : 'Go back'}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                {language === 'pl' ? 'Strona główna' : 'Home page'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
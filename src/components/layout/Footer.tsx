import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Langify</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'pl' 
              ? '© 2024 Langify. Wszelkie prawa zastrzeżone.'
              : '© 2024 Langify. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

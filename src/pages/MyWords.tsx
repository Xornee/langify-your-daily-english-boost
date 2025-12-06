import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { vocabularyItems } from '@/data/courses';
import type { VocabularyItem } from '@/types';
import { BookMarked, Search, Trash2, RotateCcw, Check, X, BookOpen } from 'lucide-react';

export default function MyWords() {
  const { t, language } = useLanguage();
  const [userWords, setUserWords] = useState<VocabularyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [practiceResults, setPracticeResults] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 });

  useEffect(() => {
    const savedWordIds = JSON.parse(localStorage.getItem('langify-vocabulary') || '[]');
    const words = savedWordIds
      .map((id: string) => vocabularyItems.find(v => v.id === id))
      .filter(Boolean) as VocabularyItem[];
    setUserWords(words);
  }, []);

  const filteredWords = userWords.filter(word =>
    word.englishWordOrPhrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveWord = (wordId: string) => {
    const savedWordIds = JSON.parse(localStorage.getItem('langify-vocabulary') || '[]');
    const newWordIds = savedWordIds.filter((id: string) => id !== wordId);
    localStorage.setItem('langify-vocabulary', JSON.stringify(newWordIds));
    setUserWords(prev => prev.filter(w => w.id !== wordId));
  };

  const startPractice = () => {
    if (userWords.length === 0) return;
    setIsPracticing(true);
    setPracticeIndex(0);
    setIsFlipped(false);
    setPracticeResults({ correct: 0, incorrect: 0 });
  };

  const handlePracticeAnswer = (correct: boolean) => {
    setPracticeResults(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));

    if (practiceIndex < userWords.length - 1) {
      setPracticeIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Practice complete
      setIsPracticing(false);
    }
  };

  if (isPracticing && userWords.length > 0) {
    const currentWord = userWords[practiceIndex];

    return (
      <Layout showFooter={false}>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-accent/30 to-background px-4">
          <div className="w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" onClick={() => setIsPracticing(false)}>
                {t('common.back')}
              </Button>
              <span className="text-muted-foreground">
                {practiceIndex + 1}/{userWords.length}
              </span>
            </div>

            <Card
              className="min-h-[280px] flex items-center justify-center cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <CardContent className="text-center p-8">
                {!isFlipped ? (
                  <>
                    <p className="text-3xl font-bold text-foreground mb-4">
                      {currentWord.englishWordOrPhrase}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('lesson.flipCard')} 👆
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-primary mb-4">
                      {currentWord.translation}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {currentWord.exampleSentence}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {isFlipped && (
              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 h-14"
                  onClick={() => handlePracticeAnswer(false)}
                >
                  <X className="mr-2 h-5 w-5 text-destructive" />
                  {t('lesson.dontKnow')}
                </Button>
                <Button
                  className="flex-1 h-14"
                  onClick={() => handlePracticeAnswer(true)}
                >
                  <Check className="mr-2 h-5 w-5" />
                  {t('lesson.iKnow')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('myWords.title')}</h1>
            <p className="text-muted-foreground">
              {userWords.length} {language === 'pl' ? 'słówek' : 'words'}
            </p>
          </div>
          {userWords.length > 0 && (
            <Button onClick={startPractice}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('myWords.practice')}
            </Button>
          )}
        </div>

        {userWords.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('myWords.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {userWords.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-2">{t('myWords.empty')}</p>
            <p className="text-sm text-muted-foreground">
              {language === 'pl'
                ? 'Dodaj słówka podczas nauki lekcji'
                : 'Add words while learning lessons'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWords.map((word) => (
              <Card key={word.id} className="group">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {word.englishWordOrPhrase}
                      </p>
                      <p className="text-primary font-medium">{word.translation}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveWord(word.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    {word.exampleSentence}
                  </p>
                  {word.industryTag && (
                    <span className="inline-block mt-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                      {word.industryTag}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Practice results */}
        {!isPracticing && practiceResults.correct + practiceResults.incorrect > 0 && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-4">
                {language === 'pl' ? 'Wyniki ostatniej sesji' : 'Last session results'}
              </h3>
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-foreground">{practiceResults.correct} {language === 'pl' ? 'poprawnych' : 'correct'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-destructive" />
                  <span className="text-foreground">{practiceResults.incorrect} {language === 'pl' ? 'błędnych' : 'incorrect'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

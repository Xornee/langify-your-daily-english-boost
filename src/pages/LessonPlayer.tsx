import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLesson, checkTaskAnswer, getTaskOptions, type SecureTask } from '@/hooks/useCourses';
import { useUserVocabulary } from '@/hooks/useUserVocabulary';
import { useLessonAttempt } from '@/hooks/useLessonAttempt';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  RotateCcw,
  Trophy,
  Plus,
  BookMarked,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AnswerState = 'pending' | 'correct' | 'incorrect';

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addXp, completeLesson, user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const { lesson, tasks, isLoading, error } = useLesson(lessonId);
  const { addToVocabulary } = useUserVocabulary(user?.id);
  const { createAttempt, completeAttempt, checkLessonCompleted } = useLessonAttempt();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('pending');
  const [correctCount, setCorrectCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);

  const currentTask = tasks[currentTaskIndex];
  const progress = tasks.length > 0 ? ((currentTaskIndex) / tasks.length) * 100 : 0;

  // Check if lesson was already completed and create attempt
  useEffect(() => {
    if (lesson && user && !attemptId) {
      // Check if already completed
      checkLessonCompleted(user.id, lesson.id).then(completed => {
        setAlreadyCompleted(completed);
      });
      // Create new attempt
      createAttempt(user.id, lesson.id).then(id => {
        if (id) setAttemptId(id);
      });
    }
  }, [lesson, user, attemptId, createAttempt, checkLessonCompleted]);

  useEffect(() => {
    // Reset state when task changes
    setSelectedAnswer(null);
    setAnswerState('pending');
    setIsFlipped(false);
    setRevealedAnswer(null);
    setShuffledAnswers([]);
    
    // Fetch shuffled options for multiple choice tasks
    if (currentTask && currentTask.type !== 'FLASHCARD') {
      getTaskOptions(currentTask.id).then(options => {
        setShuffledAnswers(options);
      });
    }
  }, [currentTaskIndex, currentTask?.id]);

  // State for shuffled answers (fetched securely from server)
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!lesson || tasks.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            {language === 'pl' ? 'Lekcja nie została znaleziona' : 'Lesson not found'}
          </p>
          <Button asChild className="mt-4">
            <Link to="/courses">{t('common.back')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleCheckAnswer = async () => {
    if (!selectedAnswer || !currentTask) return;
    
    setIsCheckingAnswer(true);
    
    // Use secure RPC to check answer
    const result = await checkTaskAnswer(currentTask.id, selectedAnswer);
    
    setRevealedAnswer(result.correct_answer);
    const isCorrect = result.is_correct;
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    
    setIsCheckingAnswer(false);
  };

  const handleFlashcardKnow = async (knows: boolean) => {
    setIsCheckingAnswer(true);
    
    // For flashcards, we need to get the correct answer to display
    const result = await checkTaskAnswer(currentTask.id, '');
    setRevealedAnswer(result.correct_answer);
    
    setAnswerState(knows ? 'correct' : 'incorrect');
    if (knows) {
      setCorrectCount(prev => prev + 1);
    }
    
    setIsCheckingAnswer(false);
  };

  const handleNext = async () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else {
      // Lesson complete
      const scorePercent = Math.round((correctCount / tasks.length) * 100);
      const xpEarned = Math.round(10 + (scorePercent / 100) * 40); // 10-50 XP based on score
      
      // Save attempt
      if (attemptId) {
        await completeAttempt(attemptId, scorePercent, tasks.length, correctCount, xpEarned);
      }
      
      // Only award XP if not already completed
      if (!alreadyCompleted) {
        await addXp(xpEarned);
        await completeLesson();
      }
      setIsComplete(true);
    }
  };

  const handleAddToVocabulary = async (vocabularyId: string) => {
    const success = await addToVocabulary(vocabularyId);
    if (success) {
      setAddedWords(prev => new Set(prev).add(vocabularyId));
      toast({
        title: language === 'pl' ? 'Dodano!' : 'Added!',
        description: language === 'pl' ? 'Słówko zostało dodane do Twoich słówek' : 'Word added to your vocabulary',
      });
    }
  };

  // Complete screen
  if (isComplete) {
    const scorePercent = Math.round((correctCount / tasks.length) * 100);
    const xpEarned = alreadyCompleted ? 0 : Math.round(10 + (scorePercent / 100) * 40);

    return (
      <Layout showFooter={false}>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-accent/30 to-background px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {language === 'pl' ? 'Lekcja ukończona!' : 'Lesson complete!'}
              </h2>

              {alreadyCompleted && (
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'pl' ? '(Powtórka - bez XP)' : '(Review - no XP)'}
                </p>
              )}
              
              <div className="my-6 space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-accent/50">
                  <span className="text-muted-foreground">{t('lesson.result')}</span>
                  <span className="text-2xl font-bold text-foreground">{scorePercent}%</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
                  <span className="text-muted-foreground">{t('lesson.xpEarned')}</span>
                  <span className="text-2xl font-bold text-primary">+{xpEarned} XP</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-accent/50">
                  <span className="text-muted-foreground">
                    {language === 'pl' ? 'Poprawne odpowiedzi' : 'Correct answers'}
                  </span>
                  <span className="text-xl font-bold text-foreground">{correctCount}/{tasks.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" onClick={() => navigate(`/courses/${lesson.course_id}`)}>
                  {t('lesson.backToCourse')}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  setCurrentTaskIndex(0);
                  setCorrectCount(0);
                  setIsComplete(false);
                  setAttemptId(null);
                }}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('lesson.tryAgain')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
          <div className="container mx-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{lesson.title}</span>
                <span className="text-sm text-muted-foreground">
                  {currentTaskIndex + 1}/{tasks.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Task Content */}
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {currentTask.type === 'FLASHCARD' ? (
            // Flashcard Task
            <div className="space-y-6">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`cursor-pointer transition-all duration-500 ${
                  isFlipped ? 'scale-95' : ''
                }`}
              >
                <Card className="min-h-[280px] flex items-center justify-center">
                  <CardContent className="text-center p-8">
                    {!isFlipped ? (
                      <>
                        <p className="text-3xl font-bold text-foreground mb-2">
                          {currentTask.question_text}
                        </p>
                        {currentTask.question_extra && (
                          <p className="text-muted-foreground">{currentTask.question_extra}</p>
                        )}
                        <p className="mt-4 text-sm text-muted-foreground">
                          {t('lesson.flipCard')} 👆
                        </p>
                      </>
                    ) : (
                      <p className="text-3xl font-bold text-primary">
                        {revealedAnswer || '...'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {isFlipped && answerState === 'pending' && (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-14"
                    onClick={() => handleFlashcardKnow(false)}
                  >
                    <X className="mr-2 h-5 w-5 text-destructive" />
                    {t('lesson.dontKnow')}
                  </Button>
                  <Button
                    className="flex-1 h-14"
                    onClick={() => handleFlashcardKnow(true)}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    {t('lesson.iKnow')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Multiple Choice / Gap Fill Task
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xl font-semibold text-foreground text-center">
                    {currentTask.question_text}
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-3">
                {shuffledAnswers.map((answer, index) => {
                  let buttonClass = 'justify-start h-auto py-4 px-4 text-left';
                  
                  if (answerState !== 'pending' && revealedAnswer) {
                    if (answer === revealedAnswer) {
                      buttonClass += ' bg-green-500/10 border-green-500 text-green-700 dark:text-green-400';
                    } else if (answer === selectedAnswer && answerState === 'incorrect') {
                      buttonClass += ' bg-destructive/10 border-destructive text-destructive';
                    }
                  } else if (selectedAnswer === answer) {
                    buttonClass += ' border-primary bg-primary/5';
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={buttonClass}
                      onClick={() => answerState === 'pending' && setSelectedAnswer(answer)}
                      disabled={answerState !== 'pending'}
                    >
                      <span className="font-medium">{answer}</span>
                      {answerState !== 'pending' && revealedAnswer && answer === revealedAnswer && (
                        <Check className="ml-auto h-5 w-5 text-green-500" />
                      )}
                      {answerState === 'incorrect' && answer === selectedAnswer && (
                        <X className="ml-auto h-5 w-5 text-destructive" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback */}
          {answerState !== 'pending' && (
            <div className={`mt-6 p-4 rounded-lg ${
              answerState === 'correct' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-destructive/10 border border-destructive/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {answerState === 'correct' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-destructive" />
                )}
                <span className={`font-medium ${
                  answerState === 'correct' ? 'text-green-700 dark:text-green-400' : 'text-destructive'
                }`}>
                  {answerState === 'correct' ? t('lesson.correct') : t('lesson.incorrect')}
                </span>
              </div>
              
              {answerState === 'incorrect' && currentTask.type !== 'FLASHCARD' && revealedAnswer && (
                <p className="text-sm text-muted-foreground">
                  {t('lesson.correctAnswer')}: <span className="font-medium text-foreground">{revealedAnswer}</span>
                </p>
              )}

              {/* Add to vocabulary button */}
              {currentTask.vocabulary_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleAddToVocabulary(currentTask.vocabulary_id!)}
                  disabled={addedWords.has(currentTask.vocabulary_id)}
                >
                  {addedWords.has(currentTask.vocabulary_id) ? (
                    <>
                      <BookMarked className="mr-2 h-4 w-4" />
                      {t('lesson.added')}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('lesson.addToWords')}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8">
            {answerState === 'pending' && currentTask.type !== 'FLASHCARD' ? (
              <Button 
                className="w-full h-14 text-lg"
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer || isCheckingAnswer}
              >
                {isCheckingAnswer ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {t('lesson.check')}
              </Button>
            ) : answerState !== 'pending' && (
              <Button 
                className="w-full h-14 text-lg"
                onClick={handleNext}
              >
                {currentTaskIndex < tasks.length - 1 ? t('lesson.next') : t('lesson.finish')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courses, lessons, tasks } from '@/data/courses';
import type { IndustryContext, Level, TaskType } from '@/types';
import { GraduationCap, Plus, BookOpen, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Teacher() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    industryTag: 'general' as IndustryContext,
    level: 'A2' as Level,
  });
  
  const [newLesson, setNewLesson] = useState({
    courseId: '',
    title: '',
    description: '',
  });
  
  const [newTask, setNewTask] = useState({
    lessonId: '',
    type: 'MULTIPLE_CHOICE' as TaskType,
    questionText: '',
    correctAnswer: '',
    incorrectAnswers: '',
  });

  // Filter courses created by current user (in demo, show all)
  const myCourses = courses;
  const myLessons = lessons;

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: language === 'pl' ? 'Wypełnij wszystkie pola' : 'Fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'pl' ? 'Sukces!' : 'Success!',
      description: language === 'pl' ? 'Kurs został utworzony (demo)' : 'Course created (demo)',
    });
    
    setNewCourse({
      title: '',
      description: '',
      industryTag: 'general',
      level: 'A2',
    });
  };

  const handleCreateLesson = () => {
    if (!newLesson.title || !newLesson.courseId) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: language === 'pl' ? 'Wypełnij wszystkie pola' : 'Fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'pl' ? 'Sukces!' : 'Success!',
      description: language === 'pl' ? 'Lekcja została dodana (demo)' : 'Lesson added (demo)',
    });
    
    setNewLesson({
      courseId: '',
      title: '',
      description: '',
    });
  };

  const handleCreateTask = () => {
    if (!newTask.questionText || !newTask.correctAnswer || !newTask.lessonId) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: language === 'pl' ? 'Wypełnij wszystkie pola' : 'Fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'pl' ? 'Sukces!' : 'Success!',
      description: language === 'pl' ? 'Zadanie zostało dodane (demo)' : 'Task added (demo)',
    });
    
    setNewTask({
      lessonId: '',
      type: 'MULTIPLE_CHOICE',
      questionText: '',
      correctAnswer: '',
      incorrectAnswers: '',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('teacher.title')}</h1>
            <p className="text-muted-foreground">
              {language === 'pl' ? 'Twórz i zarządzaj kursami' : 'Create and manage courses'}
            </p>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">{t('teacher.myCourses')}</TabsTrigger>
            <TabsTrigger value="create-course">{t('teacher.createCourse')}</TabsTrigger>
            <TabsTrigger value="add-lesson">{t('teacher.addLesson')}</TabsTrigger>
            <TabsTrigger value="add-task">{t('teacher.addTask')}</TabsTrigger>
          </TabsList>

          {/* My Courses */}
          <TabsContent value="courses">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {course.lessonsCount} {t('courses.lessons')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Course */}
          <TabsContent value="create-course">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>{t('teacher.createCourse')}</CardTitle>
                <CardDescription>
                  {language === 'pl' ? 'Utwórz nowy kurs dla swoich uczniów' : 'Create a new course for your students'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('teacher.courseTitle')}</Label>
                  <Input
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder={language === 'pl' ? 'np. Angielski dla programistów' : 'e.g. English for Developers'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('teacher.courseDesc')}</Label>
                  <Textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder={language === 'pl' ? 'Opis kursu...' : 'Course description...'}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('courses.filter.industry')}</Label>
                    <Select
                      value={newCourse.industryTag}
                      onValueChange={(v) => setNewCourse({ ...newCourse, industryTag: v as IndustryContext })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="finance">{language === 'pl' ? 'Finanse' : 'Finance'}</SelectItem>
                        <SelectItem value="office">{language === 'pl' ? 'Biuro' : 'Office'}</SelectItem>
                        <SelectItem value="general">{language === 'pl' ? 'Ogólne' : 'General'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('courses.filter.level')}</Label>
                    <Select
                      value={newCourse.level}
                      onValueChange={(v) => setNewCourse({ ...newCourse, level: v as Level })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="C1">C1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateCourse} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('teacher.createCourse')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Lesson */}
          <TabsContent value="add-lesson">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>{t('teacher.addLesson')}</CardTitle>
                <CardDescription>
                  {language === 'pl' ? 'Dodaj nową lekcję do istniejącego kursu' : 'Add a new lesson to an existing course'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'pl' ? 'Kurs' : 'Course'}</Label>
                  <Select
                    value={newLesson.courseId}
                    onValueChange={(v) => setNewLesson({ ...newLesson, courseId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'pl' ? 'Wybierz kurs' : 'Select course'} />
                    </SelectTrigger>
                    <SelectContent>
                      {myCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('teacher.lessonTitle')}</Label>
                  <Input
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    placeholder={language === 'pl' ? 'np. Podstawowe zwroty' : 'e.g. Basic phrases'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'pl' ? 'Opis' : 'Description'}</Label>
                  <Textarea
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                    placeholder={language === 'pl' ? 'Opis lekcji...' : 'Lesson description...'}
                    rows={2}
                  />
                </div>
                <Button onClick={handleCreateLesson} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('teacher.addLesson')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Task */}
          <TabsContent value="add-task">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>{t('teacher.addTask')}</CardTitle>
                <CardDescription>
                  {language === 'pl' ? 'Dodaj nowe zadanie do lekcji' : 'Add a new task to a lesson'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'pl' ? 'Lekcja' : 'Lesson'}</Label>
                  <Select
                    value={newTask.lessonId}
                    onValueChange={(v) => setNewTask({ ...newTask, lessonId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'pl' ? 'Wybierz lekcję' : 'Select lesson'} />
                    </SelectTrigger>
                    <SelectContent>
                      {myLessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('teacher.taskType')}</Label>
                  <Select
                    value={newTask.type}
                    onValueChange={(v) => setNewTask({ ...newTask, type: v as TaskType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FLASHCARD">{language === 'pl' ? 'Fiszka' : 'Flashcard'}</SelectItem>
                      <SelectItem value="MULTIPLE_CHOICE">{language === 'pl' ? 'Wybór wielokrotny' : 'Multiple choice'}</SelectItem>
                      <SelectItem value="GAP_FILL">{language === 'pl' ? 'Uzupełnij lukę' : 'Gap fill'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('teacher.question')}</Label>
                  <Input
                    value={newTask.questionText}
                    onChange={(e) => setNewTask({ ...newTask, questionText: e.target.value })}
                    placeholder={language === 'pl' ? 'Treść pytania' : 'Question text'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('teacher.correctAnswer')}</Label>
                  <Input
                    value={newTask.correctAnswer}
                    onChange={(e) => setNewTask({ ...newTask, correctAnswer: e.target.value })}
                    placeholder={language === 'pl' ? 'Poprawna odpowiedź' : 'Correct answer'}
                  />
                </div>
                {newTask.type !== 'FLASHCARD' && (
                  <div className="space-y-2">
                    <Label>{t('teacher.incorrectAnswers')}</Label>
                    <Textarea
                      value={newTask.incorrectAnswers}
                      onChange={(e) => setNewTask({ ...newTask, incorrectAnswers: e.target.value })}
                      placeholder={language === 'pl' ? 'Błędne odpowiedzi (każda w nowej linii)' : 'Incorrect answers (one per line)'}
                      rows={3}
                    />
                  </div>
                )}
                <Button onClick={handleCreateTask} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('teacher.addTask')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

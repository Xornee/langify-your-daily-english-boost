import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Edit, Trash2, Loader2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type TaskType = Database['public']['Enums']['task_type'];

interface CourseEditorProps {
  course: Course;
  onBack: () => void;
  onCourseUpdated: () => void;
}

export function CourseEditor({ course, onBack, onCourseUpdated }: CourseEditorProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lesson editing
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({ title: '', description: '' });
  const [showNewLessonDialog, setShowNewLessonDialog] = useState(false);
  
  // Task editing
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    lessonId: '',
    type: 'MULTIPLE_CHOICE' as TaskType,
    questionText: '',
    correctAnswer: '',
    incorrectAnswers: '',
  });
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [targetLessonId, setTargetLessonId] = useState('');

  useEffect(() => {
    fetchLessonsAndTasks();
  }, [course.id]);

  const fetchLessonsAndTasks = async () => {
    setIsLoading(true);
    
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course.id)
      .order('order_in_course', { ascending: true });
    
    setLessons(lessonsData || []);
    
    // Fetch tasks for all lessons
    if (lessonsData && lessonsData.length > 0) {
      const lessonIds = lessonsData.map(l => l.id);
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .in('lesson_id', lessonIds)
        .order('order_in_lesson', { ascending: true });
      
      // Group tasks by lesson
      const tasksByLesson: Record<string, Task[]> = {};
      tasksData?.forEach(task => {
        if (!tasksByLesson[task.lesson_id]) {
          tasksByLesson[task.lesson_id] = [];
        }
        tasksByLesson[task.lesson_id].push(task);
      });
      setTasks(tasksByLesson);
    }
    
    setIsLoading(false);
  };

  // Lesson CRUD
  const handleCreateLesson = async () => {
    if (!newLesson.title) return;
    
    setIsSubmitting(true);
    const { error } = await supabase
      .from('lessons')
      .insert({
        course_id: course.id,
        title: newLesson.title,
        description: newLesson.description || null,
        order_in_course: lessons.length + 1,
      });
    
    setIsSubmitting(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: language === 'pl' ? 'Sukces!' : 'Success!', description: language === 'pl' ? 'Lekcja dodana' : 'Lesson added' });
    setNewLesson({ title: '', description: '' });
    setShowNewLessonDialog(false);
    fetchLessonsAndTasks();
    onCourseUpdated();
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    
    setIsSubmitting(true);
    const { error } = await supabase
      .from('lessons')
      .update({
        title: editingLesson.title,
        description: editingLesson.description,
      })
      .eq('id', editingLesson.id);
    
    setIsSubmitting(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: language === 'pl' ? 'Sukces!' : 'Success!' });
    setEditingLesson(null);
    fetchLessonsAndTasks();
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm(language === 'pl' ? 'Czy na pewno chcesz usunąć tę lekcję?' : 'Are you sure you want to delete this lesson?')) {
      return;
    }
    
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: language === 'pl' ? 'Usunięto' : 'Deleted' });
    fetchLessonsAndTasks();
    onCourseUpdated();
  };

  // Task CRUD
  const handleCreateTask = async () => {
    if (!newTask.questionText || !newTask.correctAnswer || !targetLessonId) return;
    
    setIsSubmitting(true);
    const incorrectAnswersArray = newTask.type !== 'FLASHCARD' 
      ? newTask.incorrectAnswers.split('\n').filter(a => a.trim())
      : [];
    
    const { error } = await supabase
      .from('tasks')
      .insert({
        lesson_id: targetLessonId,
        type: newTask.type,
        question_text: newTask.questionText,
        correct_answer: newTask.correctAnswer,
        incorrect_answers: incorrectAnswersArray,
        order_in_lesson: (tasks[targetLessonId]?.length || 0) + 1,
      });
    
    setIsSubmitting(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: language === 'pl' ? 'Sukces!' : 'Success!', description: language === 'pl' ? 'Zadanie dodane' : 'Task added' });
    setNewTask({ lessonId: '', type: 'MULTIPLE_CHOICE', questionText: '', correctAnswer: '', incorrectAnswers: '' });
    setShowNewTaskDialog(false);
    setTargetLessonId('');
    fetchLessonsAndTasks();
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    
    setIsSubmitting(true);
    const { error } = await supabase
      .from('tasks')
      .update({
        type: editingTask.type,
        question_text: editingTask.question_text,
        correct_answer: editingTask.correct_answer,
        incorrect_answers: editingTask.incorrect_answers,
      })
      .eq('id', editingTask.id);
    
    setIsSubmitting(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: language === 'pl' ? 'Sukces!' : 'Success!' });
    setEditingTask(null);
    fetchLessonsAndTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm(language === 'pl' ? 'Czy na pewno chcesz usunąć to zadanie?' : 'Are you sure you want to delete this task?')) {
      return;
    }
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: language === 'pl' ? 'Usunięto' : 'Deleted' });
    fetchLessonsAndTasks();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{course.title}</h2>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {language === 'pl' ? 'Lekcje' : 'Lessons'} ({lessons.length})
          </h3>
          <Button size="sm" onClick={() => setShowNewLessonDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {language === 'pl' ? 'Dodaj lekcję' : 'Add Lesson'}
          </Button>
        </div>

        {lessons.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {language === 'pl' ? 'Brak lekcji. Dodaj pierwszą lekcję!' : 'No lessons. Add your first lesson!'}
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {lessons.map((lesson, index) => (
              <AccordionItem key={lesson.id} value={lesson.id} className="border rounded-lg bg-card">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="text-left">
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {tasks[lesson.id]?.length || 0} {language === 'pl' ? 'zadań' : 'tasks'}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Lesson actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingLesson(lesson)}>
                        <Edit className="mr-2 h-3 w-3" />
                        {language === 'pl' ? 'Edytuj' : 'Edit'}
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDeleteLesson(lesson.id)}>
                        <Trash2 className="mr-2 h-3 w-3" />
                        {language === 'pl' ? 'Usuń' : 'Delete'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setTargetLessonId(lesson.id); setShowNewTaskDialog(true); }}>
                        <Plus className="mr-2 h-3 w-3" />
                        {language === 'pl' ? 'Dodaj zadanie' : 'Add Task'}
                      </Button>
                    </div>

                    {/* Tasks list */}
                    <div className="space-y-2">
                      {(tasks[lesson.id] || []).map((task, taskIndex) => (
                        <Card key={task.id} className="bg-accent/30">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <span className="text-xs text-muted-foreground mt-1">{taskIndex + 1}.</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{task.question_text}</p>
                                <p className="text-xs text-muted-foreground">
                                  {task.type} • {language === 'pl' ? 'Odpowiedź' : 'Answer'}: {task.correct_answer}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingTask(task)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDeleteTask(task.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {(!tasks[lesson.id] || tasks[lesson.id].length === 0) && (
                        <p className="text-sm text-muted-foreground py-2">
                          {language === 'pl' ? 'Brak zadań' : 'No tasks'}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* New Lesson Dialog */}
      <Dialog open={showNewLessonDialog} onOpenChange={setShowNewLessonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'pl' ? 'Nowa lekcja' : 'New Lesson'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'pl' ? 'Tytuł' : 'Title'}</Label>
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
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewLessonDialog(false)}>
              {language === 'pl' ? 'Anuluj' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateLesson} disabled={isSubmitting || !newLesson.title}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {language === 'pl' ? 'Dodaj' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'pl' ? 'Edytuj lekcję' : 'Edit Lesson'}</DialogTitle>
          </DialogHeader>
          {editingLesson && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{language === 'pl' ? 'Tytuł' : 'Title'}</Label>
                <Input
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'pl' ? 'Opis' : 'Description'}</Label>
                <Textarea
                  value={editingLesson.description || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLesson(null)}>
              {language === 'pl' ? 'Anuluj' : 'Cancel'}
            </Button>
            <Button onClick={handleUpdateLesson} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {language === 'pl' ? 'Zapisz' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'pl' ? 'Nowe zadanie' : 'New Task'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'pl' ? 'Typ' : 'Type'}</Label>
              <Select value={newTask.type} onValueChange={(v) => setNewTask({ ...newTask, type: v as TaskType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FLASHCARD">{language === 'pl' ? 'Fiszka' : 'Flashcard'}</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE">{language === 'pl' ? 'Wielokrotny wybór' : 'Multiple Choice'}</SelectItem>
                  <SelectItem value="GAP_FILL">{language === 'pl' ? 'Uzupełnij lukę' : 'Gap Fill'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'pl' ? 'Pytanie' : 'Question'}</Label>
              <Textarea
                value={newTask.questionText}
                onChange={(e) => setNewTask({ ...newTask, questionText: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'pl' ? 'Poprawna odpowiedź' : 'Correct Answer'}</Label>
              <Input
                value={newTask.correctAnswer}
                onChange={(e) => setNewTask({ ...newTask, correctAnswer: e.target.value })}
              />
            </div>
            {newTask.type !== 'FLASHCARD' && (
              <div className="space-y-2">
                <Label>{language === 'pl' ? 'Błędne odpowiedzi (każda w nowej linii)' : 'Incorrect answers (one per line)'}</Label>
                <Textarea
                  value={newTask.incorrectAnswers}
                  onChange={(e) => setNewTask({ ...newTask, incorrectAnswers: e.target.value })}
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNewTaskDialog(false); setTargetLessonId(''); }}>
              {language === 'pl' ? 'Anuluj' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateTask} disabled={isSubmitting || !newTask.questionText || !newTask.correctAnswer}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {language === 'pl' ? 'Dodaj' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'pl' ? 'Edytuj zadanie' : 'Edit Task'}</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{language === 'pl' ? 'Typ' : 'Type'}</Label>
                <Select 
                  value={editingTask.type || 'MULTIPLE_CHOICE'} 
                  onValueChange={(v) => setEditingTask({ ...editingTask, type: v as TaskType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLASHCARD">{language === 'pl' ? 'Fiszka' : 'Flashcard'}</SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">{language === 'pl' ? 'Wielokrotny wybór' : 'Multiple Choice'}</SelectItem>
                    <SelectItem value="GAP_FILL">{language === 'pl' ? 'Uzupełnij lukę' : 'Gap Fill'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'pl' ? 'Pytanie' : 'Question'}</Label>
                <Textarea
                  value={editingTask.question_text}
                  onChange={(e) => setEditingTask({ ...editingTask, question_text: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'pl' ? 'Poprawna odpowiedź' : 'Correct Answer'}</Label>
                <Input
                  value={editingTask.correct_answer}
                  onChange={(e) => setEditingTask({ ...editingTask, correct_answer: e.target.value })}
                />
              </div>
              {editingTask.type !== 'FLASHCARD' && (
                <div className="space-y-2">
                  <Label>{language === 'pl' ? 'Błędne odpowiedzi (każda w nowej linii)' : 'Incorrect answers (one per line)'}</Label>
                  <Textarea
                    value={(editingTask.incorrect_answers || []).join('\n')}
                    onChange={(e) => setEditingTask({ 
                      ...editingTask, 
                      incorrect_answers: e.target.value.split('\n').filter(a => a.trim()) 
                    })}
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              {language === 'pl' ? 'Anuluj' : 'Cancel'}
            </Button>
            <Button onClick={handleUpdateTask} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {language === 'pl' ? 'Zapisz' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
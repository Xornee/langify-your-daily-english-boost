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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCourses } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Plus, Edit, Loader2, BookOpen, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { CourseEditor } from '@/components/teacher/CourseEditor';
import type { Database } from '@/integrations/supabase/types';

type IndustryContext = Database['public']['Enums']['industry_context'];
type Level = Database['public']['Enums']['level'];
type Course = Database['public']['Tables']['courses']['Row'];

export default function Teacher() {
  const { user, isLoading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { courses, isLoading: coursesLoading, refetch: refetchCourses } = useCourses();
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    industryTag: 'general' as IndustryContext,
    level: 'A2' as Level,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState<{
    id: string;
    title: string;
    description: string;
    industryTag: IndustryContext;
    level: Level;
  } | null>(null);
  
  // Course editor mode
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: language === 'pl' ? 'Wypełnij wszystkie pola' : 'Fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('courses')
      .insert({
        title: newCourse.title,
        description: newCourse.description,
        industry_tag: newCourse.industryTag,
        level: newCourse.level,
        created_by: user.id,
      });
    
    setIsSubmitting(false);
    
    if (error) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'pl' ? 'Sukces!' : 'Success!',
      description: language === 'pl' ? 'Kurs został utworzony' : 'Course created',
    });
    
    setNewCourse({
      title: '',
      description: '',
      industryTag: 'general',
      level: 'A2',
    });
    
    refetchCourses();
  };

  const handleEditCourse = async () => {
    if (!editingCourse || !editingCourse.title || !editingCourse.description) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: language === 'pl' ? 'Wypełnij wszystkie pola' : 'Fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('courses')
      .update({
        title: editingCourse.title,
        description: editingCourse.description,
        industry_tag: editingCourse.industryTag,
        level: editingCourse.level,
      })
      .eq('id', editingCourse.id);
    
    setIsSubmitting(false);
    
    if (error) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'pl' ? 'Sukces!' : 'Success!',
      description: language === 'pl' ? 'Kurs został zaktualizowany' : 'Course updated',
    });
    
    setEditingCourse(null);
    refetchCourses();
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(language === 'pl' ? 'Czy na pewno chcesz usunąć ten kurs?' : 'Are you sure you want to delete this course?')) {
      return;
    }
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);
    
    if (error) {
      toast({
        title: language === 'pl' ? 'Błąd' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'pl' ? 'Usunięto' : 'Deleted',
    });
    
    refetchCourses();
  };

  // If a course is selected, show the course editor
  if (selectedCourse) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <CourseEditor
            course={selectedCourse}
            onBack={() => { setSelectedCourse(null); refetchCourses(); }}
            onCourseUpdated={refetchCourses}
          />
        </div>
      </Layout>
    );
  }

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
          </TabsList>

          {/* My Courses */}
          <TabsContent value="courses">
            {coursesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {course.level}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCourse({
                                id: course.id,
                                title: course.title,
                                description: course.description,
                                industryTag: course.industry_tag || 'general',
                                level: course.level || 'A2',
                              });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {course.lessons_count} {t('courses.lessons')}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          {language === 'pl' ? 'Zarządzaj' : 'Manage'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {courses.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    {language === 'pl' ? 'Nie masz jeszcze żadnych kursów' : 'You have no courses yet'}
                  </p>
                )}
              </div>
            )}
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
                <Button onClick={handleCreateCourse} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {t('teacher.createCourse')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Course Dialog */}
        <Dialog open={!!editingCourse} onOpenChange={(open) => !open && setEditingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === 'pl' ? 'Edytuj kurs' : 'Edit Course'}</DialogTitle>
              <DialogDescription>
                {language === 'pl' ? 'Zaktualizuj szczegóły kursu' : 'Update course details'}
              </DialogDescription>
            </DialogHeader>
            {editingCourse && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('teacher.courseTitle')}</Label>
                  <Input
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('teacher.courseDesc')}</Label>
                  <Textarea
                    value={editingCourse.description}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('courses.filter.industry')}</Label>
                    <Select
                      value={editingCourse.industryTag}
                      onValueChange={(v) => setEditingCourse({ ...editingCourse, industryTag: v as IndustryContext })}
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
                      value={editingCourse.level}
                      onValueChange={(v) => setEditingCourse({ ...editingCourse, level: v as Level })}
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
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCourse(null)}>
                {language === 'pl' ? 'Anuluj' : 'Cancel'}
              </Button>
              <Button onClick={handleEditCourse} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {language === 'pl' ? 'Zapisz' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
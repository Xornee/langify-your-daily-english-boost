import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTeacherStats } from '@/hooks/useTeacherStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Flame, 
  Loader2, 
  Search,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function StudentStats() {
  const { language } = useLanguage();
  const { students, courseStats, studentProgress, isLoading } = useTeacherStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStudentProgress = selectedStudent
    ? studentProgress.filter(p => p.studentId === selectedStudent)
    : [];

  // Summary stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.lastActive && 
    new Date(s.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const totalLessonsCompleted = students.reduce((sum, s) => sum + s.lessonsCompleted, 0);
  const avgXpPerStudent = totalStudents > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.totalXp, 0) / totalStudents) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Wszyscy uczniowie' : 'Total Students'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalStudents}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Aktywni (7 dni)' : 'Active (7 days)'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{activeStudents}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Ukończone lekcje' : 'Lessons Completed'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{totalLessonsCompleted}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Śr. XP na ucznia' : 'Avg XP per Student'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{avgXpPerStudent}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            {language === 'pl' ? 'Uczniowie' : 'Students'}
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="mr-2 h-4 w-4" />
            {language === 'pl' ? 'Kursy' : 'Courses'}
          </TabsTrigger>
          <TabsTrigger value="details">
            <TrendingUp className="mr-2 h-4 w-4" />
            {language === 'pl' ? 'Szczegóły' : 'Details'}
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'pl' ? 'Aktywność uczniów' : 'Student Activity'}</CardTitle>
              <CardDescription>
                {language === 'pl' 
                  ? 'Przegląd postępów i aktywności wszystkich uczniów' 
                  : 'Overview of all student progress and activity'}
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={language === 'pl' ? 'Szukaj ucznia...' : 'Search students...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'pl' ? 'Uczeń' : 'Student'}</TableHead>
                    <TableHead className="text-center">XP</TableHead>
                    <TableHead className="text-center">{language === 'pl' ? 'Lekcje' : 'Lessons'}</TableHead>
                    <TableHead className="text-center">{language === 'pl' ? 'Kursy' : 'Courses'}</TableHead>
                    <TableHead className="text-center">{language === 'pl' ? 'Seria' : 'Streak'}</TableHead>
                    <TableHead>{language === 'pl' ? 'Ostatnia aktywność' : 'Last Active'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedStudent(student.id === selectedStudent ? null : student.id)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{student.totalXp}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{student.lessonsCompleted}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-green-600">{student.coursesCompleted}</span>
                        <span className="text-muted-foreground">/{student.coursesStarted}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {student.currentStreak > 0 && (
                          <div className="flex items-center justify-center gap-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span>{student.currentStreak}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.lastActive ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(student.lastActive).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        {language === 'pl' ? 'Brak uczniów' : 'No students found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'pl' ? 'Statystyki kursów' : 'Course Statistics'}</CardTitle>
              <CardDescription>
                {language === 'pl' 
                  ? 'Jak uczniowie radzą sobie z poszczególnymi kursami' 
                  : 'How students are performing in each course'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseStats.map((course) => (
                  <div key={course.courseId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{course.courseTitle}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{course.totalLessons} {language === 'pl' ? 'lekcji' : 'lessons'}</span>
                        <span>{course.totalStudents} {language === 'pl' ? 'uczniów' : 'students'}</span>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'pl' ? 'Średni postęp' : 'Avg Progress'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={course.avgProgress} className="flex-1" />
                          <span className="text-sm font-medium">{course.avgProgress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'pl' ? 'W trakcie' : 'In Progress'}
                        </p>
                        <p className="text-lg font-semibold">{course.totalStudents - course.completedStudents}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'pl' ? 'Ukończyli' : 'Completed'}
                        </p>
                        <p className="text-lg font-semibold text-green-600">{course.completedStudents}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {courseStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'pl' ? 'Brak danych' : 'No data available'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'pl' ? 'Szczegółowy postęp' : 'Detailed Progress'}</CardTitle>
              <CardDescription>
                {language === 'pl' 
                  ? 'Postęp każdego ucznia w poszczególnych kursach' 
                  : 'Each student\'s progress in individual courses'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'pl' ? 'Uczeń' : 'Student'}</TableHead>
                    <TableHead>{language === 'pl' ? 'Kurs' : 'Course'}</TableHead>
                    <TableHead>{language === 'pl' ? 'Postęp' : 'Progress'}</TableHead>
                    <TableHead className="text-center">{language === 'pl' ? 'Śr. wynik' : 'Avg Score'}</TableHead>
                    <TableHead>{language === 'pl' ? 'Ostatnia próba' : 'Last Attempt'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentProgress.slice(0, 50).map((progress, idx) => (
                    <TableRow key={`${progress.studentId}-${progress.courseId}-${idx}`}>
                      <TableCell className="font-medium">{progress.studentName}</TableCell>
                      <TableCell>{progress.courseTitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[150px]">
                          <Progress value={progress.progressPercent} className="flex-1" />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {progress.completedLessons}/{progress.totalLessons}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={progress.avgScore >= 80 ? 'default' : progress.avgScore >= 60 ? 'secondary' : 'outline'}>
                          {progress.avgScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {progress.lastAttempt ? (
                          <span className="text-sm text-muted-foreground">
                            {new Date(progress.lastAttempt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
                          </span>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {studentProgress.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {language === 'pl' ? 'Brak danych o postępach' : 'No progress data available'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

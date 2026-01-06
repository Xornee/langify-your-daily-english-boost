import { useLanguage } from '@/contexts/LanguageContext';
import { StudentActivity, StudentCourseProgress } from '@/hooks/useTeacherStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Flame, 
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface StudentDetailPanelProps {
  student: StudentActivity;
  studentProgress: StudentCourseProgress[];
  onBack: () => void;
}

export function StudentDetailPanel({ student, studentProgress, onBack }: StudentDetailPanelProps) {
  const { language } = useLanguage();

  const totalScore = studentProgress.length > 0
    ? Math.round(studentProgress.reduce((sum, p) => sum + p.avgScore, 0) / studentProgress.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="text-muted-foreground">{student.email}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Całkowite XP' : 'Total XP'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{student.totalXp}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Ukończone lekcje' : 'Lessons Done'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{student.lessonsCompleted}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Kursy' : 'Courses'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                <span className="text-green-600">{student.coursesCompleted}</span>
                <span className="text-muted-foreground">/{student.coursesStarted}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Obecna seria' : 'Current Streak'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{student.currentStreak}</span>
              <span className="text-sm text-muted-foreground">{language === 'pl' ? 'dni' : 'days'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{language === 'pl' ? 'Śr. wynik' : 'Avg Score'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalScore}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Activity */}
      {student.lastActive && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {language === 'pl' ? 'Ostatnia aktywność: ' : 'Last active: '}
                {new Date(student.lastActive).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {language === 'pl' ? 'Postęp w kursach' : 'Course Progress'}
          </CardTitle>
          <CardDescription>
            {language === 'pl' 
              ? 'Szczegółowy przegląd postępów w każdym kursie' 
              : 'Detailed progress overview for each course'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentProgress.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'pl' ? 'Kurs' : 'Course'}</TableHead>
                  <TableHead>{language === 'pl' ? 'Postęp' : 'Progress'}</TableHead>
                  <TableHead className="text-center">{language === 'pl' ? 'Lekcje' : 'Lessons'}</TableHead>
                  <TableHead className="text-center">{language === 'pl' ? 'Wynik' : 'Score'}</TableHead>
                  <TableHead>{language === 'pl' ? 'Ostatnia próba' : 'Last Attempt'}</TableHead>
                  <TableHead>{language === 'pl' ? 'Status' : 'Status'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentProgress.map((progress) => (
                  <TableRow key={progress.courseId}>
                    <TableCell className="font-medium">{progress.courseTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <Progress value={progress.progressPercent} className="flex-1" />
                        <span className="text-sm font-medium">{progress.progressPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-green-600">{progress.completedLessons}</span>
                      <span className="text-muted-foreground">/{progress.totalLessons}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={progress.avgScore >= 80 ? 'default' : progress.avgScore >= 60 ? 'secondary' : 'outline'}
                      >
                        {progress.avgScore}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {progress.lastAttempt ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(progress.lastAttempt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {progress.completedLessons >= progress.totalLessons ? (
                        <Badge className="bg-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {language === 'pl' ? 'Ukończony' : 'Completed'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {language === 'pl' ? 'W trakcie' : 'In Progress'}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'pl' 
                ? 'Ten uczeń nie rozpoczął jeszcze żadnego kursu' 
                : 'This student has not started any courses yet'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

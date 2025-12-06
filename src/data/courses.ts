import type { Course, Lesson, Task, VocabularyItem } from '@/types';

export const vocabularyItems: VocabularyItem[] = [
  // IT vocabulary
  { id: 'v1', englishWordOrPhrase: 'debugging', translation: 'debugowanie', exampleSentence: 'I spent hours debugging this code.', industryTag: 'it' },
  { id: 'v2', englishWordOrPhrase: 'deploy', translation: 'wdrożyć', exampleSentence: "We'll deploy the app tomorrow.", industryTag: 'it' },
  { id: 'v3', englishWordOrPhrase: 'repository', translation: 'repozytorium', exampleSentence: 'Push your changes to the repository.', industryTag: 'it' },
  { id: 'v4', englishWordOrPhrase: 'pull request', translation: 'żądanie scalenia', exampleSentence: 'Please review my pull request.', industryTag: 'it' },
  { id: 'v5', englishWordOrPhrase: 'sprint', translation: 'sprint', exampleSentence: 'We have a two-week sprint.', industryTag: 'it' },
  { id: 'v6', englishWordOrPhrase: 'standup', translation: 'spotkanie codzienne', exampleSentence: 'The standup is at 9 AM.', industryTag: 'it' },
  { id: 'v7', englishWordOrPhrase: 'refactoring', translation: 'refaktoryzacja', exampleSentence: 'This code needs refactoring.', industryTag: 'it' },
  { id: 'v8', englishWordOrPhrase: 'API endpoint', translation: 'punkt końcowy API', exampleSentence: 'Call the API endpoint to get data.', industryTag: 'it' },
  
  // Finance vocabulary
  { id: 'v9', englishWordOrPhrase: 'revenue', translation: 'przychód', exampleSentence: 'Our revenue increased by 20%.', industryTag: 'finance' },
  { id: 'v10', englishWordOrPhrase: 'profit margin', translation: 'marża zysku', exampleSentence: 'The profit margin is 15%.', industryTag: 'finance' },
  { id: 'v11', englishWordOrPhrase: 'quarterly report', translation: 'raport kwartalny', exampleSentence: 'The quarterly report is due tomorrow.', industryTag: 'finance' },
  { id: 'v12', englishWordOrPhrase: 'budget allocation', translation: 'alokacja budżetu', exampleSentence: 'We need to review the budget allocation.', industryTag: 'finance' },
  { id: 'v13', englishWordOrPhrase: 'ROI', translation: 'zwrot z inwestycji', exampleSentence: 'What is the expected ROI?', industryTag: 'finance' },
  { id: 'v14', englishWordOrPhrase: 'stakeholder', translation: 'interesariusz', exampleSentence: 'We need stakeholder approval.', industryTag: 'finance' },
  
  // Office vocabulary
  { id: 'v15', englishWordOrPhrase: 'deadline', translation: 'termin', exampleSentence: 'The deadline is next Friday.', industryTag: 'office' },
  { id: 'v16', englishWordOrPhrase: 'meeting minutes', translation: 'protokół ze spotkania', exampleSentence: 'Please send the meeting minutes.', industryTag: 'office' },
  { id: 'v17', englishWordOrPhrase: 'follow up', translation: 'kontynuacja', exampleSentence: "I'll follow up with the client.", industryTag: 'office' },
  { id: 'v18', englishWordOrPhrase: 'agenda', translation: 'porządek obrad', exampleSentence: "What's on the agenda today?", industryTag: 'office' },
  { id: 'v19', englishWordOrPhrase: 'cc', translation: 'kopia do wiadomości', exampleSentence: 'Please cc me on the email.', industryTag: 'office' },
  { id: 'v20', englishWordOrPhrase: 'ASAP', translation: 'jak najszybciej', exampleSentence: 'I need this done ASAP.', industryTag: 'office' },
];

export const tasks: Task[] = [
  // IT Course - Lesson 1: Basic Programming Terms
  { id: 't1', lessonId: 'l1', type: 'FLASHCARD', questionText: 'debugging', questionExtra: 'noun', correctAnswer: 'debugowanie', incorrectAnswers: [], vocabularyId: 'v1', orderInLesson: 1 },
  { id: 't2', lessonId: 'l1', type: 'MULTIPLE_CHOICE', questionText: 'How do you say "wdrożyć" in English?', correctAnswer: 'deploy', incorrectAnswers: ['download', 'delete', 'design'], vocabularyId: 'v2', orderInLesson: 2 },
  { id: 't3', lessonId: 'l1', type: 'FLASHCARD', questionText: 'repository', questionExtra: 'noun', correctAnswer: 'repozytorium', incorrectAnswers: [], vocabularyId: 'v3', orderInLesson: 3 },
  { id: 't4', lessonId: 'l1', type: 'GAP_FILL', questionText: 'Push your changes to the _____.', correctAnswer: 'repository', incorrectAnswers: ['folder', 'desktop', 'email'], vocabularyId: 'v3', orderInLesson: 4 },
  { id: 't5', lessonId: 'l1', type: 'MULTIPLE_CHOICE', questionText: 'What is "pull request" in Polish?', correctAnswer: 'żądanie scalenia', incorrectAnswers: ['prośba o pomoc', 'wiadomość', 'komentarz'], vocabularyId: 'v4', orderInLesson: 5 },
  
  // IT Course - Lesson 2: Agile Vocabulary
  { id: 't6', lessonId: 'l2', type: 'FLASHCARD', questionText: 'sprint', questionExtra: 'noun', correctAnswer: 'sprint (okres pracy)', incorrectAnswers: [], vocabularyId: 'v5', orderInLesson: 1 },
  { id: 't7', lessonId: 'l2', type: 'FLASHCARD', questionText: 'standup', questionExtra: 'noun', correctAnswer: 'spotkanie codzienne', incorrectAnswers: [], vocabularyId: 'v6', orderInLesson: 2 },
  { id: 't8', lessonId: 'l2', type: 'MULTIPLE_CHOICE', questionText: 'What does "refactoring" mean?', correctAnswer: 'Improving code without changing its behavior', incorrectAnswers: ['Deleting code', 'Writing new features', 'Testing the application'], vocabularyId: 'v7', orderInLesson: 3 },
  { id: 't9', lessonId: 'l2', type: 'GAP_FILL', questionText: 'The daily _____ meeting is at 9 AM.', correctAnswer: 'standup', incorrectAnswers: ['lunch', 'review', 'sprint'], vocabularyId: 'v6', orderInLesson: 4 },
  { id: 't10', lessonId: 'l2', type: 'MULTIPLE_CHOICE', questionText: 'How do you say "punkt końcowy API" in English?', correctAnswer: 'API endpoint', incorrectAnswers: ['API start', 'API function', 'API server'], vocabularyId: 'v8', orderInLesson: 5 },
  
  // Finance Course - Lesson 1
  { id: 't11', lessonId: 'l3', type: 'FLASHCARD', questionText: 'revenue', questionExtra: 'noun', correctAnswer: 'przychód', incorrectAnswers: [], vocabularyId: 'v9', orderInLesson: 1 },
  { id: 't12', lessonId: 'l3', type: 'FLASHCARD', questionText: 'profit margin', questionExtra: 'noun', correctAnswer: 'marża zysku', incorrectAnswers: [], vocabularyId: 'v10', orderInLesson: 2 },
  { id: 't13', lessonId: 'l3', type: 'MULTIPLE_CHOICE', questionText: 'What is "raport kwartalny" in English?', correctAnswer: 'quarterly report', incorrectAnswers: ['annual report', 'monthly report', 'weekly report'], vocabularyId: 'v11', orderInLesson: 3 },
  { id: 't14', lessonId: 'l3', type: 'GAP_FILL', questionText: 'Our _____ increased by 20% this year.', correctAnswer: 'revenue', incorrectAnswers: ['cost', 'expense', 'debt'], vocabularyId: 'v9', orderInLesson: 4 },
  { id: 't15', lessonId: 'l3', type: 'MULTIPLE_CHOICE', questionText: 'What does ROI stand for?', correctAnswer: 'Return on Investment', incorrectAnswers: ['Rate of Interest', 'Record of Income', 'Report of Inventory'], vocabularyId: 'v13', orderInLesson: 5 },
  
  // Finance Course - Lesson 2
  { id: 't16', lessonId: 'l4', type: 'FLASHCARD', questionText: 'stakeholder', questionExtra: 'noun', correctAnswer: 'interesariusz', incorrectAnswers: [], vocabularyId: 'v14', orderInLesson: 1 },
  { id: 't17', lessonId: 'l4', type: 'MULTIPLE_CHOICE', questionText: 'What is "alokacja budżetu" in English?', correctAnswer: 'budget allocation', incorrectAnswers: ['budget cut', 'budget increase', 'budget plan'], vocabularyId: 'v12', orderInLesson: 2 },
  { id: 't18', lessonId: 'l4', type: 'GAP_FILL', questionText: 'We need _____ approval before proceeding.', correctAnswer: 'stakeholder', incorrectAnswers: ['customer', 'employee', 'manager'], vocabularyId: 'v14', orderInLesson: 3 },
  { id: 't19', lessonId: 'l4', type: 'FLASHCARD', questionText: 'budget allocation', questionExtra: 'noun', correctAnswer: 'alokacja budżetu', incorrectAnswers: [], vocabularyId: 'v12', orderInLesson: 4 },
  { id: 't20', lessonId: 'l4', type: 'MULTIPLE_CHOICE', questionText: 'The profit _____ is 15%.', correctAnswer: 'margin', incorrectAnswers: ['rate', 'level', 'amount'], vocabularyId: 'v10', orderInLesson: 5 },
  
  // Office Course - Lesson 1
  { id: 't21', lessonId: 'l5', type: 'FLASHCARD', questionText: 'deadline', questionExtra: 'noun', correctAnswer: 'termin', incorrectAnswers: [], vocabularyId: 'v15', orderInLesson: 1 },
  { id: 't22', lessonId: 'l5', type: 'FLASHCARD', questionText: 'meeting minutes', questionExtra: 'noun', correctAnswer: 'protokół ze spotkania', incorrectAnswers: [], vocabularyId: 'v16', orderInLesson: 2 },
  { id: 't23', lessonId: 'l5', type: 'MULTIPLE_CHOICE', questionText: 'What does "follow up" mean?', correctAnswer: 'kontynuacja / dalsze działanie', incorrectAnswers: ['rezygnacja', 'opóźnienie', 'anulowanie'], vocabularyId: 'v17', orderInLesson: 3 },
  { id: 't24', lessonId: 'l5', type: 'GAP_FILL', questionText: 'Please send the meeting _____ to all participants.', correctAnswer: 'minutes', incorrectAnswers: ['agenda', 'notes', 'list'], vocabularyId: 'v16', orderInLesson: 4 },
  { id: 't25', lessonId: 'l5', type: 'MULTIPLE_CHOICE', questionText: 'The _____ is next Friday.', correctAnswer: 'deadline', incorrectAnswers: ['meeting', 'project', 'report'], vocabularyId: 'v15', orderInLesson: 5 },
  
  // Office Course - Lesson 2
  { id: 't26', lessonId: 'l6', type: 'FLASHCARD', questionText: 'agenda', questionExtra: 'noun', correctAnswer: 'porządek obrad', incorrectAnswers: [], vocabularyId: 'v18', orderInLesson: 1 },
  { id: 't27', lessonId: 'l6', type: 'MULTIPLE_CHOICE', questionText: 'What does "cc" stand for in emails?', correctAnswer: 'carbon copy', incorrectAnswers: ['clear copy', 'correct copy', 'complete copy'], vocabularyId: 'v19', orderInLesson: 2 },
  { id: 't28', lessonId: 'l6', type: 'FLASHCARD', questionText: 'ASAP', questionExtra: 'abbreviation', correctAnswer: 'jak najszybciej', incorrectAnswers: [], vocabularyId: 'v20', orderInLesson: 3 },
  { id: 't29', lessonId: 'l6', type: 'GAP_FILL', questionText: "What's on the _____ today?", correctAnswer: 'agenda', incorrectAnswers: ['list', 'plan', 'table'], vocabularyId: 'v18', orderInLesson: 4 },
  { id: 't30', lessonId: 'l6', type: 'MULTIPLE_CHOICE', questionText: 'I need this done _____.', correctAnswer: 'ASAP', incorrectAnswers: ['later', 'tomorrow', 'eventually'], vocabularyId: 'v20', orderInLesson: 5 },
];

export const lessons: Lesson[] = [
  // IT Course lessons
  { id: 'l1', courseId: 'c1', title: 'Basic Programming Terms', description: 'Learn essential programming vocabulary', orderInCourse: 1, estimatedMinutes: 5, tasksCount: 5 },
  { id: 'l2', courseId: 'c1', title: 'Agile & Scrum Vocabulary', description: 'Master agile methodology terms', orderInCourse: 2, estimatedMinutes: 5, tasksCount: 5 },
  
  // Finance Course lessons
  { id: 'l3', courseId: 'c2', title: 'Financial Reports', description: 'Learn vocabulary for financial reporting', orderInCourse: 1, estimatedMinutes: 5, tasksCount: 5 },
  { id: 'l4', courseId: 'c2', title: 'Business Analysis', description: 'Terms used in business analysis', orderInCourse: 2, estimatedMinutes: 5, tasksCount: 5 },
  
  // Office Course lessons
  { id: 'l5', courseId: 'c3', title: 'Email Communication', description: 'Professional email vocabulary', orderInCourse: 1, estimatedMinutes: 5, tasksCount: 5 },
  { id: 'l6', courseId: 'c3', title: 'Meeting Vocabulary', description: 'Terms for productive meetings', orderInCourse: 2, estimatedMinutes: 5, tasksCount: 5 },
];

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'English for IT - Basics',
    description: 'Essential English vocabulary for software developers, including programming terms, agile methodology, and technical communication.',
    industryTag: 'it',
    level: 'A2',
    createdBy: '2',
    lessonsCount: 2,
    estimatedMinutes: 10,
  },
  {
    id: 'c2',
    title: 'English for Finance',
    description: 'Learn financial English vocabulary for reports, analysis, and business communication in the finance industry.',
    industryTag: 'finance',
    level: 'B1',
    createdBy: '2',
    lessonsCount: 2,
    estimatedMinutes: 10,
  },
  {
    id: 'c3',
    title: 'Office English - Emails & Meetings',
    description: 'Master professional English for everyday office communication, including emails, meetings, and presentations.',
    industryTag: 'office',
    level: 'A2',
    createdBy: '2',
    lessonsCount: 2,
    estimatedMinutes: 10,
  },
];

export const getTasksForLesson = (lessonId: string): Task[] => {
  return tasks.filter(t => t.lessonId === lessonId).sort((a, b) => a.orderInLesson - b.orderInLesson);
};

export const getLessonsForCourse = (courseId: string): Lesson[] => {
  return lessons.filter(l => l.courseId === courseId).sort((a, b) => a.orderInCourse - b.orderInCourse);
};

export const getCoursesByIndustry = (industry?: string): Course[] => {
  if (!industry || industry === 'all') return courses;
  return courses.filter(c => c.industryTag === industry);
};

export const getVocabularyItem = (id: string): VocabularyItem | undefined => {
  return vocabularyItems.find(v => v.id === id);
};

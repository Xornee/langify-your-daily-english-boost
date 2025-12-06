import React, { createContext, useContext, useState, useEffect } from 'react';
import type { InterfaceLanguage } from '@/types';

type TranslationKey = string;

const translations: Record<InterfaceLanguage, Record<TranslationKey, string>> = {
  pl: {
    // Navigation
    'nav.dashboard': 'Panel główny',
    'nav.courses': 'Kursy',
    'nav.myWords': 'Moje słówka',
    'nav.leaderboard': 'Ranking',
    'nav.settings': 'Ustawienia',
    'nav.teacher': 'Nauczyciel',
    'nav.admin': 'Admin',
    'nav.logout': 'Wyloguj',
    'nav.login': 'Zaloguj',
    'nav.register': 'Zarejestruj',
    
    // Landing
    'landing.title': 'Ucz się angielskiego w swoim tempie',
    'landing.subtitle': 'Spersonalizowane lekcje dopasowane do Twojej branży. Krótkie sesje, duże postępy.',
    'landing.cta': 'Rozpocznij naukę za darmo',
    'landing.features.personalized': 'Spersonalizowane',
    'landing.features.personalizedDesc': 'Słownictwo dopasowane do Twojej branży',
    'landing.features.gamification': 'Grywalizacja',
    'landing.features.gamificationDesc': 'Cele dzienne, serie i rankingi',
    'landing.features.quick': 'Szybkie sesje',
    'landing.features.quickDesc': 'Ucz się w 5-7 minut dziennie',
    
    // Auth
    'auth.login': 'Zaloguj się',
    'auth.register': 'Zarejestruj się',
    'auth.email': 'Email',
    'auth.password': 'Hasło',
    'auth.name': 'Imię',
    'auth.confirmPassword': 'Potwierdź hasło',
    'auth.forgotPassword': 'Zapomniałeś hasła?',
    'auth.noAccount': 'Nie masz konta?',
    'auth.hasAccount': 'Masz już konto?',
    'auth.orContinueWith': 'lub kontynuuj przez',
    'auth.google': 'Google',
    
    // Onboarding
    'onboarding.welcome': 'Witaj w Langify!',
    'onboarding.chooseIndustry': 'Wybierz swoją branżę',
    'onboarding.industryDesc': 'Dopasujemy słownictwo do Twojej pracy',
    'onboarding.it': 'IT / Technologie',
    'onboarding.finance': 'Finanse',
    'onboarding.office': 'Biuro / Ogólne',
    'onboarding.general': 'Ogólne',
    'onboarding.setGoal': 'Ustal swój cel dzienny',
    'onboarding.goalDesc': 'Ile chcesz uczyć się każdego dnia?',
    'onboarding.minutes5': '5 minut (1 lekcja)',
    'onboarding.minutes10': '10 minut (2 lekcje)',
    'onboarding.minutes15': '15 minut (3 lekcje)',
    'onboarding.start': 'Rozpocznij naukę',
    'onboarding.skip': 'Pomiń',
    
    // Dashboard
    'dashboard.greeting': 'Cześć',
    'dashboard.englishFor': 'Angielski dla',
    'dashboard.todayGoal': 'Cel na dziś',
    'dashboard.streak': 'Seria',
    'dashboard.days': 'dni',
    'dashboard.day': 'dzień',
    'dashboard.xpToday': 'XP dziś',
    'dashboard.totalXp': 'Łącznie XP',
    'dashboard.lessonsCompleted': 'Ukończone lekcje',
    'dashboard.continue': 'Kontynuuj naukę',
    'dashboard.startLesson': 'Rozpocznij lekcję',
    'dashboard.suggestedForYou': 'Sugerowane dla Ciebie',
    'dashboard.goalComplete': 'Cel osiągnięty!',
    'dashboard.keepGoing': 'Tak trzymaj!',
    
    // Courses
    'courses.title': 'Kursy',
    'courses.all': 'Wszystkie',
    'courses.lessons': 'lekcji',
    'courses.minutes': 'min',
    'courses.start': 'Rozpocznij',
    'courses.continue': 'Kontynuuj',
    'courses.filter.industry': 'Branża',
    'courses.filter.level': 'Poziom',
    
    // Lesson
    'lesson.question': 'Pytanie',
    'lesson.of': 'z',
    'lesson.check': 'Sprawdź',
    'lesson.next': 'Dalej',
    'lesson.finish': 'Zakończ',
    'lesson.correct': 'Dobrze!',
    'lesson.incorrect': 'Niestety, błędna odpowiedź',
    'lesson.correctAnswer': 'Poprawna odpowiedź',
    'lesson.yourAnswer': 'Twoja odpowiedź',
    'lesson.result': 'Wynik',
    'lesson.xpEarned': 'Zdobyte XP',
    'lesson.addToWords': 'Dodaj do moich słówek',
    'lesson.added': 'Dodano!',
    'lesson.tryAgain': 'Spróbuj ponownie',
    'lesson.backToCourse': 'Wróć do kursu',
    'lesson.flipCard': 'Odwróć kartę',
    'lesson.iKnow': 'Znam',
    'lesson.dontKnow': 'Nie znam',
    
    // My Words
    'myWords.title': 'Moje słówka',
    'myWords.empty': 'Nie masz jeszcze żadnych słówek',
    'myWords.practice': 'Ćwicz',
    'myWords.remove': 'Usuń',
    'myWords.search': 'Szukaj słówek...',
    
    // Leaderboard
    'leaderboard.title': 'Ranking',
    'leaderboard.thisWeek': 'Ten tydzień',
    'leaderboard.allTime': 'Wszech czasów',
    'leaderboard.yourPosition': 'Twoja pozycja',
    'leaderboard.points': 'pkt',
    
    // Settings
    'settings.title': 'Ustawienia',
    'settings.language': 'Język interfejsu',
    'settings.darkMode': 'Tryb ciemny',
    'settings.muteMode': 'Tryb cichy',
    'settings.muteDesc': 'Wyłącz automatyczne odtwarzanie dźwięków',
    'settings.industry': 'Branża',
    'settings.dailyGoal': 'Cel dzienny',
    'settings.save': 'Zapisz',
    'settings.saved': 'Zapisano!',
    
    // Teacher
    'teacher.title': 'Panel nauczyciela',
    'teacher.myCourses': 'Moje kursy',
    'teacher.createCourse': 'Utwórz kurs',
    'teacher.editCourse': 'Edytuj kurs',
    'teacher.addLesson': 'Dodaj lekcję',
    'teacher.addTask': 'Dodaj zadanie',
    'teacher.courseTitle': 'Tytuł kursu',
    'teacher.courseDesc': 'Opis kursu',
    'teacher.lessonTitle': 'Tytuł lekcji',
    'teacher.taskType': 'Typ zadania',
    'teacher.question': 'Pytanie',
    'teacher.correctAnswer': 'Poprawna odpowiedź',
    'teacher.incorrectAnswers': 'Błędne odpowiedzi (po jednej w linii)',
    
    // Admin
    'admin.title': 'Panel administratora',
    'admin.totalUsers': 'Użytkownicy',
    'admin.totalLessons': 'Ukończone lekcje',
    'admin.activeToday': 'Aktywni dziś',
    'admin.dailyStats': 'Statystyki dzienne',
    
    // Common
    'common.loading': 'Ładowanie...',
    'common.error': 'Wystąpił błąd',
    'common.save': 'Zapisz',
    'common.cancel': 'Anuluj',
    'common.delete': 'Usuń',
    'common.edit': 'Edytuj',
    'common.back': 'Wstecz',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.courses': 'Courses',
    'nav.myWords': 'My Words',
    'nav.leaderboard': 'Leaderboard',
    'nav.settings': 'Settings',
    'nav.teacher': 'Teacher',
    'nav.admin': 'Admin',
    'nav.logout': 'Log out',
    'nav.login': 'Log in',
    'nav.register': 'Sign up',
    
    // Landing
    'landing.title': 'Learn English at your own pace',
    'landing.subtitle': 'Personalized lessons tailored to your industry. Short sessions, big progress.',
    'landing.cta': 'Start learning for free',
    'landing.features.personalized': 'Personalized',
    'landing.features.personalizedDesc': 'Vocabulary tailored to your industry',
    'landing.features.gamification': 'Gamification',
    'landing.features.gamificationDesc': 'Daily goals, streaks and rankings',
    'landing.features.quick': 'Quick sessions',
    'landing.features.quickDesc': 'Learn in 5-7 minutes a day',
    
    // Auth
    'auth.login': 'Log in',
    'auth.register': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.confirmPassword': 'Confirm password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.orContinueWith': 'or continue with',
    'auth.google': 'Google',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to Langify!',
    'onboarding.chooseIndustry': 'Choose your industry',
    'onboarding.industryDesc': "We'll tailor the vocabulary to your work",
    'onboarding.it': 'IT / Technology',
    'onboarding.finance': 'Finance',
    'onboarding.office': 'Office / General',
    'onboarding.general': 'General',
    'onboarding.setGoal': 'Set your daily goal',
    'onboarding.goalDesc': 'How much do you want to learn each day?',
    'onboarding.minutes5': '5 minutes (1 lesson)',
    'onboarding.minutes10': '10 minutes (2 lessons)',
    'onboarding.minutes15': '15 minutes (3 lessons)',
    'onboarding.start': 'Start learning',
    'onboarding.skip': 'Skip',
    
    // Dashboard
    'dashboard.greeting': 'Hello',
    'dashboard.englishFor': 'English for',
    'dashboard.todayGoal': "Today's goal",
    'dashboard.streak': 'Streak',
    'dashboard.days': 'days',
    'dashboard.day': 'day',
    'dashboard.xpToday': 'XP today',
    'dashboard.totalXp': 'Total XP',
    'dashboard.lessonsCompleted': 'Lessons completed',
    'dashboard.continue': 'Continue learning',
    'dashboard.startLesson': 'Start lesson',
    'dashboard.suggestedForYou': 'Suggested for you',
    'dashboard.goalComplete': 'Goal achieved!',
    'dashboard.keepGoing': 'Keep going!',
    
    // Courses
    'courses.title': 'Courses',
    'courses.all': 'All',
    'courses.lessons': 'lessons',
    'courses.minutes': 'min',
    'courses.start': 'Start',
    'courses.continue': 'Continue',
    'courses.filter.industry': 'Industry',
    'courses.filter.level': 'Level',
    
    // Lesson
    'lesson.question': 'Question',
    'lesson.of': 'of',
    'lesson.check': 'Check',
    'lesson.next': 'Next',
    'lesson.finish': 'Finish',
    'lesson.correct': 'Correct!',
    'lesson.incorrect': 'Incorrect',
    'lesson.correctAnswer': 'Correct answer',
    'lesson.yourAnswer': 'Your answer',
    'lesson.result': 'Result',
    'lesson.xpEarned': 'XP earned',
    'lesson.addToWords': 'Add to my words',
    'lesson.added': 'Added!',
    'lesson.tryAgain': 'Try again',
    'lesson.backToCourse': 'Back to course',
    'lesson.flipCard': 'Flip card',
    'lesson.iKnow': 'I know',
    'lesson.dontKnow': "Don't know",
    
    // My Words
    'myWords.title': 'My Words',
    'myWords.empty': "You don't have any words yet",
    'myWords.practice': 'Practice',
    'myWords.remove': 'Remove',
    'myWords.search': 'Search words...',
    
    // Leaderboard
    'leaderboard.title': 'Leaderboard',
    'leaderboard.thisWeek': 'This week',
    'leaderboard.allTime': 'All time',
    'leaderboard.yourPosition': 'Your position',
    'leaderboard.points': 'pts',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Interface language',
    'settings.darkMode': 'Dark mode',
    'settings.muteMode': 'Mute mode',
    'settings.muteDesc': 'Disable automatic audio playback',
    'settings.industry': 'Industry',
    'settings.dailyGoal': 'Daily goal',
    'settings.save': 'Save',
    'settings.saved': 'Saved!',
    
    // Teacher
    'teacher.title': 'Teacher Panel',
    'teacher.myCourses': 'My Courses',
    'teacher.createCourse': 'Create Course',
    'teacher.editCourse': 'Edit Course',
    'teacher.addLesson': 'Add Lesson',
    'teacher.addTask': 'Add Task',
    'teacher.courseTitle': 'Course title',
    'teacher.courseDesc': 'Course description',
    'teacher.lessonTitle': 'Lesson title',
    'teacher.taskType': 'Task type',
    'teacher.question': 'Question',
    'teacher.correctAnswer': 'Correct answer',
    'teacher.incorrectAnswers': 'Incorrect answers (one per line)',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.totalUsers': 'Users',
    'admin.totalLessons': 'Completed lessons',
    'admin.activeToday': 'Active today',
    'admin.dailyStats': 'Daily statistics',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
  },
};

interface LanguageContextType {
  language: InterfaceLanguage;
  setLanguage: (lang: InterfaceLanguage) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<InterfaceLanguage>(() => {
    const stored = localStorage.getItem('langify-language');
    return (stored as InterfaceLanguage) || 'pl';
  });

  useEffect(() => {
    localStorage.setItem('langify-language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

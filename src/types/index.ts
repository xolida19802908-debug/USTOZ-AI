export type SubjectId =
  | 'ona-tili'
  | 'adabiyot'
  | 'ozbekiston-tarixi'
  | 'jahon-tarixi'
  | 'matematika'
  | 'algebra'
  | 'geometriya'
  | 'fizika'
  | 'kimyo'
  | 'biologiya'
  | 'geografiya'
  | 'informatika'
  | 'ingliz-tili'
  | 'huquq'
  | 'tarbiya';

export interface Subject {
  id: SubjectId;
  name: string;
  iconName: string;
  grades: number[];
  color: string;
}

export interface TextbookChapter {
  id: string;
  number: number;
  title: string;
  pages: string;
  topics: {
    id: string;
    title: string;
    page: number;
    keyPoints?: string[];
  }[];
}

export interface Textbook {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  grade: number;
  title: string;
  authors: string;
  year: number;
  publisher: string;
  available: boolean;
  edition: string;
  chapters: TextbookChapter[];
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: number;
  duration: string;
  lessonType: string;
  studentLevel: string;
  createdAt: string;
  content: {
    topic: string;
    objectives: {
      educational: string;
      developmental: string;
      upbringing: string;
    };
    expectedResults: string[];
    equipment: string[];
    stages: {
      organizational: { time: string; text: string };
      review: { time: string; text: string; questions: string[] };
      newTopic: { time: string; text: string; keyPoints: string[] };
      practical: { time: string; text: string; tasks: string[] };
      consolidation: { time: string; text: string; quickCheck: string[] };
      assessment: { time: string; criteria: string };
      homework: { time: string; text: string };
      conclusion: string;
    };
  };
}

export interface TestOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface TestQuestion {
  id: string;
  number: number;
  question: string;
  options: TestOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  source: string; // e.g. "Manba: 8-sinf O‘zbekiston tarixi darsligi, 45-bet"
  difficulty: 'Oson' | 'O‘rta' | 'Qiyin';
}

export interface TestSet {
  id: string;
  title: string;
  subject: string;
  grade: number;
  textbookName: string;
  chapterTitle?: string;
  topicTitle: string;
  difficulty: string;
  questionType: string;
  isTextbookBased: boolean;
  createdAt: string;
  questions: TestQuestion[];
}

export interface QuestionItem {
  id: string;
  number: number;
  question: string;
  difficulty: 'Oson' | 'O‘rta' | 'Qiyin';
  bloomLevel: string; // Bilish, Tushunish, Qo'llash, Tahlil
  modelAnswer: string;
  criteria: string;
}

export interface QuestionSet {
  id: string;
  title: string;
  subject: string;
  grade: number;
  topic: string;
  createdAt: string;
  questions: QuestionItem[];
}

export interface HomeworkLevel {
  level: 'Boshlang‘ich' | 'O‘rta' | 'Yuqori';
  title: string;
  description: string;
  tasks: string[];
  expectedTime: string;
}

export interface HomeworkSet {
  id: string;
  title: string;
  subject: string;
  grade: number;
  topic: string;
  createdAt: string;
  instructions: string;
  levels: HomeworkLevel[];
  assessmentNote: string;
  parentNote: string;
}

export interface TopicExplanation {
  id: string;
  title: string;
  subject: string;
  grade: number;
  topic: string;
  createdAt: string;
  simpleExplanation: string;
  detailedExplanation: string;
  realLifeExamples: string[];
  keyTerms: { term: string; definition: string }[];
  importantPoints: string[];
  checkingQuestions: { question: string; answer: string }[];
}

export interface AssessmentRubric {
  id: string;
  title: string;
  subject: string;
  grade: number;
  topic: string;
  createdAt: string;
  criteria: {
    category: string;
    weight: string;
    levels: {
      beginning: string; // 1-2 ball
      satisfactory: string; // 3 ball
      good: string; // 4 ball
      excellent: string; // 5 ball
    };
  }[];
  gradingScale: {
    grade5: string;
    grade4: string;
    grade3: string;
    grade2: string;
  };
  feedbackTemplates: {
    high: string[];
    medium: string[];
    supportNeeded: string[];
  };
}

export interface InteractiveActivityItem {
  id: string;
  type:
    | 'tezkor'
    | 'kim-tez'
    | 'togri-notogri'
    | 'moslashtirish'
    | 'tasodifiy'
    | 'viktorina'
    | 'mantiqiy'
    | 'challenge';
  title: string;
  subject: string;
  topic: string;
  data: any;
}

export type MaterialType =
  | 'lesson'
  | 'test'
  | 'questions'
  | 'homework'
  | 'explainer'
  | 'rubric'
  | 'interactive';

export interface SavedMaterial {
  id: string;
  type: MaterialType;
  title: string;
  subject: string;
  grade: number;
  topic: string;
  createdAt: string;
  updatedAt: string;
  data: any;
}

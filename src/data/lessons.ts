export type ExerciseType = 'multiple_choice' | 'reverse_multiple_choice';

export type Exercise = {
  id: string;
  type: ExerciseType;
  prompt: string;          // German word or sentence
  options: string[];       // Somali options for MC
  correctAnswer: string;
  hint?: string;
};

export type Lesson = {
  id: string;
  title: string;           // Somali title shown to user
  titleDe: string;         // German title
  unit: number;
  exercises: Exercise[];
};

export const a1Lessons: Lesson[] = [
  {
    id: 'a1-greetings-01',
    title: 'Salaamaha — Greetings',
    titleDe: 'Begrüßungen',
    unit: 1,
    exercises: [
      {
        id: 'ex-1',
        type: 'multiple_choice',
        prompt: 'Guten Morgen',
        options: ['Subax wanaagsan', 'Habeen wanaagsan', 'Galab wanaagsan'],
        correctAnswer: 'Subax wanaagsan',
      },
      {
        id: 'ex-2',
        type: 'multiple_choice',
        prompt: 'Guten Abend',
        options: ['Subax wanaagsan', 'Habeen wanaagsan', 'Galab wanaagsan'],
        correctAnswer: 'Habeen wanaagsan',
      },
      {
        id: 'ex-3',
        type: 'multiple_choice',
        prompt: 'Wie heißt du?',
        options: ['Magacaa?', 'Sidee tahay?', 'Xaggee ka timid?'],
        correctAnswer: 'Magacaa?',
      },
      {
        id: 'ex-4',
        type: 'multiple_choice',
        prompt: 'Danke',
        options: ['Mahadsanid', 'Fadlan', 'Nabadgelyo'],
        correctAnswer: 'Mahadsanid',
      },
      {
        id: 'ex-5',
        type: 'multiple_choice',
        prompt: 'Auf Wiedersehen',
        options: ['Nabadgelyo', 'Subax wanaagsan', 'Mahadsanid'],
        correctAnswer: 'Nabadgelyo',
      },
    ],
  },
];
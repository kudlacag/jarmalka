export type ExerciseType = 'multiple_choice' | 'sentence_build';

export type Exercise = {
  id: string;
  type: ExerciseType;
  prompt: string;          // For MC: German word. For Sentence: Somali translation
  options: string[];       // For MC: 3 choices. For Sentence: all words to drag
  correctAnswer: string;   // The exact correct string (or joined sentence)
  hint?: string;
};

export type Lesson = {
  id: string;
  title: string;
  titleDe: string;
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
      { id: 'g1', type: 'multiple_choice', prompt: 'Guten Morgen', options: ['Subax wanaagsan', 'Habeen wanaagsan', 'Galab wanaagsan'], correctAnswer: 'Subax wanaagsan' },
      { id: 'g2', type: 'multiple_choice', prompt: 'Guten Abend', options: ['Subax wanaagsan', 'Habeen wanaagsan', 'Galab wanaagsan'], correctAnswer: 'Habeen wanaagsan' },
      { id: 'g3', type: 'multiple_choice', prompt: 'Wie heißt du?', options: ['Magacaa?', 'Sidee tahay?', 'Xaggee ka timid?'], correctAnswer: 'Magacaa?' },
      { id: 'g4', type: 'multiple_choice', prompt: 'Danke', options: ['Mahadsanid', 'Fadlan', 'Nabadgelyo'], correctAnswer: 'Mahadsanid' },
      { id: 'g5', type: 'multiple_choice', prompt: 'Auf Wiedersehen', options: ['Nabadgelyo', 'Subax wanaagsan', 'Mahadsanid'], correctAnswer: 'Nabadgelyo' },
    ],
  },
  {
    id: 'a1-family-01',
    title: 'Qoyska — Family',
    titleDe: 'Die Familie',
    unit: 2,
    exercises: [
      { id: 'f1', type: 'multiple_choice', prompt: 'Vater', options: ['Aabbe', 'Hooyo', 'Walaal'], correctAnswer: 'Aabbe' },
      { id: 'f2', type: 'multiple_choice', prompt: 'Mutter', options: ['Hooyo', 'Aabbe', 'Adeer'], correctAnswer: 'Hooyo' },
      { id: 'f3', type: 'multiple_choice', prompt: 'Bruder', options: ['Walaal (lab)', 'Walaal (dheddig)', 'Awoowe'], correctAnswer: 'Walaal (lab)' },
      { id: 'f4', type: 'multiple_choice', prompt: 'Schwester', options: ['Walaal (dheddig)', 'Walaal (lab)', 'Ayeeyo'], correctAnswer: 'Walaal (dheddig)' },
      { id: 'f5', type: 'multiple_choice', prompt: 'Kind', options: ['Ilmo', 'Nin', 'Naag'], correctAnswer: 'Ilmo' },
    ],
  },
  {
    id: 'a1-sentences-01',
    title: 'Jumlado Fudud — Simple Sentences',
    titleDe: 'Einfache Sätze',
    unit: 3,
    exercises: [
      { 
        id: 's1', 
        type: 'sentence_build', 
        prompt: 'Waxaan ahay arday.', 
        options: ['Ich', 'bin', 'Student', 'Lehrer'], 
        correctAnswer: 'Ich bin Student' 
      },
      { 
        id: 's2', 
        type: 'sentence_build', 
        prompt: 'Sidee tahay?', 
        options: ['Wie', 'geht', 'es', 'dir'], 
        correctAnswer: 'Wie geht es dir' 
      },
      { 
        id: 's3', 
        type: 'sentence_build', 
        prompt: 'Waxaan ku noolahay Jarmalka.', 
        options: ['Ich', 'wohne', 'in', 'Deutschland'], 
        correctAnswer: 'Ich wohne in Deutschland' 
      }
    ],
  }
];
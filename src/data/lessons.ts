export type ExerciseType = 'multiple_choice';

export type Exercise = {
  id: string;
  type: ExerciseType;
  prompt: string;          
  options: string[];       
  correctAnswer: string;
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
      { id: 'g6', type: 'multiple_choice', prompt: 'Bitte', options: ['Fadlan', 'Mahadsanid', 'Haa'], correctAnswer: 'Fadlan' },
      { id: 'g7', type: 'multiple_choice', prompt: 'Ja', options: ['Haa', 'Maya', 'Waan ka xumahay'], correctAnswer: 'Haa' },
      { id: 'g8', type: 'multiple_choice', prompt: 'Nein', options: ['Maya', 'Haa', 'Fadlan'], correctAnswer: 'Maya' },
    ],
  },
  {
    id: 'a1-numbers-01',
    title: 'Lambarrada — Numbers',
    titleDe: 'Zahlen',
    unit: 2,
    exercises: [
      { id: 'n1', type: 'multiple_choice', prompt: 'Eins', options: ['Kow', 'Laba', 'Saddex'], correctAnswer: 'Kow' },
      { id: 'n2', type: 'multiple_choice', prompt: 'Zwei', options: ['Laba', 'Kow', 'Afar'], correctAnswer: 'Laba' },
      { id: 'n3', type: 'multiple_choice', prompt: 'Drei', options: ['Saddex', 'Shan', 'Laba'], correctAnswer: 'Saddex' },
      { id: 'n4', type: 'multiple_choice', prompt: 'Vier', options: ['Afar', 'Saddex', 'Lix'], correctAnswer: 'Afar' },
      { id: 'n5', type: 'multiple_choice', prompt: 'Fünf', options: ['Shan', 'Afar', 'Toddoba'], correctAnswer: 'Shan' },
      { id: 'n6', type: 'multiple_choice', prompt: 'Sechs', options: ['Lix', 'Shan', 'Sagaal'], correctAnswer: 'Lix' },
      { id: 'n7', type: 'multiple_choice', prompt: 'Sieben', options: ['Toddoba', 'Sideed', 'Lix'], correctAnswer: 'Toddoba' },
      { id: 'n8', type: 'multiple_choice', prompt: 'Acht', options: ['Sideed', 'Toddoba', 'Toban'], correctAnswer: 'Sideed' },
      { id: 'n9', type: 'multiple_choice', prompt: 'Neun', options: ['Sagaal', 'Sideed', 'Kow'], correctAnswer: 'Sagaal' },
      { id: 'n10', type: 'multiple_choice', prompt: 'Zehn', options: ['Toban', 'Sagaal', 'Shan'], correctAnswer: 'Toban' },
    ],
  },
];
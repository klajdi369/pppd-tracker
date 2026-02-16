export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD

  // Dizziness
  dizzinessSeverity: number; // 0-10
  dizzinessNotes: string;

  // Sleep
  sleepHours: number;
  sleepQuality: number; // 1-5

  // Food & Hydration
  meals: Meal[];
  waterIntake: number; // glasses
  caffeineIntake: number; // cups
  alcoholIntake: number; // drinks

  // Exercise
  exercises: Exercise[];

  // Triggers
  triggers: string[];
  triggerNotes: string;

  // Stress & Anxiety
  stressLevel: number; // 0-10
  anxietyLevel: number; // 0-10
  mood: number; // 1-5

  // Medications
  medications: Medication[];

  // Energy & Fatigue
  energyLevel: number; // 0-10
  fatigueSeverity: number; // 0-10

  // Notes
  generalNotes: string;
}

export interface Meal {
  name: string;
  time: string;
  notes: string;
}

export interface Exercise {
  type: string;
  duration: number; // minutes
  intensity: 'light' | 'moderate' | 'vigorous';
  symptomResponse: string;
}

export interface Medication {
  name: string;
  dosage: string;
  time: string;
  sideEffects: string;
}

export const COMMON_TRIGGERS = [
  'Bright lights',
  'Flickering lights',
  'Screens',
  'Crowded spaces',
  'Loud noises',
  'Strong smells',
  'Scrolling',
  'Driving',
  'Supermarket aisles',
  'Busy patterns',
  'Head movements',
  'Standing up quickly',
  'Weather changes',
  'Lack of sleep',
  'Stress',
  'Dehydration',
];

export const EXERCISE_TYPES = [
  'Walking',
  'Vestibular exercises',
  'Yoga',
  'Swimming',
  'Cycling',
  'Tai chi',
  'Stretching',
  'Breathing exercises',
  'Balance training',
  'Other',
];

export function createEmptyLog(date: string): DailyLog {
  return {
    id: crypto.randomUUID(),
    date,
    dizzinessSeverity: 0,
    dizzinessNotes: '',
    sleepHours: 0,
    sleepQuality: 3,
    meals: [],
    waterIntake: 0,
    caffeineIntake: 0,
    alcoholIntake: 0,
    exercises: [],
    triggers: [],
    triggerNotes: '',
    stressLevel: 0,
    anxietyLevel: 0,
    mood: 3,
    medications: [],
    energyLevel: 5,
    fatigueSeverity: 0,
    generalNotes: '',
  };
}

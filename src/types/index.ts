export const TIME_PERIODS = ['morning', 'midday', 'afternoon', 'evening'] as const;
export type TimePeriod = typeof TIME_PERIODS[number];

export const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

export interface TimeOfDayRating {
  morning: number;
  midday: number;
  afternoon: number;
  evening: number;
}

function emptyRating(defaultValue = 0): TimeOfDayRating {
  return { morning: defaultValue, midday: defaultValue, afternoon: defaultValue, evening: defaultValue };
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD

  // Dizziness (by time of day)
  dizziness: TimeOfDayRating; // 0-10
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

  // Mental Health (by time of day)
  stress: TimeOfDayRating; // 0-10
  anxiety: TimeOfDayRating; // 0-10
  mood: TimeOfDayRating; // 1-5

  // Medications
  medications: Medication[];

  // Energy & Fatigue (by time of day)
  energy: TimeOfDayRating; // 0-10
  fatigue: TimeOfDayRating; // 0-10

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
    dizziness: emptyRating(),
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
    stress: emptyRating(),
    anxiety: emptyRating(),
    mood: emptyRating(3),
    medications: [],
    energy: emptyRating(5),
    fatigue: emptyRating(),
    generalNotes: '',
  };
}

/** Average a TimeOfDayRating into a single number */
export function avgRating(r: TimeOfDayRating): number {
  return Math.round(((r.morning + r.midday + r.afternoon + r.evening) / 4) * 10) / 10;
}

/** Migrate old flat-field logs to the new time-of-day structure */
export function migrateLog(raw: Record<string, unknown>): DailyLog {
  const log = raw as unknown as DailyLog;

  // Already migrated
  if (log.dizziness && typeof log.dizziness === 'object') return log;

  // Old format had flat fields
  const old = raw as Record<string, unknown>;
  const fill = (v: unknown, def = 0): TimeOfDayRating => {
    const n = typeof v === 'number' ? v : def;
    return { morning: n, midday: n, afternoon: n, evening: n };
  };

  return {
    ...createEmptyLog(log.date),
    ...log,
    dizziness: fill(old['dizzinessSeverity']),
    stress: fill(old['stressLevel']),
    anxiety: fill(old['anxietyLevel']),
    mood: fill(old['mood'], 3),
    energy: fill(old['energyLevel'], 5),
    fatigue: fill(old['fatigueSeverity']),
  };
}

import type { Exercise } from '../types';
import { EXERCISE_TYPES } from '../types';
import { Plus, X } from 'lucide-react';

interface ExerciseEntryProps {
  exercises: Exercise[];
  onChange: (exercises: Exercise[]) => void;
}

export default function ExerciseEntry({ exercises, onChange }: ExerciseEntryProps) {
  function addExercise() {
    onChange([...exercises, { type: '', duration: 0, intensity: 'light', symptomResponse: '' }]);
  }

  function updateExercise(index: number, field: keyof Exercise, value: string | number) {
    const updated = exercises.map((e, i) =>
      i === index ? { ...e, [field]: value } : e
    );
    onChange(updated);
  }

  function removeExercise(index: number) {
    onChange(exercises.filter((_, i) => i !== index));
  }

  return (
    <div className="list-entry">
      <div className="list-entry-header">
        <h4>Exercise</h4>
        <button type="button" className="btn-icon" onClick={addExercise}>
          <Plus size={18} />
        </button>
      </div>
      {exercises.map((ex, i) => (
        <div key={i} className="list-entry-item">
          <div className="list-entry-row">
            <select
              value={ex.type}
              onChange={(e) => updateExercise(i, 'type', e.target.value)}
            >
              <option value="">Select type</option>
              {EXERCISE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min"
              min={0}
              value={ex.duration || ''}
              onChange={(e) => updateExercise(i, 'duration', Number(e.target.value))}
              style={{ width: '70px' }}
            />
            <select
              value={ex.intensity}
              onChange={(e) => updateExercise(i, 'intensity', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="vigorous">Vigorous</option>
            </select>
            <button type="button" className="btn-icon btn-danger" onClick={() => removeExercise(i)}>
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="How did symptoms respond?"
            value={ex.symptomResponse}
            onChange={(e) => updateExercise(i, 'symptomResponse', e.target.value)}
          />
        </div>
      ))}
      {exercises.length === 0 && (
        <p className="empty-hint">Tap + to add exercise</p>
      )}
    </div>
  );
}

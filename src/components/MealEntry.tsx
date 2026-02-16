import type { Meal } from '../types';
import { Plus, X } from 'lucide-react';

interface MealEntryProps {
  meals: Meal[];
  onChange: (meals: Meal[]) => void;
}

export default function MealEntry({ meals, onChange }: MealEntryProps) {
  function addMeal() {
    onChange([...meals, { name: '', time: '', notes: '' }]);
  }

  function updateMeal(index: number, field: keyof Meal, value: string) {
    const updated = meals.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange(updated);
  }

  function removeMeal(index: number) {
    onChange(meals.filter((_, i) => i !== index));
  }

  return (
    <div className="list-entry">
      <div className="list-entry-header">
        <h4>Meals</h4>
        <button type="button" className="btn-icon" onClick={addMeal}>
          <Plus size={18} />
        </button>
      </div>
      {meals.map((meal, i) => (
        <div key={i} className="list-entry-item">
          <div className="list-entry-row">
            <input
              type="text"
              placeholder="What did you eat?"
              value={meal.name}
              onChange={(e) => updateMeal(i, 'name', e.target.value)}
            />
            <input
              type="time"
              value={meal.time}
              onChange={(e) => updateMeal(i, 'time', e.target.value)}
            />
            <button type="button" className="btn-icon btn-danger" onClick={() => removeMeal(i)}>
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Notes (e.g., how you felt after)"
            value={meal.notes}
            onChange={(e) => updateMeal(i, 'notes', e.target.value)}
          />
        </div>
      ))}
      {meals.length === 0 && (
        <p className="empty-hint">Tap + to add a meal</p>
      )}
    </div>
  );
}

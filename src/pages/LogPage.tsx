import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DailyLog } from '../types';
import { createEmptyLog } from '../types';
import { getLogByDate, saveLog } from '../utils/storage';
import { today, formatDisplay } from '../utils/dates';
import SliderInput from '../components/SliderInput';
import TimeOfDaySliders from '../components/TimeOfDaySliders';
import MealEntry from '../components/MealEntry';
import ExerciseEntry from '../components/ExerciseEntry';
import MedicationEntry from '../components/MedicationEntry';
import TriggerSelector from '../components/TriggerSelector';
import { Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

export default function LogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get('date') || today();
  const [log, setLog] = useState<DailyLog>(createEmptyLog(dateParam));
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('dizziness');

  useEffect(() => {
    const existing = getLogByDate(dateParam);
    if (existing) {
      setLog(existing);
    } else {
      setLog(createEmptyLog(dateParam));
    }
    setSaved(false);
  }, [dateParam]);

  function update<K extends keyof DailyLog>(field: K, value: DailyLog[K]) {
    setLog((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveLog(log);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function goToDate(offset: number) {
    const d = new Date(dateParam + 'T00:00:00');
    const newDate = offset > 0 ? addDays(d, offset) : subDays(d, Math.abs(offset));
    setSearchParams({ date: format(newDate, 'yyyy-MM-dd') });
  }

  const sections = [
    { id: 'dizziness', label: 'Dizziness' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'food', label: 'Food' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'triggers', label: 'Triggers' },
    { id: 'mental', label: 'Mental' },
    { id: 'meds', label: 'Meds' },
    { id: 'energy', label: 'Energy' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <div className="page log-page">
      <div className="date-nav">
        <button className="btn-icon" onClick={() => goToDate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <h2>{formatDisplay(dateParam)}</h2>
        <button
          className="btn-icon"
          onClick={() => goToDate(1)}
          disabled={dateParam >= today()}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="section-tabs">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`tab ${activeSection === s.id ? 'tab-active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="log-form">
        {activeSection === 'dizziness' && (
          <section className="form-section">
            <h3>Dizziness</h3>
            <TimeOfDaySliders
              label="Severity"
              rating={log.dizziness}
              onChange={(v) => update('dizziness', v)}
              lowLabel="None"
              highLabel="Severe"
              colorScale
            />
            <textarea
              placeholder="Describe your dizziness (rocking, swaying, floating, unsteady...)"
              value={log.dizzinessNotes}
              onChange={(e) => update('dizzinessNotes', e.target.value)}
              rows={3}
            />
          </section>
        )}

        {activeSection === 'sleep' && (
          <section className="form-section">
            <h3>Sleep</h3>
            <div className="input-group">
              <label>Hours slept</label>
              <input
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={log.sleepHours || ''}
                onChange={(e) => update('sleepHours', Number(e.target.value))}
              />
            </div>
            <SliderInput
              label="Sleep Quality"
              value={log.sleepQuality}
              onChange={(v) => update('sleepQuality', v)}
              min={1}
              max={5}
              lowLabel="Poor"
              highLabel="Excellent"
            />
          </section>
        )}

        {activeSection === 'food' && (
          <section className="form-section">
            <h3>Food & Hydration</h3>
            <MealEntry meals={log.meals} onChange={(v) => update('meals', v)} />
            <div className="intake-row">
              <div className="input-group">
                <label>Water (glasses)</label>
                <input
                  type="number"
                  min={0}
                  value={log.waterIntake || ''}
                  onChange={(e) => update('waterIntake', Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>Caffeine (cups)</label>
                <input
                  type="number"
                  min={0}
                  value={log.caffeineIntake || ''}
                  onChange={(e) => update('caffeineIntake', Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>Alcohol (drinks)</label>
                <input
                  type="number"
                  min={0}
                  value={log.alcoholIntake || ''}
                  onChange={(e) => update('alcoholIntake', Number(e.target.value))}
                />
              </div>
            </div>
          </section>
        )}

        {activeSection === 'exercise' && (
          <section className="form-section">
            <h3>Exercise</h3>
            <ExerciseEntry
              exercises={log.exercises}
              onChange={(v) => update('exercises', v)}
            />
          </section>
        )}

        {activeSection === 'triggers' && (
          <section className="form-section">
            <h3>Triggers</h3>
            <TriggerSelector
              selected={log.triggers}
              onChange={(v) => update('triggers', v)}
            />
            <textarea
              placeholder="Additional trigger notes..."
              value={log.triggerNotes}
              onChange={(e) => update('triggerNotes', e.target.value)}
              rows={2}
            />
          </section>
        )}

        {activeSection === 'mental' && (
          <section className="form-section">
            <h3>Mental Health</h3>
            <TimeOfDaySliders
              label="Stress"
              rating={log.stress}
              onChange={(v) => update('stress', v)}
              lowLabel="Calm"
              highLabel="Very stressed"
              colorScale
            />
            <TimeOfDaySliders
              label="Anxiety"
              rating={log.anxiety}
              onChange={(v) => update('anxiety', v)}
              lowLabel="None"
              highLabel="Severe"
              colorScale
            />
            <TimeOfDaySliders
              label="Mood"
              rating={log.mood}
              onChange={(v) => update('mood', v)}
              min={1}
              max={5}
              lowLabel="Very low"
              highLabel="Great"
            />
          </section>
        )}

        {activeSection === 'meds' && (
          <section className="form-section">
            <h3>Medications</h3>
            <MedicationEntry
              medications={log.medications}
              onChange={(v) => update('medications', v)}
            />
          </section>
        )}

        {activeSection === 'energy' && (
          <section className="form-section">
            <h3>Energy & Fatigue</h3>
            <TimeOfDaySliders
              label="Energy"
              rating={log.energy}
              onChange={(v) => update('energy', v)}
              lowLabel="Exhausted"
              highLabel="Energized"
            />
            <TimeOfDaySliders
              label="Fatigue"
              rating={log.fatigue}
              onChange={(v) => update('fatigue', v)}
              lowLabel="None"
              highLabel="Severe"
              colorScale
            />
          </section>
        )}

        {activeSection === 'notes' && (
          <section className="form-section">
            <h3>General Notes</h3>
            <textarea
              placeholder="Anything else to note about today..."
              value={log.generalNotes}
              onChange={(e) => update('generalNotes', e.target.value)}
              rows={5}
            />
          </section>
        )}
      </div>

      <button className={`btn-save ${saved ? 'btn-saved' : ''}`} onClick={handleSave}>
        <Save size={18} />
        {saved ? 'Saved!' : 'Save Entry'}
      </button>
    </div>
  );
}

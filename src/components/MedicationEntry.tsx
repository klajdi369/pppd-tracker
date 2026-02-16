import type { Medication } from '../types';
import { Plus, X } from 'lucide-react';

interface MedicationEntryProps {
  medications: Medication[];
  onChange: (medications: Medication[]) => void;
}

export default function MedicationEntry({ medications, onChange }: MedicationEntryProps) {
  function addMedication() {
    onChange([...medications, { name: '', dosage: '', time: '', sideEffects: '' }]);
  }

  function updateMedication(index: number, field: keyof Medication, value: string) {
    const updated = medications.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange(updated);
  }

  function removeMedication(index: number) {
    onChange(medications.filter((_, i) => i !== index));
  }

  return (
    <div className="list-entry">
      <div className="list-entry-header">
        <h4>Medications</h4>
        <button type="button" className="btn-icon" onClick={addMedication}>
          <Plus size={18} />
        </button>
      </div>
      {medications.map((med, i) => (
        <div key={i} className="list-entry-item">
          <div className="list-entry-row">
            <input
              type="text"
              placeholder="Medication name"
              value={med.name}
              onChange={(e) => updateMedication(i, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => updateMedication(i, 'dosage', e.target.value)}
              style={{ width: '100px' }}
            />
            <input
              type="time"
              value={med.time}
              onChange={(e) => updateMedication(i, 'time', e.target.value)}
            />
            <button type="button" className="btn-icon btn-danger" onClick={() => removeMedication(i)}>
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Any side effects?"
            value={med.sideEffects}
            onChange={(e) => updateMedication(i, 'sideEffects', e.target.value)}
          />
        </div>
      ))}
      {medications.length === 0 && (
        <p className="empty-hint">Tap + to add medication</p>
      )}
    </div>
  );
}

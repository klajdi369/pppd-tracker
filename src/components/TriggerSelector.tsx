import { COMMON_TRIGGERS } from '../types';

interface TriggerSelectorProps {
  selected: string[];
  onChange: (triggers: string[]) => void;
}

export default function TriggerSelector({ selected, onChange }: TriggerSelectorProps) {
  function toggle(trigger: string) {
    if (selected.includes(trigger)) {
      onChange(selected.filter((t) => t !== trigger));
    } else {
      onChange([...selected, trigger]);
    }
  }

  return (
    <div className="trigger-selector">
      <h4>Triggers Today</h4>
      <div className="trigger-chips">
        {COMMON_TRIGGERS.map((trigger) => (
          <button
            key={trigger}
            type="button"
            className={`chip ${selected.includes(trigger) ? 'chip-active' : ''}`}
            onClick={() => toggle(trigger)}
          >
            {trigger}
          </button>
        ))}
      </div>
    </div>
  );
}

import type { TimeOfDayRating, TimePeriod } from '../types';
import { TIME_PERIODS, TIME_PERIOD_LABELS } from '../types';
import { Sun, Sunrise, SunMedium, Moon } from 'lucide-react';

interface TimeOfDaySlidersProps {
  label: string;
  rating: TimeOfDayRating;
  onChange: (rating: TimeOfDayRating) => void;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  colorScale?: boolean;
}

const PERIOD_ICONS: Record<TimePeriod, typeof Sun> = {
  morning: Sunrise,
  midday: Sun,
  afternoon: SunMedium,
  evening: Moon,
};

export default function TimeOfDaySliders({
  label,
  rating,
  onChange,
  min = 0,
  max = 10,
  lowLabel,
  highLabel,
  colorScale = false,
}: TimeOfDaySlidersProps) {
  function getColor(value: number) {
    if (!colorScale) return 'var(--color-primary)';
    const pct = ((value - min) / (max - min)) * 100;
    if (pct <= 30) return 'var(--color-good)';
    if (pct <= 60) return 'var(--color-moderate)';
    return 'var(--color-bad)';
  }

  function updatePeriod(period: TimePeriod, value: number) {
    onChange({ ...rating, [period]: value });
  }

  return (
    <div className="tod-sliders">
      <div className="tod-header">
        <span className="tod-label">{label}</span>
        {(lowLabel || highLabel) && (
          <span className="tod-range-hint">{lowLabel} → {highLabel}</span>
        )}
      </div>
      <div className="tod-grid">
        {TIME_PERIODS.map((period) => {
          const Icon = PERIOD_ICONS[period];
          const value = rating[period];
          const pct = ((value - min) / (max - min)) * 100;
          return (
            <div key={period} className="tod-item">
              <div className="tod-item-header">
                <Icon size={14} className="tod-icon" />
                <span className="tod-period-label">{TIME_PERIOD_LABELS[period]}</span>
                <span
                  className="tod-value"
                  style={{ color: colorScale ? getColor(value) : undefined }}
                >
                  {value}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={1}
                value={value}
                onChange={(e) => updatePeriod(period, Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, ${getColor(value)} 0%, ${getColor(value)} ${pct}%, var(--color-bg-tertiary) ${pct}%, var(--color-bg-tertiary) 100%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

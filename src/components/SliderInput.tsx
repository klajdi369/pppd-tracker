interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  lowLabel?: string;
  highLabel?: string;
  colorScale?: boolean;
}

export default function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  lowLabel,
  highLabel,
  colorScale = false,
}: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  function getColor() {
    if (!colorScale) return 'var(--color-primary)';
    if (percentage <= 30) return 'var(--color-good)';
    if (percentage <= 60) return 'var(--color-moderate)';
    return 'var(--color-bad)';
  }

  return (
    <div className="slider-input">
      <div className="slider-header">
        <label>{label}</label>
        <span className="slider-value" style={{ color: colorScale ? getColor() : undefined }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, ${getColor()} 0%, ${getColor()} ${percentage}%, var(--color-bg-tertiary) ${percentage}%, var(--color-bg-tertiary) 100%)`,
        }}
      />
      {(lowLabel || highLabel) && (
        <div className="slider-labels">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}

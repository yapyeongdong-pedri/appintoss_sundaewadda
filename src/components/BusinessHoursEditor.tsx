import { HOUR_OPTIONS, formatBusinessHours, type BusinessHoursValue } from "../lib/businessHours";

interface BusinessHoursEditorProps {
  value: BusinessHoursValue;
  onChange: (next: BusinessHoursValue) => void;
}

export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  const isValid = value.startHour < value.endHour;

  return (
    <div className="business-hours-editor">
      <div className="business-hours-grid">
        <label className="field">
          <span>{"\uC2DC\uC791 \uC2DC\uAC04"}</span>
          <select
            value={value.startHour}
            onChange={(event) => onChange({ ...value, startHour: Number(event.target.value) })}
          >
            {HOUR_OPTIONS.filter((hour) => hour < 24).map((hour) => (
              <option key={`start-${hour}`} value={hour}>
                {`${hour}\uC2DC`}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{"\uC885\uB8CC \uC2DC\uAC04"}</span>
          <select
            value={value.endHour}
            onChange={(event) => onChange({ ...value, endHour: Number(event.target.value) })}
          >
            {HOUR_OPTIONS.filter((hour) => hour > 0).map((hour) => (
              <option key={`end-${hour}`} value={hour}>
                {`${hour}\uC2DC`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="hint-card">
        <p className="section-label">{"\uC601\uC5C5\uC2DC\uAC04 \uBBF8\uB9AC\uBCF4\uAE30"}</p>
        <p className="muted-text">
          {isValid
            ? formatBusinessHours(value)
            : "\uC885\uB8CC \uC2DC\uAC04\uC740 \uC2DC\uC791 \uC2DC\uAC04\uBCF4\uB2E4 \uB4A4\uC5D0 \uC624\uB3C4\uB85D \uC120\uD0DD\uD574\uC8FC\uC138\uC694."}
        </p>
      </div>
    </div>
  );
}

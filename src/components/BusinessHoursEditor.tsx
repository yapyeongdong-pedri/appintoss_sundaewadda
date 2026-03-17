import { HOUR_OPTIONS, type BusinessHoursValue } from "../lib/businessHours";

interface BusinessHoursEditorProps {
  value: BusinessHoursValue;
  onChange: (next: BusinessHoursValue) => void;
}

export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  return (
    <div className="business-hours-editor">
      <div className="business-hours-grid">
        <label className="field">
          <span>{"\uC601\uC5C5\uC2DC\uAC04"}</span>
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

        <div className="business-hours-divider" aria-hidden="true">
          {"~"}
        </div>

        <label className="field business-hours-end">
          <span className="business-hours-sr-only">{"\uC885\uB8CC \uC2DC\uAC04"}</span>
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
    </div>
  );
}

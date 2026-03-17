import type { VisitRule } from "../types";
import {
  MONTHLY_NTH_OPTIONS,
  WEEKDAY_OPTIONS,
  createVisitRule,
} from "../lib/visitRules";

interface VisitRuleEditorProps {
  value: VisitRule[];
  onChange: (next: VisitRule[]) => void;
}

const MODE_OPTIONS: Array<{ value: VisitRule["mode"]; label: string }> = [
  { value: "daily", label: "\uB9E4\uC77C" },
  { value: "weekly", label: "\uB9E4\uC8FC" },
  { value: "monthlyNth", label: "\uB9E4\uC6D4" },
  { value: "custom", label: "\uC9C1\uC811 \uC785\uB825" },
];

export function VisitRuleEditor({ value, onChange }: VisitRuleEditorProps) {
  const rules = value.length > 0 ? value : [createVisitRule()];

  const updateRule = (index: number, nextRule: VisitRule) => {
    onChange(rules.map((rule, ruleIndex) => (ruleIndex === index ? nextRule : rule)));
  };

  const removeRule = (index: number) => {
    if (rules.length === 1) {
      onChange([createVisitRule("custom")]);
      return;
    }

    onChange(rules.filter((_, ruleIndex) => ruleIndex !== index));
  };

  return (
    <div className="visit-rule-editor">
      {rules.map((rule, index) => (
        <div className="visit-rule-card" key={`visit-rule-${index}`}>
          <div className="visit-rule-head">
            <strong>{`\uC6B4\uC601 \uADDC\uCE59 ${index + 1}`}</strong>
            <button type="button" className="detail-text-button" onClick={() => removeRule(index)}>
              {"\uC0AD\uC81C"}
            </button>
          </div>

          <div className="field-picker-grid visit-mode-grid">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`field-chip ${rule.mode === option.value ? "field-chip-active" : ""}`}
                onClick={() => updateRule(index, createVisitRule(option.value))}
              >
                {option.label}
              </button>
            ))}
          </div>

          {rule.mode === "daily" ? (
            <small className="field-help">
              {"\uB9E4\uC77C \uAC19\uC740 \uC7A5\uC18C\uC640 \uC2DC\uAC04\uC5D0 \uC6B4\uC601\uD558\uB294 \uACBD\uC6B0\uC5D0 \uC801\uD569\uD574\uC694."}
            </small>
          ) : null}

          {rule.mode === "weekly" ? (
            <>
              <label className="field">
                <span>{"\uC8FC\uAE30"}</span>
                <div className="field-picker-grid visit-mode-grid visit-interval-grid">
                  {[1, 2].map((interval) => (
                    <button
                      key={interval}
                      type="button"
                      className={`field-chip ${rule.interval === interval ? "field-chip-active" : ""}`}
                      onClick={() => updateRule(index, { ...rule, interval: interval as 1 | 2 })}
                    >
                      {interval === 1 ? "\uB9E4\uC8FC" : "\uACA9\uC8FC"}
                    </button>
                  ))}
                </div>
              </label>
              <div className="field">
                <span>{"\uC694\uC77C"}</span>
                <div className="field-picker-grid visit-weekday-grid">
                  {WEEKDAY_OPTIONS.map((option) => {
                    const active = rule.weekdays.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`field-chip ${active ? "field-chip-active" : ""}`}
                        onClick={() =>
                          updateRule(index, {
                            ...rule,
                            weekdays: active
                              ? rule.weekdays.filter((weekday) => weekday !== option.value)
                              : [...rule.weekdays, option.value],
                          })
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {rule.mode === "monthlyNth" ? (
            <>
              <div className="field">
                <span>{"\uBA87\uC9F8 \uC8FC"}</span>
                <div className="field-picker-grid visit-monthly-grid">
                  {MONTHLY_NTH_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`field-chip ${rule.nth === option.value ? "field-chip-active" : ""}`}
                      onClick={() => updateRule(index, { ...rule, nth: option.value })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <span>{"\uC694\uC77C"}</span>
                <div className="field-picker-grid visit-weekday-grid">
                  {WEEKDAY_OPTIONS.map((option) => {
                    const active = rule.weekdays.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`field-chip ${active ? "field-chip-active" : ""}`}
                        onClick={() =>
                          updateRule(index, {
                            ...rule,
                            weekdays: active
                              ? rule.weekdays.filter((weekday) => weekday !== option.value)
                              : [...rule.weekdays, option.value],
                          })
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {rule.mode === "custom" ? (
            <label className="field">
              <span>{"\uC9C1\uC811 \uC785\uB825"}</span>
              <input
                value={rule.text}
                onChange={(event) => updateRule(index, { ...rule, text: event.target.value })}
                placeholder="\uC608: \uB9E4\uC6D4 10\uC77C 20\uC77C 30\uC77C\uC5D0 \uC640\uC694"
              />
              <small className="field-help">
                {"\uC815\uD615\uD654\uD558\uAE30 \uC5B4\uB824\uC6B4 \uADDC\uCE59\uC740 \uC9C1\uC811 \uC785\uB825\uC73C\uB85C \uB0A8\uACA8\uB458 \uC218 \uC788\uC5B4\uC694."}
              </small>
            </label>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        className="field-chip visit-rule-add"
        onClick={() => onChange([...rules, createVisitRule()])}
      >
        {"\uC6B4\uC601 \uADDC\uCE59 \uCD94\uAC00"}
      </button>
    </div>
  );
}

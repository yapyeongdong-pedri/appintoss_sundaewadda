import type { MonthlyNth, VisitRule, Weekday } from "../types";

export const WEEKDAY_OPTIONS: Array<{ value: Weekday; label: string }> = [
  { value: "sun", label: "\uC77C" },
  { value: "mon", label: "\uC6D4" },
  { value: "tue", label: "\uD654" },
  { value: "wed", label: "\uC218" },
  { value: "thu", label: "\uBAA9" },
  { value: "fri", label: "\uAE08" },
  { value: "sat", label: "\uD1A0" },
];

export const MONTHLY_NTH_OPTIONS: Array<{ value: MonthlyNth; label: string }> = [
  { value: 1, label: "\uCCAB\uC9F8\uC8FC" },
  { value: 2, label: "\uB458\uC9F8\uC8FC" },
  { value: 3, label: "\uC14B\uC9F8\uC8FC" },
  { value: 4, label: "\uB137\uC9F8\uC8FC" },
];

export function createVisitRule(mode: VisitRule["mode"] = "weekly"): VisitRule {
  switch (mode) {
    case "daily":
      return { mode: "daily" };
    case "weekly":
      return { mode: "weekly", interval: 1, weekdays: ["sat"] };
    case "monthlyNth":
      return { mode: "monthlyNth", nth: 1, weekdays: ["sat"] };
    case "custom":
      return { mode: "custom", text: "" };
    default:
      return { mode: "weekly", interval: 1, weekdays: ["sat"] };
  }
}

export function isVisitRuleValid(rule: VisitRule): boolean {
  switch (rule.mode) {
    case "daily":
      return true;
    case "weekly":
      return rule.weekdays.length > 0;
    case "monthlyNth":
      return rule.weekdays.length > 0;
    case "custom":
      return rule.text.trim() !== "";
    default:
      return false;
  }
}

export function areVisitRulesValid(rules: VisitRule[]): boolean {
  return rules.length > 0 && rules.every(isVisitRuleValid);
}

export function formatWeekdays(weekdays: Weekday[]): string {
  return weekdays
    .map((weekday) => WEEKDAY_OPTIONS.find((option) => option.value === weekday)?.label ?? weekday)
    .join("/");
}

export function formatVisitRule(rule: VisitRule): string {
  switch (rule.mode) {
    case "daily":
      return "\uB9E4\uC77C";
    case "weekly":
      return `${rule.interval === 2 ? "\uACA9\uC8FC" : "\uB9E4\uC8FC"} ${formatWeekdays(rule.weekdays)}\uC694\uC77C`;
    case "monthlyNth": {
      const nthLabel = MONTHLY_NTH_OPTIONS.find((option) => option.value === rule.nth)?.label ?? `${rule.nth}`;
      return `\uB9E4\uC6D4 ${nthLabel} ${formatWeekdays(rule.weekdays)}\uC694\uC77C`;
    }
    case "custom":
      return rule.text.trim();
    default:
      return "";
  }
}

export function formatVisitRules(rules?: VisitRule[], fallback?: string): string {
  const validRules = (rules ?? []).filter(isVisitRuleValid);
  if (validRules.length === 0) {
    return fallback ?? "";
  }

  return validRules.map(formatVisitRule).join(" / ");
}

export function buildCustomVisitRules(text: string): VisitRule[] {
  return text.trim() === "" ? [] : [{ mode: "custom", text: text.trim() }];
}

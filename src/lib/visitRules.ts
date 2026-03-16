import type { MonthlyNth, VisitRule, Weekday } from "../types";

export const WEEKDAY_OPTIONS: Array<{ value: Weekday; label: string }> = [
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
  { value: "sun", label: "일" },
];

export const MONTHLY_NTH_OPTIONS: Array<{ value: MonthlyNth; label: string }> = [
  { value: 1, label: "1째주" },
  { value: 2, label: "2째주" },
  { value: 3, label: "3째주" },
  { value: 4, label: "4째주" },
  { value: "last", label: "마지막 주" },
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
      return "매일";
    case "weekly":
      return `${rule.interval === 2 ? "격주" : "매주"} ${formatWeekdays(rule.weekdays)}요일`;
    case "monthlyNth": {
      const nthLabel = MONTHLY_NTH_OPTIONS.find((option) => option.value === rule.nth)?.label ?? `${rule.nth}`;
      return `매월 ${nthLabel} ${formatWeekdays(rule.weekdays)}요일`;
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

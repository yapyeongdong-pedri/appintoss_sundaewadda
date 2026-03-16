export interface BusinessHoursValue {
  startHour: number;
  endHour: number;
}

export const HOUR_OPTIONS = Array.from({ length: 25 }, (_, index) => index);

export function formatBusinessHours(hours: BusinessHoursValue): string {
  return `${hours.startHour}\uC2DC ~ ${hours.endHour}\uC2DC`;
}

export function parseBusinessHours(value?: string): BusinessHoursValue | null {
  if (value == null) {
    return null;
  }

  const matched = value.match(/(\d{1,2})\D+(\d{1,2})/);
  if (matched == null) {
    return null;
  }

  const startHour = Number(matched[1]);
  const endHour = Number(matched[2]);
  if (Number.isNaN(startHour) || Number.isNaN(endHour)) {
    return null;
  }

  if (startHour < 0 || startHour > 23 || endHour < 1 || endHour > 24 || startHour >= endHour) {
    return null;
  }

  return { startHour, endHour };
}

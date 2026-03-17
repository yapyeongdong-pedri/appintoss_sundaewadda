import type { LiveReport, ReportKind } from "../types";

const REPORTER_KEY_STORAGE = "sundae-watta/reporter-key";

export const REPORT_DISTANCE_DIRECT_METERS = 70;
export const REPORT_DISTANCE_MAX_METERS = 140;
export const REPORT_ACCURACY_LIMIT_METERS = 70;

export function normalizeReportKind(type: string): ReportKind | null {
  if (type === "open" || type === "closed") {
    return type;
  }

  return null;
}

export function sanitizeLiveReports(reports: Array<LiveReport | (Omit<LiveReport, "type"> & { type: string })>) {
  return reports.flatMap((report) => {
    const normalizedType = normalizeReportKind(report.type);
    if (normalizedType == null) {
      return [];
    }

    return [{ ...report, type: normalizedType }];
  });
}

export function getReportDateKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getOrCreateReporterKey(): string {
  if (typeof window === "undefined") {
    return "guest-device";
  }

  const existing = window.localStorage.getItem(REPORTER_KEY_STORAGE);
  if (existing != null && existing.trim() !== "") {
    return existing;
  }

  const next = crypto.randomUUID();
  window.localStorage.setItem(REPORTER_KEY_STORAGE, next);
  return next;
}

export function hasSubmittedSameReportToday(
  reports: LiveReport[],
  vendorId: string,
  type: ReportKind,
  reporterKey: string,
  reportDateKey: string,
) {
  return reports.some(
    (report) =>
      report.vendorId === vendorId &&
      report.type === type &&
      report.reporterId === reporterKey &&
      report.reportDateKey === reportDateKey,
  );
}

export function getDistanceInMeters(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
) {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const earthRadius = 6371000;
  const latitudeDiff = toRadians(endLatitude - startLatitude);
  const longitudeDiff = toRadians(endLongitude - startLongitude);
  const startLatitudeRadians = toRadians(startLatitude);
  const endLatitudeRadians = toRadians(endLatitude);

  const haversine =
    Math.sin(latitudeDiff / 2) ** 2 +
    Math.cos(startLatitudeRadians) *
      Math.cos(endLatitudeRadians) *
      Math.sin(longitudeDiff / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function canSubmitLiveReport(distanceMeters: number, accuracyMeters: number) {
  if (distanceMeters <= REPORT_DISTANCE_DIRECT_METERS) {
    return { allowed: true as const };
  }

  if (distanceMeters < REPORT_DISTANCE_MAX_METERS) {
    if (accuracyMeters < REPORT_ACCURACY_LIMIT_METERS) {
      return { allowed: true as const };
    }

    return {
      allowed: false as const,
      message: "GPS 오차로 반영이 불가합니다.",
    };
  }

  return {
    allowed: false as const,
    message: "트럭 근처에서만 실시간 제보할 수 있어요.",
  };
}

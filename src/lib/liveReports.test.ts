import { describe, expect, it } from "vitest";
import {
  canSubmitLiveReport,
  getReportDateKey,
  hasSubmittedSameReportToday,
} from "./liveReports";
import type { LiveReport } from "../types";

describe("canSubmitLiveReport", () => {
  it("allows reports within 70m", () => {
    expect(canSubmitLiveReport(68, 120).allowed).toBe(true);
  });

  it("allows reports between 70m and 140m only when accuracy is under 70m", () => {
    expect(canSubmitLiveReport(100, 50).allowed).toBe(true);
    expect(canSubmitLiveReport(100, 70)).toEqual({
      allowed: false,
      message: "GPS 오차로 반영이 불가합니다.",
    });
  });

  it("blocks reports beyond 140m", () => {
    expect(canSubmitLiveReport(150, 20)).toEqual({
      allowed: false,
      message: "트럭 근처에서만 실시간 제보할 수 있어요.",
    });
  });
});

describe("hasSubmittedSameReportToday", () => {
  it("blocks duplicate reports of the same type on the same date", () => {
    const reports: LiveReport[] = [
      {
        id: "report-1",
        vendorId: "vendor-1",
        type: "open",
        createdAt: "2026-03-17T10:00:00+09:00",
        reportDateKey: "2026-03-17",
        reporterId: "user-1",
      },
    ];

    expect(hasSubmittedSameReportToday(reports, "vendor-1", "open", "user-1", "2026-03-17")).toBe(true);
    expect(hasSubmittedSameReportToday(reports, "vendor-1", "closed", "user-1", "2026-03-17")).toBe(false);
  });
});

describe("getReportDateKey", () => {
  it("builds a date key from an ISO date", () => {
    expect(getReportDateKey("2026-03-17T18:20:00+09:00")).toBe("2026-03-17");
  });
});

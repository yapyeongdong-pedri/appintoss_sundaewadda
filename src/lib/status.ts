import type { LiveReport, ReportKind, TruckStatus, Vendor, VendorSummary } from "../types";

export function countReports(reports: LiveReport[]): Record<ReportKind, number> {
  return reports.reduce(
    (acc, report) => {
      acc[report.type] += 1;
      return acc;
    },
    { open: 0, notYet: 0, closed: 0 },
  );
}

export function deriveStatus(vendor: Vendor, reports: LiveReport[]): TruckStatus {
  if (reports.length === 0) {
    return "unknown";
  }

  const latest = [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const counts = countReports(reports);

  if (latest.type === "closed" && counts.closed >= counts.open) {
    return "likelyClosed";
  }

  if (latest.type === "open" || counts.open > counts.closed) {
    return "likelyOpen";
  }

  return "unknown";
}

export function buildVendorSummary(vendor: Vendor, reports: LiveReport[]): VendorSummary {
  const scopedReports = reports.filter((report) => report.vendorId === vendor.id);
  const latestReport = [...scopedReports].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return {
    ...vendor,
    status: deriveStatus(vendor, scopedReports),
    reportCounts: countReports(scopedReports),
    latestReportAt: latestReport?.createdAt,
  };
}

export function getStatusLabel(status: TruckStatus): string {
  switch (status) {
    case "ownerConfirmed":
      return "\uC601\uC5C5\uC911";
    case "likelyOpen":
      return "\uC601\uC5C5\uC911";
    case "likelyClosed":
      return "\uC601\uC5C5\uC885\uB8CC";
    default:
      return "\uD655\uC778 \uC81C\uBCF4 \uD544\uC694";
  }
}

export function getStatusTone(status: TruckStatus): "blue" | "green" | "yellow" | "elephant" {
  switch (status) {
    case "ownerConfirmed":
      return "blue";
    case "likelyOpen":
      return "blue";
    case "likelyClosed":
      return "yellow";
    default:
      return "elephant";
  }
}

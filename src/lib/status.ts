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
  if (vendor.ownerConfirmedToday) {
    return "ownerConfirmed";
  }

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
      return "\uC0AC\uC7A5\uB2D8 \uD655\uC778";
    case "likelyOpen":
      return "\uC601\uC5C5\uC911 \uAC00\uB2A5\uC131";
    case "likelyClosed":
      return "\uC601\uC5C5\uC885\uB8CC \uAC00\uB2A5\uC131";
    default:
      return "\uD655\uC778 \uC81C\uBCF4 \uC5C6\uC74C";
  }
}

export function getStatusTone(status: TruckStatus): "blue" | "green" | "yellow" | "elephant" {
  switch (status) {
    case "ownerConfirmed":
      return "green";
    case "likelyOpen":
      return "blue";
    case "likelyClosed":
      return "yellow";
    default:
      return "elephant";
  }
}

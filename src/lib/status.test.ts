import { describe, expect, it } from "vitest";
import { seedReports, seedVendors } from "../data/seed";
import { buildVendorSummary, deriveStatus } from "./status";

describe("deriveStatus", () => {
  it("returns unknown when there are no reports", () => {
    const vendor = seedVendors.find((item) => item.id === "vendor-sundae-2");
    expect(vendor).toBeDefined();
    expect(deriveStatus([])).toBe("unknown");
  });

  it("returns likelyOpen when open reports lead", () => {
    const vendor = seedVendors.find((item) => item.id === "vendor-sundae-1");
    expect(vendor).toBeDefined();
    expect(
      deriveStatus(seedReports.filter((report) => report.vendorId === vendor!.id)),
    ).toBe("likelyOpen");
  });

  it("returns likelyClosed when latest closed reports dominate", () => {
    const vendor = seedVendors.find((item) => item.id === "vendor-gopchang-1");
    expect(vendor).toBeDefined();
    expect(
      deriveStatus(seedReports.filter((report) => report.vendorId === vendor!.id)),
    ).toBe("likelyClosed");
  });
});

describe("buildVendorSummary", () => {
  it("builds detailed report counts for the detail sheet", () => {
    const vendor = seedVendors[0];
    const summary = buildVendorSummary(vendor, seedReports);

    expect(summary.reportCounts.open).toBe(2);
    expect(summary.reportCounts.closed).toBe(0);
  });
});

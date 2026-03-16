import { describe, expect, it } from "vitest";
import { formatVisitRules } from "./visitRules";

describe("formatVisitRules", () => {
  it("formats mixed structured rules into a readable summary", () => {
    expect(
      formatVisitRules([
        { mode: "weekly", interval: 1, weekdays: ["sat"] },
        { mode: "weekly", interval: 2, weekdays: ["wed"] },
        { mode: "monthlyNth", nth: 2, weekdays: ["fri"] },
      ]),
    ).toBe("\uB9E4\uC8FC \uD1A0\uC694\uC77C / \uACA9\uC8FC \uC218\uC694\uC77C / \uB9E4\uC6D4 2\uC9F8\uC8FC \uAE08\uC694\uC77C");
  });

  it("falls back to custom text when structured rules are absent", () => {
    expect(formatVisitRules([], "\uC7A5\uB0A0 \uC704\uC8FC")).toBe("\uC7A5\uB0A0 \uC704\uC8FC");
  });
});

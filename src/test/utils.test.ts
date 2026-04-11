import { describe, it, expect } from "vitest";
import { formatDate, formatReadingTime } from "../scripts/utils";

describe("formatDate", () => {
  it("returns undefined for undefined input", () => {
    expect(formatDate(undefined)).toBeUndefined();
  });

  it("returns undefined for null input", () => {
    expect(formatDate(null)).toBeUndefined();
  });

  it("formats a date with correct structure", () => {
    // Use a fixed UTC date to avoid timezone-dependent failures
    const date = new Date("2025-01-15T14:30:05.123Z");
    const result = formatDate(date);
    // Should contain year and milliseconds
    expect(result).toMatch(/2025/);
    expect(result).toMatch(/123$/);
  });

  it("pads single-digit hours, minutes, seconds", () => {
    const date = new Date(2025, 0, 5, 1, 2, 3, 7); // Jan 5 2025 01:02:03.007
    const result = formatDate(date)!;
    expect(result).toMatch(/01:02:03\.007$/);
  });
});

describe("formatReadingTime", () => {
  it("formats 0ms as '0s 0ms'", () => {
    expect(formatReadingTime(0)).toBe("0s 0ms");
  });

  it("formats 500ms as '0s 500ms'", () => {
    expect(formatReadingTime(500)).toBe("0s 500ms");
  });

  it("formats 1000ms as '1s 0ms'", () => {
    expect(formatReadingTime(1000)).toBe("1s 0ms");
  });

  it("formats 62480ms as '1m 2s 480ms'", () => {
    expect(formatReadingTime(62480)).toBe("1m 2s 480ms");
  });

  it("omits minutes when zero", () => {
    expect(formatReadingTime(30000)).toBe("30s 0ms");
  });
});

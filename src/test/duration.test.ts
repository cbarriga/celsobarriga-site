import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { analyzeDuration } from "../scripts/duration";

// Fixed date so tests involving "Present" are deterministic
const FIXED_NOW = new Date("2026-04-19T00:00:00Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("analyzeDuration — string format", () => {
  it("parses a completed month-year range", () => {
    const result = analyzeDuration("July 2019 – Dec 2020");
    // Jul 2019 → Dec 2020 = 1 year 5 months ≈ 1.417 years
    expect(result.durationYears).toBeCloseTo(1.417, 1);
    expect(result.colorCategory).toBe("medium");
    expect(result.displayDateRange).toBe("July 2019 – Dec 2020");
  });

  it("treats 'Present' as the fixed current date", () => {
    const result = analyzeDuration("Jan 2024 – Present");
    // Jan 2024 → Apr 2026 ≈ 2.25 years
    expect(result.durationYears).toBeCloseTo(2.25, 1);
    expect(result.colorCategory).toBe("long");
    expect(result.displayDateRange).toBe("Jan 2024 – Present");
  });

  it("returns a medium-1yr fallback for unparseable strings", () => {
    const result = analyzeDuration("not a date range");
    expect(result.colorCategory).toBe("medium");
    expect(result.durationYears).toBe(1);
  });

  it("includes scale when includeScale is true", () => {
    // Jan 2020 → Jan 2022 = 2.0 years → scale = 2.0 / 1.2 ≈ 1.667
    const result = analyzeDuration("Jan 2020 – Jan 2022", undefined, true);
    expect(result.scale).toBeCloseTo(2 / 1.2, 2);
  });

  it("omits scale by default", () => {
    const result = analyzeDuration("Jan 2020 – Jan 2022");
    expect(result.scale).toBeUndefined();
  });
});

describe("analyzeDuration — structured object format", () => {
  it("parses { start, end } with YYYY-MM strings", () => {
    const result = analyzeDuration({ start: "2019-07", end: "2020-12" });
    expect(result.durationYears).toBeCloseTo(1.417, 1);
    expect(result.displayDateRange).toBe("Jul 2019 – Dec 2020");
  });

  it("treats missing end as current date", () => {
    // No end → falls through to new Date() → Apr 2026 with fixed timer
    const result = analyzeDuration({ start: "2024-01" });
    expect(result.durationYears).toBeCloseTo(2.25, 1);
    expect(result.displayDateRange).toBe("Jan 2024 – Apr 2026");
  });

  it("treats end='Present' as current date", () => {
    const result = analyzeDuration({ start: "2024-01", end: "Present" });
    expect(result.displayDateRange).toBe("Jan 2024 – Present");
  });
});

describe("analyzeDuration — color categories (default thresholds)", () => {
  it("assigns 'short' for < 0.75 years", () => {
    // Jan → Jun 2025 = 0.5 years
    expect(analyzeDuration({ start: "2025-01", end: "2025-06" }).colorCategory).toBe("short");
  });

  it("assigns 'medium' for 0.75–2 years", () => {
    // Jan 2023 → Jun 2024 = 1.5 years
    expect(analyzeDuration({ start: "2023-01", end: "2024-06" }).colorCategory).toBe("medium");
  });

  it("assigns 'long' for 2–4 years", () => {
    // Jan 2021 → Jun 2024 = 3.5 years
    expect(analyzeDuration({ start: "2021-01", end: "2024-06" }).colorCategory).toBe("long");
  });

  it("assigns 'very-long' for >= 4 years", () => {
    // Jan 2019 → Jun 2024 = 5.5 years
    expect(analyzeDuration({ start: "2019-01", end: "2024-06" }).colorCategory).toBe("very-long");
  });

  it("respects custom thresholds", () => {
    // 0.5 years is 'medium' with default thresholds but 'short' with short=1
    const result = analyzeDuration(
      { start: "2025-01", end: "2025-06" },
      { short: 1, medium: 3, long: 5 },
    );
    expect(result.colorCategory).toBe("short");
  });
});

describe("analyzeDuration — scale clamping", () => {
  it("clamps scale to minimum 0.5 for very short durations", () => {
    // 1 month → scale would be ~0.07 without clamping
    const result = analyzeDuration({ start: "2025-01", end: "2025-02" }, undefined, true);
    expect(result.scale).toBe(0.5);
  });

  it("clamps scale to maximum 4 for very long durations", () => {
    // ~15 years → scale would be ~12.5 without clamping
    const result = analyzeDuration({ start: "2010-01", end: "2024-12" }, undefined, true);
    expect(result.scale).toBe(4);
  });

  it("computes unclamped scale for mid-range durations", () => {
    // Jan 2022 → May 2024 = 2 + 4/12 ≈ 2.333 years → scale = 2.333/1.2 ≈ 1.944
    const result = analyzeDuration({ start: "2022-01", end: "2024-05" }, undefined, true);
    expect(result.scale).toBeCloseTo(1.944, 2);
  });
});

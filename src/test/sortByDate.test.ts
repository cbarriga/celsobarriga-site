import { describe, it, expect } from "vitest";
import { sortByDate } from "../components/sortByDate";

const entry = (pubDate: Date | string | undefined) => ({ data: { pubDate } });

describe("sortByDate", () => {
  it("sorts newest first", () => {
    const a = entry(new Date("2024-01-01"));
    const b = entry(new Date("2025-01-01"));
    expect(sortByDate(a, b)).toBeGreaterThan(0); // b > a, so b comes first
    expect(sortByDate(b, a)).toBeLessThan(0);
  });

  it("returns 0 for equal dates", () => {
    const a = entry(new Date("2025-06-01"));
    const b = entry(new Date("2025-06-01"));
    expect(sortByDate(a, b)).toBe(0);
  });

  it("treats missing pubDate as epoch (sorts last)", () => {
    const withDate = entry(new Date("2025-01-01"));
    const withoutDate = entry(undefined);
    // withDate is newer than epoch, so withoutDate should sort after
    expect(sortByDate(withoutDate, withDate)).toBeGreaterThan(0);
  });

  it("accepts date strings", () => {
    const a = entry("2023-03-01");
    const b = entry("2024-03-01");
    expect(sortByDate(a, b)).toBeGreaterThan(0);
  });
});

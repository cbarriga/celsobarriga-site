import { describe, it, expect, vi, beforeEach } from "vitest";
import { getThemePreference, applyTheme, toggleTheme } from "../scripts/theme";

beforeEach(() => {
  document.documentElement.classList.remove("dark");
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});

describe("getThemePreference", () => {
  it("returns 'dark' when stored in localStorage", () => {
    localStorage.setItem("theme", "dark");
    expect(getThemePreference()).toBe("dark");
  });

  it("returns 'light' when stored in localStorage", () => {
    localStorage.setItem("theme", "light");
    expect(getThemePreference()).toBe("light");
  });

  it("falls back to matchMedia when nothing is stored", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
    expect(getThemePreference()).toBe("dark");
  });

  it("returns 'light' when matchMedia doesn't prefer dark", () => {
    expect(getThemePreference()).toBe("light");
  });

  it("ignores invalid values in localStorage and falls back to matchMedia", () => {
    localStorage.setItem("theme", "purple");
    expect(getThemePreference()).toBe("light");
  });
});

describe("applyTheme", () => {
  it("adds the 'dark' class for dark theme", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes the 'dark' class for light theme", () => {
    document.documentElement.classList.add("dark");
    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists 'dark' to localStorage", () => {
    applyTheme("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("persists 'light' to localStorage", () => {
    applyTheme("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});

describe("toggleTheme", () => {
  it("switches from dark to light", () => {
    document.documentElement.classList.add("dark");
    toggleTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("switches from light to dark", () => {
    toggleTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

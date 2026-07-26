import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const headerSource = readFileSync(
  join(import.meta.dirname, "../components/Header.astro"),
  "utf-8",
);

// Astro components can't be rendered in this project's vitest setup (no
// component-rendering infra is configured), so these assertions check the
// source markup directly for the sticky-header contract.
const headerTagMatch = headerSource.match(/<header\b[^>]*>/);
const headerTag = headerTagMatch?.[0] ?? "";

describe("Header sticky positioning", () => {
  it("has a <header> tag", () => {
    expect(headerTagMatch).not.toBeNull();
  });

  it("sticks to the top of the viewport", () => {
    expect(headerTag).toMatch(/\bsticky\b/);
    expect(headerTag).toMatch(/\btop-0\b/);
  });

  it("sits above page content", () => {
    expect(headerTag).toMatch(/\bz-40\b/);
  });

  it("has an opaque background in both themes so scrolled content doesn't show through", () => {
    expect(headerTag).toMatch(/bg-\[rgb\(244,242,238\)\]/);
    expect(headerTag).toMatch(/dark:bg-\[rgb\(34,33,37\)\]/);
  });
});

describe("Header name visibility", () => {
  it("keeps the site name in the markup unconditionally (no scroll-based hide/fade)", () => {
    expect(headerSource).toContain("Celso Barriga");
    expect(headerSource).not.toMatch(/scrolled/);
  });

  it("does not ship a scroll listener to toggle header state", () => {
    expect(headerSource).not.toContain("<script>");
    expect(headerSource).not.toMatch(/addEventListener\(\s*["']scroll["']/);
  });
});

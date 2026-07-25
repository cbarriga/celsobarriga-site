import { describe, it, expect, beforeEach } from "vitest";
import { initRandomImages } from "../scripts/randomImage";

/**
 * Builds markup matching GetRandomImage.astro's <picture> structure.
 * Pass `withXlarge: false` to mimic Homepage.astro, which has no xlarge tier.
 * Pass `urls` (Homepage-style separate data-urls attribute) to exercise updateAnchor.
 */
function renderPicture(withXlarge = true, urls?: string[]): void {
  document.body.innerHTML = `
    <div class="randomimage"
      data-images='${JSON.stringify(images)}'
      data-width='${JSON.stringify(width)}'
      data-height='${JSON.stringify(height)}'
      ${urls ? `data-urls='${JSON.stringify(urls)}'` : ""}
    >
      <a href="/journal/tags/leica">
        <picture>
          ${withXlarge ? '<source media="(min-width: 2500px)" data-srcset-xlarge />' : ""}
          <source media="(min-width: 1280px)" data-srcset-large />
          <source media="(min-width: 768px)" data-srcset-medium />
          <img class="hidden" src="placeholder.gif" alt="Loading image" data-srcset-small />
        </picture>
      </a>
    </div>
  `;
}

const width = { xlarge: 3840, large: 1920, medium: 1280, small: 854 };
const height = { xlarge: 2160, large: 1080, medium: 720, small: 480 };

// A single-image array keeps shuffle()'s output deterministic (nothing to reorder).
const images = {
  xlarge: ["/xlarge.avif"],
  large: ["/large.avif"],
  medium: ["/medium.avif"],
  small: ["/small.avif"],
  alt: ["A test photo"],
};

describe("initRandomImages", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("wires the xlarge source when both the data and the <source> element are present", () => {
    renderPicture(true);
    initRandomImages(".randomimage");

    const sourceXlarge = document.querySelector<HTMLSourceElement>("source[data-srcset-xlarge]");
    const sourceLarge = document.querySelector<HTMLSourceElement>("source[data-srcset-large]");
    const sourceMedium = document.querySelector<HTMLSourceElement>("source[data-srcset-medium]");
    const img = document.querySelector<HTMLImageElement>("img");

    expect(sourceXlarge?.srcset).toBe("/xlarge.avif");
    expect(sourceLarge?.srcset).toBe("/large.avif");
    expect(sourceMedium?.srcset).toBe("/medium.avif");
    expect(img?.src).toContain("/small.avif");
    expect(img?.alt).toBe("A test photo");
    expect(img?.classList.contains("hidden")).toBe(false);
  });

  it("does not throw and still wires large/medium/small when there is no xlarge <source> (Homepage case)", () => {
    renderPicture(false);
    initRandomImages(".randomimage");

    const sourceLarge = document.querySelector<HTMLSourceElement>("source[data-srcset-large]");
    const sourceMedium = document.querySelector<HTMLSourceElement>("source[data-srcset-medium]");
    const img = document.querySelector<HTMLImageElement>("img");

    expect(sourceLarge?.srcset).toBe("/large.avif");
    expect(sourceMedium?.srcset).toBe("/medium.avif");
    expect(img?.src).toContain("/small.avif");
  });

  it("leaves the xlarge <source> unset when the data has no xlarge entry", () => {
    renderPicture(true);
    document.querySelector(".randomimage")!.setAttribute(
      "data-images",
      JSON.stringify({ ...images, xlarge: [null] }),
    );
    initRandomImages(".randomimage");

    const sourceXlarge = document.querySelector<HTMLSourceElement>("source[data-srcset-xlarge]");
    expect(sourceXlarge?.srcset).toBe("");
  });

  it("updates the anchor href and aria-label when updateAnchor is enabled", () => {
    renderPicture(true, ["/journal/nashville-2026-03"]);
    initRandomImages(".randomimage", { updateAnchor: true });

    const anchor = document.querySelector<HTMLAnchorElement>("a");
    expect(anchor?.getAttribute("href")).toBe("/journal/nashville-2026-03");
    expect(anchor?.getAttribute("aria-label")).toBe("View A test photo");
  });
});

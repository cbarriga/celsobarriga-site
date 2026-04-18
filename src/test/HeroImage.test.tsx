import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroImage from "../components/HeroImage";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(_cb: IntersectionObserverCallback) {}
    },
  );
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
});

const defaults = {
  title: "Test Post",
  tags: ["photography", "leica"],
  backgroundImage: "/images/test.avif",
  mobileBackgroundImage: "/images/test-mobile.avif",
  positionX: "50%",
  positionY: "50%",
  alt: "A test photo",
  collection: "journal",
};

describe("HeroImage", () => {
  it("renders the post title", () => {
    render(<HeroImage {...defaults} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("renders tag links with correct collection hrefs", () => {
    render(<HeroImage {...defaults} />);
    expect(screen.getByRole("link", { name: "photography" })).toHaveAttribute(
      "href",
      "/journal/tags/photography",
    );
    expect(screen.getByRole("link", { name: "leica" })).toHaveAttribute(
      "href",
      "/journal/tags/leica",
    );
  });

  it("sets draggable=false on the parallax img element", () => {
    render(<HeroImage {...defaults} />);
    const parallaxImg = document.querySelector('img[aria-hidden="true"]');
    expect(parallaxImg).not.toBeNull();
    expect(parallaxImg).toHaveAttribute("draggable", "false");
  });

  it("renders an accessible img with the provided alt text", () => {
    render(<HeroImage {...defaults} />);
    expect(screen.getByAltText("A test photo")).toBeInTheDocument();
  });

  it("renders without error when position props are omitted", () => {
    const { positionX: _x, positionY: _y, ...rest } = defaults;
    render(<HeroImage {...rest} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });
});

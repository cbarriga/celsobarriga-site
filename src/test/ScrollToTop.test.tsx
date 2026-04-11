import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import ScrollToTop from "../components/ScrollToTop";

beforeEach(() => {
  Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
  window.scrollTo = vi.fn();
  // Execute rAF callbacks synchronously so scroll state updates flush in tests
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { cb(0); return 0; });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

describe("ScrollToTop", () => {
  it("does not render the button when scrollY is 0", () => {
    render(<ScrollToTop />);
    expect(screen.queryByRole("button", { name: /scroll to top/i })).not.toBeInTheDocument();
  });

  it("renders the button after scrolling past 300px", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });
      fireEvent.scroll(window);
    });

    expect(screen.getByRole("button", { name: /scroll to top/i })).toBeInTheDocument();
  });

  it("calls window.scrollTo when the button is clicked", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });
      fireEvent.scroll(window);
    });

    fireEvent.click(screen.getByRole("button", { name: /scroll to top/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ThemeToggle from "../components/ThemeToggle";

describe("ThemeToggle", () => {
  it("renders a button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows 'Switch to dark theme' aria-label in light mode", () => {
    document.documentElement.classList.remove("dark");
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Switch to dark theme",
    );
  });

  it("shows 'Switch to light theme' aria-label in dark mode", async () => {
    await act(async () => {
      document.documentElement.classList.add("dark");
    });
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Switch to light theme",
    );
    await act(async () => {
      document.documentElement.classList.remove("dark");
    });
  });

  it("dispatches a 'theme-toggle' event on click", () => {
    const listener = vi.fn();
    window.addEventListener("theme-toggle", listener);
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener("theme-toggle", listener);
  });
});

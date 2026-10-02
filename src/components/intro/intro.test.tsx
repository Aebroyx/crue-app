import fs from "node:fs";
import path from "node:path";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import HomePage, { Storefront } from "@/app/page";
import { hasSeenIntro, introCookieName } from "@/lib/intro-cookie";

jest.mock("next/font/google", () => ({
  Geist: () => ({ className: "font-geist" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex" }),
}));

const cookieGet = jest.fn();

jest.mock("next/headers", () => ({
  cookies: async () => ({
    get: cookieGet,
  }),
}));

function intro() {
  const root = document.querySelector("[data-intro]");
  if (!root) {
    throw new Error("Intro is missing");
  }
  return within(root as HTMLElement);
}

describe("REQ-002 intro sequence", () => {
  beforeEach(() => {
    document.cookie = `${introCookieName}=; Path=/; Max-Age=0`;
    cookieGet.mockReset();
  });

  it("REQ-002 renders the intro mark and wordmark on the first visit", async () => {
    cookieGet.mockReturnValue(undefined);
    render(await HomePage());

    expect(intro().getByRole("img", { name: "CRUE mark" })).toHaveAttribute(
      "src",
      "/brand/crue-mark-white.png",
    );
    expect(intro().getByRole("img", { name: "CRUE" })).toHaveAttribute(
      "src",
      "/brand/crue-wordmark-white.png",
    );
  });

  it("REQ-002 uses the desktop and mobile intro copy", () => {
    render(<Storefront showIntro />);

    expect(screen.getByText("Get pulled in")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
    expect(screen.getByText("Crossing the event horizon").parentElement).toHaveClass(
      "hidden",
      "md:flex",
    );
    expect(intro().getByText("Drop 001 / Event Horizon")).toHaveClass(
      "hidden",
      "md:inline",
    );
    expect(intro().getByText("Drop 001")).toHaveClass("md:hidden");
  });

  it("REQ-002 does not render a video", () => {
    const { container } = render(<Storefront showIntro />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.innerHTML).not.toMatch(/\.mp4|video/i);
  });

  it("REQ-002 dismisses the intro and keeps it dismissed", async () => {
    cookieGet.mockReturnValue(undefined);
    render(await HomePage());

    fireEvent.click(screen.getByRole("button", { name: "Enter" }));

    expect(document.cookie).toContain(`${introCookieName}=1`);
    expect(screen.queryByRole("img", { name: "CRUE mark" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Event\s+Horizon/ })).toBeInTheDocument();

    cleanup();
    cookieGet.mockReturnValue({ value: "1" });
    expect(hasSeenIntro("1")).toBe(true);
    render(await HomePage());
    expect(screen.queryByRole("img", { name: "CRUE mark" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Event\s+Horizon/ })).toBeInTheDocument();
  });

  it("REQ-002 shows the final still state when motion is reduced", () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    const reduced = css.slice(css.indexOf("prefers-reduced-motion"));

    expect(reduced).toContain(".intro-bh");
    expect(reduced).toContain("display: none");
    expect(reduced).toMatch(/\.intro-bar\s*\{[^}]*width:\s*100%/);

    render(<Storefront showIntro />);
    expect(intro().getByRole("img", { name: "CRUE mark" })).toBeInTheDocument();
    expect(intro().getByRole("img", { name: "CRUE" })).toBeInTheDocument();
    expect(screen.getByText("Get pulled in")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
    expect(document.querySelector(".intro-bh")).toBeInTheDocument();
  });

  it("REQ-002 does not render the home, a product, or a sound control", () => {
    render(<Storefront showIntro />);
    const overlay = intro();

    expect(overlay.queryByRole("navigation")).not.toBeInTheDocument();
    expect(overlay.queryByRole("button", { name: /sound/i })).not.toBeInTheDocument();
    expect(overlay.queryByText("Shop Drop 001")).not.toBeInTheDocument();
    expect(overlay.queryByText("Horizon Shell Jacket")).not.toBeInTheDocument();
  });

  it("REQ-002 does not dismiss the intro when the sequence ends", () => {
    jest.useFakeTimers();
    render(<Storefront showIntro />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
    jest.useRealTimers();
  });
});

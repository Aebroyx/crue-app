import fs from "node:fs";
import path from "node:path";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { metadata } from "./layout";
import HomePage, { Storefront } from "./page";
import { hasSeenIntro, introCookieName } from "./intro-cookie";

jest.mock("next/font/google", () => ({
  Geist: () => ({ className: "font-geist" }),
  Archivo: () => ({ variable: "font-archivo" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex" }),
}));

const cookieGet = jest.fn();

jest.mock("next/headers", () => ({
  cookies: async () => ({
    get: cookieGet,
  }),
}));

describe("REQ-002 intro sequence", () => {
  beforeEach(() => {
    document.cookie = `${introCookieName}=; Path=/; Max-Age=0`;
    cookieGet.mockReset();
  });

  it("REQ-002 renders the intro mark and wordmark on the first visit", async () => {
    cookieGet.mockReturnValue(undefined);
    render(await HomePage());

    expect(screen.getByRole("img", { name: "CRUE mark" })).toHaveAttribute(
      "src",
      "/brand/crue-mark-white.png",
    );
    expect(screen.getByRole("img", { name: "CRUE" })).toHaveAttribute(
      "src",
      "/brand/crue-wordmark-white.png",
    );
  });

  it("REQ-002 uses the desktop and mobile intro copy", () => {
    render(<Storefront showIntro />);

    expect(screen.getByText("Get pulled in")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skip", exact: true })).toHaveClass(
      "hidden",
      "md:inline",
    );
    expect(screen.getByText("Crossing the event horizon").parentElement).toHaveClass(
      "hidden",
      "md:flex",
    );
    expect(screen.getByRole("button", { name: "Skip intro" })).toHaveClass(
      "md:hidden",
    );
    expect(screen.getByText("Drop 001 / Event Horizon")).toHaveClass(
      "hidden",
      "md:inline",
    );
    expect(screen.getByText("Drop 001")).toHaveClass("md:hidden");
  });

  it("REQ-002 does not render a video", () => {
    const { container } = render(<Storefront showIntro />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.innerHTML).not.toMatch(/\.mp4|video/i);
  });

  it("REQ-002 dismisses the intro and keeps it dismissed", async () => {
    cookieGet.mockReturnValue(undefined);
    render(await HomePage());

    fireEvent.click(screen.getByRole("button", { name: "Skip", exact: true }));

    expect(document.cookie).toContain(`${introCookieName}=1`);
    expect(screen.queryByRole("img", { name: "CRUE mark" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Crue" })).toHaveAttribute(
      "src",
      expect.stringContaining("cruebh-white.svg"),
    );

    cleanup();
    cookieGet.mockReturnValue({ value: "1" });
    expect(hasSeenIntro("1")).toBe(true);
    render(await HomePage());
    expect(screen.queryByRole("img", { name: "CRUE mark" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Crue" })).toBeInTheDocument();
  });

  it("REQ-002 shows the final still state when motion is reduced", () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), "app/globals.css"),
      "utf8",
    );
    const reduced = css.slice(css.indexOf("prefers-reduced-motion"));

    expect(reduced).toContain(".intro-bh");
    expect(reduced).toContain("display: none");
    expect(reduced).toMatch(/\.intro-bar\s*\{[^}]*width:\s*100%/);

    render(<Storefront showIntro />);
    expect(screen.getByRole("img", { name: "CRUE mark" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "CRUE" })).toBeInTheDocument();
    expect(screen.getByText("Get pulled in")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
    expect(document.querySelector(".intro-bh")).toBeInTheDocument();
  });

  it("REQ-002 does not render the home, a product, or a sound control", () => {
    const { container } = render(<Storefront showIntro />);

    expect(container.querySelector("nav")).toBeNull();
    expect(screen.queryByRole("button", { name: /sound/i })).not.toBeInTheDocument();
    expect(screen.queryByText("Shop Drop 001")).not.toBeInTheDocument();
    expect(screen.queryByText("Horizon Shell Jacket")).not.toBeInTheDocument();
  });

  it("REQ-002 sets the favicon to the white black-hole mark", async () => {
    const sharp = require("sharp") as typeof import("sharp");
    const icons = metadata.icons as { icon: string };
    const file = path.join(process.cwd(), "public", icons.icon);
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    expect(icons.icon).toBe("/brand/crue-mark-white.png");
    expect(metadata.title).toBe("Crue");
    expect(fs.existsSync(path.join(process.cwd(), "app/icon.png"))).toBe(false);

    let transparent = 0;
    let white = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      if (data[i + 3] === 0) transparent += 1;
      if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240 && data[i + 3] > 240) {
        white += 1;
      }
    }
    expect(transparent).toBeGreaterThan(0);
    expect(white).toBeGreaterThan(100);
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

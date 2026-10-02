import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";

function css() {
  return fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
}

describe("REQ-013 intro logo", () => {
  it("REQ-013 hides the black hole", () => {
    render(<Storefront showIntro />);

    expect(document.querySelector(".intro-bh")).toHaveClass("hidden");
    expect(document.querySelector(".intro-halo")).toHaveClass("hidden");
  });

  it("REQ-013 brings the mark in without waiting for the collapse", () => {
    expect(css()).toMatch(/\.intro-mark\s*\{[^}]*intro-mark 1\.6s 0\.2s/);
    expect(css()).not.toMatch(/\.intro-mark\s*\{[^}]*2\.8s/);
  });

  it("REQ-013 still reveals the wordmark and Enter", () => {
    render(<Storefront showIntro />);
    const intro = within(document.querySelector("[data-intro]") as HTMLElement);

    expect(intro.getByRole("img", { name: "CRUE mark" })).toBeInTheDocument();
    expect(intro.getByRole("img", { name: "CRUE" })).toBeInTheDocument();
    expect(intro.getByText("Get pulled in")).toBeInTheDocument();
    expect(intro.getByRole("button", { name: "Enter" })).toBeInTheDocument();
  });

  it("REQ-013 does not show a skip control", () => {
    render(<Storefront showIntro />);
    const intro = within(document.querySelector("[data-intro]") as HTMLElement);

    expect(intro.queryByRole("button", { name: "Skip", exact: true })).not.toBeInTheDocument();
    expect(intro.queryByRole("button", { name: "Skip intro" })).not.toBeInTheDocument();
  });

  it("REQ-013 dismisses the intro with Enter", () => {
    render(<Storefront showIntro />);

    fireEvent.click(screen.getByRole("button", { name: "Enter" }));

    expect(document.cookie).toContain("crue_intro=1");
    expect(document.querySelector("[data-intro]")).not.toBeInTheDocument();
  });

  it("REQ-013 keeps the black-hole code", () => {
    const intro = fs.readFileSync(
      path.join(process.cwd(), "src/components/intro/intro.tsx"),
      "utf8",
    );
    const sheet = css();

    expect(intro).toContain("intro-bh");
    expect(intro).toContain("intro-disk");
    expect(sheet).toContain("@keyframes intro-spin");
    expect(sheet).toContain("@keyframes intro-collapse");
    expect(sheet).toMatch(/\.intro-disk\s*\{[^}]*intro-spin 14s/);
    expect(sheet).toMatch(/\.intro-bh\s*\{[^}]*intro-collapse/);
  });

  it("REQ-013 skips to the still state when reduced motion is set", () => {
    const reduced = css().slice(css().indexOf("prefers-reduced-motion"));

    expect(reduced).toContain(".intro-mark");
    expect(reduced).toMatch(/\.intro-bh\s*\{[^}]*display:\s*none/);
    render(<Storefront showIntro />);
    expect(screen.getByRole("img", { name: "CRUE mark" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
  });
});

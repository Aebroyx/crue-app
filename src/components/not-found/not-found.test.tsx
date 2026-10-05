import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { NotFound } from "@/components/not-found/not-found";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("REQ-014 not found", () => {
  it("REQ-014 renders the not-found screen for a missing route and a missing product", () => {
    const page = read("src/app/not-found.tsx");
    const { container } = render(<NotFound />);

    expect(page).toContain("NotFound");
    expect(read("src/app/products/[handle]/page.tsx")).toMatch(/notFound\(\)/);
    expect(screen.getByRole("heading", { name: "Lost past the event horizon" })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("h-dvh", "overflow-hidden");
  });

  it("REQ-014 shows the mark and not a spinning hole", () => {
    const { container } = render(<NotFound />);
    const white = container.querySelector('img[src="/brand/crue-mark-white.png"]');
    const black = container.querySelector('img[src="/brand/crue-mark-black.png"]');

    expect(white).toHaveClass("dark:block", "w-[min(72vw,28.75rem)]", "h-auto");
    expect(black).toHaveClass("dark:hidden", "w-[min(72vw,28.75rem)]", "h-auto");
    expect(white).toHaveAttribute("alt", "");
    expect(black).toHaveAttribute("alt", "");
    expect(container.innerHTML).not.toContain("intro-disk");
    expect(container.innerHTML).not.toContain("intro-bh");
    expect(container.innerHTML).not.toContain("intro-spin");
    expect(read("src/components/intro/intro.tsx")).toContain("intro-bh");
  });

  it("REQ-014 brings the mark in and skips that motion when reduced", () => {
    const { container } = render(<NotFound />);
    const sheet = read("src/app/globals.css");
    const reduced = sheet.slice(sheet.indexOf("prefers-reduced-motion"));

    expect(container.querySelectorAll(".not-found-mark")).toHaveLength(2);
    expect(sheet).toMatch(
      /\.not-found-mark\s*\{[^}]*animation:\s*intro-mark 1\.6s cubic-bezier\(0\.16, 1, 0\.3, 1\) both/,
    );
    expect(sheet).not.toMatch(/\.not-found-mark\s*\{[^}]*1\.6s\s+[\d.]+s/);
    expect(sheet).toMatch(/@keyframes intro-mark/);
    expect(reduced).toContain(".not-found-mark");
    expect(reduced).toMatch(/animation:\s*none/);
  });

  it("REQ-014 shows the 404 copy", () => {
    render(<NotFound />);

    expect(screen.getByText("Error 404")).toHaveClass("text-[11px]", "tracking-[0.2em]", "uppercase", "text-muted");
    expect(screen.getByRole("heading", { name: "Lost past the event horizon" })).toHaveClass(
      "text-[30px]",
      "md:text-[52px]",
      "uppercase",
    );
    expect(screen.getByText("This page was pulled in and never came back.")).toHaveClass("text-[15px]", "text-text-2");
  });

  it("REQ-014 links home and the catalog", () => {
    render(<NotFound />);
    const home = screen.getByRole("link", { name: "Back to home" });
    const shop = screen.getByRole("link", { name: "Shop all" });

    expect(home).toHaveAttribute("href", "/");
    expect(shop).toHaveAttribute("href", "/catalog");
    expect(home.compareDocumentPosition(shop) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(home.parentElement).toHaveClass("flex-col", "md:flex-row", "gap-2.5", "mt-2.5");
    expect(home).toHaveClass("w-full", "md:w-auto", "h-[52px]", "bg-text", "active:scale-[0.98]");
    expect(shop).toHaveClass("w-full", "md:w-auto", "h-[52px]", "border-control-border", "active:scale-[0.98]");
  });

  it("REQ-014 keeps the navbar and leaves the footer off", () => {
    render(<NotFound />);

    expect(screen.getByText("Drop 001: Event Horizon, out now")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
    expect(screen.getAllByRole("link", { name: "CRUE home" }).every((link) => link.getAttribute("href") === "/")).toBe(true);
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Enter the orbit" })).not.toBeInTheDocument();
  });
});

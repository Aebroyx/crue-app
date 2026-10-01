import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { Storefront } from "@/app/page";

const benzin = "font-[family-name:var(--font-benzin)]";
const plex = "font-[family-name:var(--font-plex)]";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("REQ-006 Benzin", () => {
  it("REQ-006 sets display and UI text in Benzin", () => {
    render(<Storefront showIntro={false} />);
    const home = screen.getByRole("heading", { name: /Event\s+Horizon/ }).closest("div.bg-bg");

    expect(home).toHaveClass(benzin);
    expect(home?.className).not.toMatch(/md:font-|max-md:font-/);
    expect(screen.getByRole("navigation", { name: "Main" })).not.toHaveClass(plex);
    expect(screen.getByRole("link", { name: /Shop Drop 001/ })).not.toHaveClass(plex);
    expect(screen.getByText(/Technical running wear/)).not.toHaveClass(plex);
    expect(screen.getByText("Horizon Shell Jacket")).not.toHaveClass(plex);
    expect(home?.className).not.toMatch(/font-stretch|font-archivo/);
    expect(read("src/components/home/home.tsx")).not.toMatch(/font-stretch|font-archivo/);
  });

  it("REQ-006 sets intro text in Benzin", () => {
    render(<Storefront showIntro />);
    const intro = document.querySelector("[data-intro]");

    expect(intro).toHaveClass(benzin);
    expect(screen.getByRole("button", { name: "Enter" })).not.toHaveClass(plex);
    expect(read("src/components/intro/intro.tsx")).not.toMatch(/font-stretch|font-archivo|stretch-\[125%\]/);
  });

  it("REQ-006 keeps IBM Plex Mono for labels, prices, and the announcement", () => {
    render(<Storefront showIntro={false} />);

    expect(screen.getByText("Drop 001, out now").parentElement).toHaveClass(plex);
    expect(screen.getAllByText("[PRICE]")[0]).toHaveClass(plex);
    expect(screen.getByText("© CRUE [YEAR]")).toHaveClass(plex);
  });

  it("REQ-006 does not load Archivo or Google Fonts for Benzin", () => {
    const layout = read("src/app/layout.tsx");
    const fonts = read("src/lib/fonts.ts");

    expect(layout).not.toMatch(/Archivo|next\/font\/google/);
    expect(fonts).toMatch(/next\/font\/local/);
    expect(fonts).not.toMatch(/Archivo/);
    expect(fonts).toMatch(/display:\s*"swap"/);
    expect(fonts).toMatch(/fallback:\s*\["sans-serif"\]/);
    for (const file of [
      "Benzin-Regular.ttf",
      "Benzin-Medium.ttf",
      "Benzin-Semibold.ttf",
      "Benzin-Bold.ttf",
      "Benzin-ExtraBold.ttf",
    ]) {
      expect(fonts).toContain(`assets/fonts/${file}`);
      expect(fs.existsSync(path.join(process.cwd(), "assets/fonts", file))).toBe(true);
    }
    expect(fonts).toMatch(/Benzin-Regular\.ttf", weight: "400"/);
    expect(fonts).toMatch(/Benzin-Medium\.ttf", weight: "500"/);
    expect(fonts).toMatch(/Benzin-Semibold\.ttf", weight: "600"/);
    expect(fonts).toMatch(/Benzin-Bold\.ttf", weight: "700"/);
    expect(fonts).toMatch(/Benzin-ExtraBold\.ttf", weight: "800"/);
    expect(fs.readdirSync(path.join(process.cwd(), "public")).join("\n")).not.toMatch(/Benzin/);
  });

  it("REQ-006 names Benzin in the design docs", () => {
    for (const file of ["docs/design-language.md", "docs/design/DESIGN.md"]) {
      const doc = read(file);
      expect(doc).toMatch(/Benzin/);
      expect(doc).not.toMatch(/Archivo/);
      expect(doc).toMatch(/Benzin-ExtraBold\.ttf/);
      expect(doc).toMatch(/font-stretch` is not used/);
    }
  });
});

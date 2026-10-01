import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { Storefront } from "@/app/page";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith(".tsx") || entry.name.endsWith(".ts") ? [full] : [];
  });
}

describe("REQ-007 navbar and footer", () => {
  it("REQ-007 renders the navbar on a phone and on a desktop", () => {
    render(<Storefront showIntro={false} />);

    const desktop = screen.getByRole("navigation", { name: "Main" }).closest("header");
    const phone = screen.getByRole("button", { name: "Menu" }).closest("header");

    expect(desktop).toHaveClass("hidden", "md:grid");
    expect(phone).toHaveClass("md:hidden");
    expect(phone).not.toHaveClass("hidden");
    expect(screen.getByText("Drop 001, out now")).toBeInTheDocument();
    expect(screen.getByText("Drop 001: Event Horizon, out now")).toBeInTheDocument();
    expect(read("src/components/navbar/navbar.tsx")).toMatch(/<header/);
    expect(read("src/components/home/home.tsx")).toMatch(/<Navbar/);
  });

  it("REQ-007 renders the footer from its own component", () => {
    render(<Storefront showIntro={false} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("© CRUE [YEAR]");
    expect(footer.querySelector("button")).toHaveAccessibleName("Dark");
    expect(read("src/components/footer/footer.tsx")).toMatch(/<footer/);
    expect(read("src/components/home/home.tsx")).toMatch(/<Footer/);
  });

  it("REQ-007 keeps chrome out of the home screen", () => {
    const home = read("src/components/home/home.tsx");

    expect(home).not.toMatch(/<header|<footer/);
    expect(home).not.toMatch(/Drop 001, out now/);
    expect(home).not.toMatch(/© CRUE \[YEAR\]/);
  });

  it("REQ-007 uses Lucide for every icon", () => {
    const navbar = read("src/components/navbar/navbar.tsx");
    const home = read("src/components/home/home.tsx");
    const intro = read("src/components/intro/intro.tsx");
    const sources = sourceFiles(path.join(process.cwd(), "src"))
      .map((file) => fs.readFileSync(file, "utf8"))
      .join("\n");

    expect(navbar).toMatch(/Search/);
    expect(navbar).toMatch(/User/);
    expect(navbar).toMatch(/ShoppingBag/);
    expect(navbar).toMatch(/Menu/);
    expect(home).toMatch(/ArrowRight/);
    expect(intro).toMatch(/ArrowRight/);
    expect(`${navbar}\n${home}\n${intro}`).toMatch(/from "lucide-react"/);
    expect(`${navbar}\n${home}\n${intro}`).toMatch(/strokeWidth=\{1\.5\}/);
    expect(sources).not.toMatch(/<svg[\s>]/);
    expect(read("package.json")).toMatch(/"lucide-react"/);
  });

  it("REQ-007 records the shared chrome folders", () => {
    const architecture = read("docs/architecture.md");

    expect(architecture).toMatch(/src\/components\/navbar\//);
    expect(architecture).toMatch(/src\/components\/footer\//);
  });
});

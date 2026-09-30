import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { Storefront } from "./page";
import RootLayout, { metadata } from "./layout";

jest.mock("next/font/google", () => ({
  Geist: () => ({ className: "font-geist" }),
  Archivo: () => ({ variable: "font-archivo" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex" }),
}));

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

function versionOf(spec: string) {
  const match = spec.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`Unreadable version: ${spec}`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

describe("REQ-001 storefront shell", () => {
  it("REQ-001 renders the white black-hole symbol on the only route", () => {
    render(<Storefront showIntro={false} />);
    const symbol = screen.getByRole("img", { name: "Crue" });
    expect(symbol.getAttribute("src")).toContain("cruebh-white.svg");

    const pages = fs
      .readdirSync(path.join(process.cwd(), "app"), { recursive: true })
      .filter((entry) => String(entry).endsWith("page.tsx"));
    expect(pages).toEqual(["page.tsx"]);
  });

  it("REQ-001 names the document and the image Crue in English", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <Storefront showIntro={false} />
      </RootLayout>,
    );

    expect(metadata.title).toBe("Crue");
    expect(html).toContain('lang="en"');
    render(<Storefront showIntro={false} />);
    expect(screen.getByRole("img", { name: "Crue" })).toBeInTheDocument();
  });

  it("REQ-001 does not render the other brand files, a video, a link, or a button", () => {
    const { container } = render(<Storefront showIntro={false} />);
    const html = container.innerHTML;

    expect(html).not.toContain("crue-black.svg");
    expect(html).not.toContain("crue-white.svg");
    expect(html).not.toContain("cruebh-black.svg");
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("nav")).toBeNull();
    expect(container.querySelector("footer")).toBeNull();
  });

  it("REQ-001 depends on the latest stable Next.js 16.3 and Tailwind CSS 4.3", () => {
    const next = versionOf(packageJson.dependencies.next);
    const tailwind = versionOf(packageJson.devDependencies.tailwindcss);

    expect(next.major).toBe(16);
    expect(next.minor).toBe(3);
    expect(next.patch).toBeGreaterThanOrEqual(6);
    expect(tailwind.major).toBe(4);
    expect(tailwind.minor).toBe(3);
    expect(tailwind.patch).toBeGreaterThanOrEqual(3);
  });

  it("REQ-001 does not import a CSS module for the page", () => {
    const page = fs.readFileSync(
      path.join(process.cwd(), "app/page.tsx"),
      "utf8",
    );
    const layout = fs.readFileSync(
      path.join(process.cwd(), "app/layout.tsx"),
      "utf8",
    );

    expect(page).not.toMatch(/\.module\.css/);
    expect(layout).not.toMatch(/\.module\.css/);
    expect(page).toContain("bg-black");
    expect(fs.existsSync(path.join(process.cwd(), "app/globals.css"))).toBe(
      true,
    );
  });
});

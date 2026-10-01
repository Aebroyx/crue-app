import fs from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { About } from "@/components/about/about";
import { Storefront } from "@/app/page";
import { Catalog } from "@/components/catalog/catalog";

const paragraph =
  "CRUE is built for the hybrid athlete: the one who runs at first light and lifts after dark. We make technical running wear for both worlds, cut for the long run and the heavy set. Like the black hole in our mark, it pulls you in. Once you are in, there is no going back.";

describe("REQ-012 about", () => {
  it("REQ-012 replaces Journal with About", () => {
    render(<Storefront showIntro={false} />);
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(within(nav).queryByRole("link", { name: "Journal" })).toBeNull();
    expect(within(nav).getByRole("link", { name: "Run" })).toHaveAttribute("href", "#drop");
  });

  it("REQ-012 underlines About only on its page", () => {
    const home = render(<Storefront showIntro={false} />);
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
    home.unmount();

    const catalog = render(<Catalog />);
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
    catalog.unmount();

    render(<About />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  });

  it("REQ-012 centres the mark and the paragraph", () => {
    const { container } = render(<About />);

    expect(screen.getAllByRole("img", { name: "About CRUE" })[0]).toHaveClass("w-[72px]", "md:w-[84px]");
    const body = screen.getByText(paragraph);
    expect(body).toHaveClass("max-w-[500px]", "md:leading-[1.75]");
    expect(body.parentElement).toHaveClass("text-center");
    expect(container.firstElementChild).toHaveClass("h-dvh", "overflow-hidden");
  });

  it("REQ-012 keeps four corner panels and skips motion when reduced", () => {
    const { container } = render(<About />);
    const panels = container.querySelectorAll(".about-panel");
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(panels).toHaveLength(4);
    expect(container.querySelectorAll(".about-panel img").length).toBeGreaterThanOrEqual(4);
    expect(panels[0].className).toContain("-rotate-12");
    expect(panels[1].className).toContain("rotate-[8deg]");
    expect(panels[2].className).toContain("rotate-[10deg]");
    expect(panels[3].className).toContain("-rotate-8");
    expect(css).toMatch(/prefers-reduced-motion[\s\S]*\.about-panel[\s\S]*animation:\s*none/);
  });

  it("REQ-012 leaves the footer and the newsletter off the page", () => {
    render(<About />);

    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Enter the orbit" })).not.toBeInTheDocument();
  });
});

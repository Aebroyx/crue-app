import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { Storefront } from "@/app/page";

jest.mock("next/font/google", () => ({
  Geist: () => ({ className: "font-geist" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex" }),
}));

describe("REQ-004 home", () => {
  it("REQ-004 shows the home after the intro is dismissed", () => {
    render(<Storefront showIntro={false} />);

    expect(screen.getByRole("heading", { name: /Event\s+Horizon/ })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "CRUE mark" })).not.toBeInTheDocument();
    expect(document.querySelector("[data-intro]")).toBeNull();
  });

  it("REQ-004 renders the hero, the drop, the manifesto, and the bento", () => {
    render(<Storefront showIntro={false} />);

    expect(screen.getByRole("link", { name: /Shop Drop 001/ })).toHaveAttribute("href", "#drop");
    expect(screen.getByRole("heading", { name: "The Drop" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gravity is your training partner." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read the story" })).toHaveAttribute("href", "#manifesto");
    expect(screen.getAllByRole("link", { name: /^Run$/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /^Train$/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /^Layers$/ }).length).toBeGreaterThan(0);
  });

  it("REQ-004 keeps the draft products and the placeholder tokens", () => {
    render(<Storefront showIntro={false} />);

    for (const name of [
      "Horizon Shell Jacket",
      "Singularity Run Tee",
      "Orbit Half Tight",
      "Accretion Split Short",
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getAllByText("[PRICE]")).toHaveLength(4);
    expect(screen.getByText("Free shipping over [THRESHOLD]")).toHaveClass("hidden", "md:inline");
    expect(screen.getByText("© CRUE [YEAR]")).toBeInTheDocument();
  });

  it("REQ-004 uses the desktop and mobile announcement copy", () => {
    render(<Storefront showIntro={false} />);

    expect(screen.getByText("Drop 001, out now")).toHaveClass("md:hidden");
    expect(screen.getByText("Drop 001: Event Horizon, out now")).toHaveClass("hidden", "md:inline");
  });

  it("REQ-004 does not add a route or a video", () => {
    const { container } = render(<Storefront showIntro={false} />);
    const pages = fs
      .readdirSync(path.join(process.cwd(), "src/app"), { recursive: true })
      .filter((entry) => String(entry).endsWith("page.tsx"));

    expect(pages).toEqual(["page.tsx"]);
    expect(container.querySelector("video")).toBeNull();
  });

  it("REQ-004 does not render the newsletter, a cart, or a product page", () => {
    render(<Storefront showIntro={false} />);

    expect(screen.queryByText("Enter the orbit")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sound/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Search" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "BAG (0)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bag, 0 items" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });
});

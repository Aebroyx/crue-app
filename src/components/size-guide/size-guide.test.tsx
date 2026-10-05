import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { About } from "@/components/about/about";
import { Catalog } from "@/components/catalog/catalog";
import { Home } from "@/components/home/home";
import { NotFound } from "@/components/not-found/not-found";
import { Product } from "@/components/product/product";
import { productByHandle } from "@/lib/catalog";

const product = productByHandle("horizon-shell-jacket")!;
const chest = "Measure around the fullest part of your chest, keeping the tape level under your arms.";
const hip = "Stand with feet together and measure around the fullest part of your hips.";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function productGuide() {
  return within(screen.getByRole("group", { name: "Size" })).getByRole("button", { name: "Size guide" });
}

function footerGuide() {
  return within(screen.getByRole("contentinfo")).getByRole("link", { name: "Size guide" });
}

describe("REQ-015 size guide", () => {
  it("REQ-015 opens the size guide from the product page", () => {
    render(<Product product={product} />);
    const guide = productGuide();

    expect(guide).not.toHaveAttribute("href", "#guide");
    fireEvent.click(guide);

    expect(screen.getByRole("dialog", { name: "Size guide" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Horizon Shell Jacket" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Void Black" })).toHaveAttribute("aria-pressed", "true");
  });

  it("REQ-015 opens the size guide from the footer", () => {
    const home = render(<Home />);
    fireEvent.click(footerGuide());
    expect(screen.getByRole("dialog", { name: "Size guide" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Event Horizon" })).toBeInTheDocument();
    home.unmount();

    const catalog = render(<Catalog />);
    fireEvent.click(footerGuide());
    expect(screen.getByRole("dialog", { name: "Size guide" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shop all" })).toBeInTheDocument();
    catalog.unmount();

    const page = render(<Product product={product} />);
    const guide = footerGuide();
    expect(guide).not.toHaveAttribute("href", "#drop");
    fireEvent.click(guide);
    expect(screen.getByRole("dialog", { name: "Size guide" })).toBeInTheDocument();
    page.unmount();

    const about = render(<About />);
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    about.unmount();

    render(<NotFound />);
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
  });

  it("REQ-015 starts on Tops in centimetres", () => {
    render(<Product product={product} />);
    fireEvent.click(productGuide());
    const dialog = screen.getByRole("dialog", { name: "Size guide" });

    expect(within(dialog).getByRole("tab", { name: "Tops" })).toHaveAttribute("aria-selected", "true");
    expect(within(dialog).getByRole("button", { name: "cm" })).toHaveAttribute("aria-pressed", "true");
    expect(within(dialog).getAllByRole("rowheader").map((cell) => cell.textContent)).toEqual([
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ]);
    expect(within(dialog).getAllByText("[cm]")).toHaveLength(18);
    expect(within(dialog).getByText(chest)).toBeInTheDocument();
    expect(within(dialog).getByText("[Fit note: for example, true to size; size up for a relaxed fit.]")).toBeInTheDocument();
  });

  it("REQ-015 switches category and units", () => {
    render(<Product product={product} />);
    fireEvent.click(productGuide());
    const dialog = screen.getByRole("dialog", { name: "Size guide" });

    fireEvent.click(within(dialog).getByRole("tab", { name: "Bottoms" }));

    expect(within(dialog).getByRole("columnheader", { name: "Hip" })).toBeInTheDocument();
    expect(within(dialog).getByRole("columnheader", { name: "Inseam" })).toBeInTheDocument();
    expect(within(dialog).queryByRole("columnheader", { name: "Chest" })).not.toBeInTheDocument();
    expect(within(dialog).getByText(hip)).toBeInTheDocument();
    expect(within(dialog).queryByText(chest)).not.toBeInTheDocument();
    expect(within(dialog).getAllByText("[cm]")).toHaveLength(18);

    fireEvent.click(within(dialog).getByRole("button", { name: "in" }));

    expect(within(dialog).getAllByText("[in]")).toHaveLength(18);
    expect(within(dialog).queryByText("[cm]")).not.toBeInTheDocument();
    expect(within(dialog).getAllByRole("rowheader").map((cell) => cell.textContent)).toEqual([
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ]);
  });

  it("REQ-015 closes on the control, Escape, and the scrim", () => {
    render(<Product product={product} />);

    fireEvent.click(productGuide());
    fireEvent.click(screen.getByRole("button", { name: "Close size guide" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Horizon Shell Jacket" })).toBeInTheDocument();

    fireEvent.click(productGuide());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Horizon Shell Jacket" })).toBeInTheDocument();

    fireEvent.click(productGuide());
    fireEvent.click(document.querySelector("[data-scrim]")!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Horizon Shell Jacket" })).toBeInTheDocument();
  });

  it("REQ-015 uses the desktop dialog and the phone sheet", () => {
    render(<Product product={product} />);
    fireEvent.click(productGuide());
    const dialog = screen.getByRole("dialog", { name: "Size guide" });
    const sheet = read("src/app/globals.css");
    const reduced = sheet.slice(sheet.indexOf("prefers-reduced-motion"));

    expect(dialog).toHaveClass("h-[780px]", "max-h-full", "w-full", "md:h-[760px]", "md:w-[760px]", "size-guide-panel");
    expect(within(dialog).getByRole("heading", { name: "How to measure" }).nextElementSibling).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-3",
    );
    expect(sheet).toMatch(/\.size-guide-panel\s*\{[^}]*size-guide-in 0\.45s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(reduced).toContain(".size-guide-panel");
    expect(reduced).toMatch(/animation:\s*none/);
  });
});

import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { About } from "@/components/about/about";
import { catalogLink, forgetBagMemory } from "@/components/bag/bag";
import { Catalog } from "@/components/catalog/catalog";
import { NotFound } from "@/components/not-found/not-found";
import { Product } from "@/components/product/product";
import { productByHandle } from "@/lib/catalog";

function product() {
  return render(<Product product={productByHandle("horizon-shell-jacket")!} />);
}

function addDefault() {
  fireEvent.click(screen.getAllByRole("button", { name: "Add to bag, M" })[0]);
}

describe("REQ-016 bag", () => {
  it("REQ-016 adds a line and keeps it on the home page", () => {
    const view = product();

    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute("aria-pressed", "true");
    addDefault();

    expect(screen.getByRole("dialog", { name: "Bag" })).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent("Horizon Shell Jacket");
    expect(screen.getByRole("listitem")).toHaveTextContent("Void Black / M");
    expect(screen.getByRole("button", { name: "BAG (1)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Void Black" })).toHaveAttribute("aria-pressed", "true");

    view.unmount();
    const home = render(<Storefront showIntro={false} />);
    expect(screen.getByRole("button", { name: "BAG (1)" })).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent("Void Black / M");

    home.unmount();
    forgetBagMemory();
    const refreshed = render(<Storefront showIntro={false} />);
    expect(screen.getByRole("button", { name: "BAG (1)" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "BAG (1)" }));
    expect(screen.getByRole("listitem")).toHaveTextContent("Horizon Shell Jacket");

    refreshed.unmount();
    const catalog = render(<Catalog />);
    fireEvent.click(screen.getByRole("button", { name: "BAG (1)" }));
    expect(screen.getByRole("listitem")).toHaveTextContent("Void Black / M");

    catalog.unmount();
    const about = render(<About />);
    fireEvent.click(screen.getByRole("button", { name: "BAG (1)" }));
    expect(screen.getByRole("listitem")).toHaveTextContent("Void Black / M");

    about.unmount();
    render(<NotFound />);
    fireEvent.click(screen.getByRole("button", { name: "BAG (1)" }));
    expect(screen.getByRole("listitem")).toHaveTextContent("Void Black / M");
  });

  it("REQ-016 merges the same variant and splits a different size", () => {
    product();
    addDefault();
    fireEvent.click(screen.getAllByRole("button", { name: "Added: M, Void Black" })[0]);

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(within(screen.getByRole("listitem")).getByText("2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "L" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Added: L, Void Black" })[0]);

    const lines = screen.getAllByRole("listitem");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveTextContent("Void Black / M");
    expect(lines[1]).toHaveTextContent("Void Black / L");
    expect(within(lines[0]).getByText("2")).toBeInTheDocument();
    expect(within(lines[1]).getByText("1")).toBeInTheDocument();
  });

  it("REQ-016 changes quantity and removes a line", () => {
    product();
    addDefault();
    const line = screen.getByRole("listitem");

    fireEvent.click(within(line).getByRole("button", { name: "Increase quantity" }));
    expect(within(line).getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BAG (2)" })).toBeInTheDocument();

    fireEvent.click(within(line).getByRole("button", { name: "Decrease quantity" }));
    expect(within(line).getByText("1")).toBeInTheDocument();

    fireEvent.click(within(line).getByRole("button", { name: "Decrease quantity" }));
    expect(within(line).getByText("1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BAG (1)" })).toBeInTheDocument();

    fireEvent.click(within(line).getByRole("button", { name: "Remove" }));
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByText("Your bag is empty")).toBeInTheDocument();
  });

  it("REQ-016 counts the bag and keeps the price placeholders", () => {
    product();
    addDefault();
    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));

    const dialog = within(screen.getByRole("dialog", { name: "Bag" }));
    expect(screen.getByRole("heading", { name: "Bag (2)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BAG (2)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bag, 2 items" })).toBeInTheDocument();
    expect(dialog.getByText("[PRICE]")).toHaveClass("font-[family-name:var(--font-plex)]");
    expect(dialog.getByText("[SUBTOTAL]")).toHaveClass("font-[family-name:var(--font-plex)]");
    expect(dialog.getByText("Free shipping over [THRESHOLD]")).toBeInTheDocument();
  });

  it("REQ-016 shows the empty state and Checkout only with a line", () => {
    const home = render(<Storefront showIntro={false} />);
    fireEvent.click(screen.getByRole("button", { name: "BAG (0)" }));

    const dialog = screen.getByRole("dialog", { name: "Bag" });
    expect(screen.getByRole("heading", { name: "Bag (0)" })).toBeInTheDocument();
    expect(screen.getByText("Your bag is empty")).toBeInTheDocument();
    expect(screen.getByText("Nothing pulled in yet.")).toBeInTheDocument();
    expect(within(dialog).getByText("Free shipping over [THRESHOLD]")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop all" })).toHaveAttribute("href", "/catalog");
    expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
    expect(screen.queryByText("[SUBTOTAL]")).not.toBeInTheDocument();
    expect(dialog).toHaveClass("w-full", "h-full", "md:w-[460px]", "md:border-l", "bag-panel");

    const go = jest.spyOn(catalogLink, "go").mockImplementation(() => undefined);
    fireEvent.click(screen.getByRole("link", { name: "Shop all" }));
    expect(go).toHaveBeenCalledWith("/catalog");
    expect(screen.queryByRole("dialog", { name: "Bag" })).not.toBeInTheDocument();
    go.mockRestore();

    home.unmount();
    product();
    addDefault();
    expect(screen.getByRole("button", { name: "Checkout" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Shop all" })).not.toBeInTheDocument();
  });

  it("REQ-016 does not navigate on Checkout and closes the bag", () => {
    product();
    addDefault();
    const address = window.location.href;

    fireEvent.click(screen.getByRole("button", { name: "Checkout" }));
    expect(window.location.href).toBe(address);
    expect(screen.getByRole("dialog", { name: "Bag" })).toBeInTheDocument();

    const dialog = screen.getByRole("dialog", { name: "Bag" });
    const checkout = screen.getByRole("button", { name: "Checkout" });
    checkout.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close bag" }));
    expect(dialog.contains(document.activeElement)).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Close bag" }));
    expect(screen.queryByRole("dialog", { name: "Bag" })).not.toBeInTheDocument();
    expect(window.location.href).toBe(address);

    fireEvent.click(screen.getByRole("button", { name: "BAG (1)" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Bag" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "BAG (1)" }));
    fireEvent.click(document.querySelector("[data-scrim]")!);
    expect(screen.queryByRole("dialog", { name: "Bag" })).not.toBeInTheDocument();

    const sheet = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const reduced = sheet.slice(sheet.indexOf("prefers-reduced-motion"));
    expect(sheet).toMatch(/\.bag-panel\s*\{[^}]*bag-in 0\.45s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(sheet).toMatch(/\.bag-scrim-out\s*\{[^}]*bag-scrim-out 0\.35s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(sheet).toMatch(/\.bag-panel-out\s*\{[^}]*bag-out 0\.35s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(reduced).toContain(".bag-panel");
    expect(reduced).toContain(".bag-panel-out");
    expect(reduced).toContain(".bag-scrim");
    expect(reduced).toContain(".bag-scrim-out");
  });
});

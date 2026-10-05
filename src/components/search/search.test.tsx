import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { About } from "@/components/about/about";
import { Catalog } from "@/components/catalog/catalog";
import { NotFound } from "@/components/not-found/not-found";
import { Product } from "@/components/product/product";
import { searchLink } from "@/components/search/search";
import { productByHandle } from "@/lib/catalog";

function openSearch() {
  fireEvent.click(screen.getAllByRole("button", { name: "Search" })[0]);
}

describe("REQ-018 search", () => {
  it("REQ-018 opens search on Popular searches", () => {
    const home = render(<Storefront showIntro={false} />);
    openSearch();
    expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("Popular searches")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shell jacket" })).toBeInTheDocument();
    expect(screen.queryByText(/result/)).not.toBeInTheDocument();
    expect(window.location.pathname).not.toBe("/search");

    home.unmount();
    const catalog = render(<Catalog />);
    openSearch();
    expect(screen.getByText("Popular searches")).toBeInTheDocument();

    catalog.unmount();
    const product = render(<Product product={productByHandle("horizon-shell-jacket")!} />);
    openSearch();
    expect(screen.getByText("Popular searches")).toBeInTheDocument();

    product.unmount();
    const about = render(<About />);
    openSearch();
    expect(screen.getByText("Popular searches")).toBeInTheDocument();

    about.unmount();
    render(<NotFound />);
    openSearch();
    expect(screen.getByText("Popular searches")).toBeInTheDocument();
  });

  it("REQ-018 searches the local catalog from a chip and from typing", () => {
    render(<Storefront showIntro={false} />);
    openSearch();

    const dialog = () => within(screen.getByRole("dialog", { name: "Search" }));

    fireEvent.click(screen.getByRole("button", { name: "Run tee" }));
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("Run tee");
    expect(dialog().getByRole("link", { name: /Singularity Run Tee/ })).toHaveAttribute(
      "href",
      "/products/singularity-run-tee",
    );
    expect(dialog().queryByRole("link", { name: /Horizon Shell Jacket/ })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "LAYERS" } });
    expect(dialog().getByRole("link", { name: /Horizon Shell Jacket/ })).toBeInTheDocument();
    expect(dialog().queryByRole("link", { name: /Singularity Run Tee/ })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "   " } });
    expect(screen.getByText("Popular searches")).toBeInTheDocument();
  });

  it("REQ-018 counts results and keeps the price placeholder", () => {
    render(<Storefront showIntro={false} />);
    openSearch();
    const dialog = screen.getByRole("dialog", { name: "Search" });

    expect(screen.queryByText("1 result")).not.toBeInTheDocument();
    expect(screen.queryByText(/results/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "run" } });
    expect(screen.getByText("2 results")).toBeInTheDocument();
    expect(screen.getAllByText("[PRICE]").length).toBeGreaterThan(0);
    expect(dialog).toHaveClass("h-full", "w-full", "md:h-[620px]", "border-b", "search-panel");

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "Run tee" } });
    expect(screen.getByText("1 result")).toBeInTheDocument();
  });

  it("REQ-018 shows the no-match state", () => {
    render(<Storefront showIntro={false} />);
    openSearch();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "nope" } });

    expect(screen.getByText("No results for “nope”")).toBeInTheDocument();
    expect(screen.getByText("Check the spelling or try one of these.")).toBeInTheDocument();
    const dialog = within(screen.getByRole("dialog", { name: "Search" }));
    expect(dialog.getByRole("button", { name: "Short" })).toBeInTheDocument();
    expect(dialog.queryByRole("link", { name: /Horizon Shell Jacket/ })).not.toBeInTheDocument();
    expect(dialog.queryByRole("link", { name: "View all in shop" })).not.toBeInTheDocument();
  });

  it("REQ-018 links View all in shop to the catalog", () => {
    render(<Storefront showIntro={false} />);
    openSearch();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "run" } });

    const shop = screen.getByRole("link", { name: "View all in shop" });
    expect(shop).toHaveAttribute("href", "/catalog");

    const go = jest.spyOn(searchLink, "go").mockImplementation(() => undefined);
    fireEvent.click(shop);
    expect(go).toHaveBeenCalledWith("/catalog");
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();
    go.mockRestore();
  });

  it("REQ-018 does not navigate on open and closes the overlay", () => {
    render(<Storefront showIntro={false} />);
    const address = window.location.href;

    openSearch();
    expect(window.location.href).toBe(address);
    expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close search" }));
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();
    expect(window.location.href).toBe(address);

    openSearch();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();

    openSearch();
    fireEvent.click(document.querySelector("[data-scrim]")!);
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();

    const sheet = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const reduced = sheet.slice(sheet.indexOf("prefers-reduced-motion"));
    expect(sheet).toMatch(/\.search-panel\s*\{[^}]*search-in 0\.45s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(sheet).toMatch(/\.search-panel-out\s*\{[^}]*search-out 0\.35s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(reduced).toContain(".search-panel");
    expect(reduced).toContain(".search-scrim");
  });
});

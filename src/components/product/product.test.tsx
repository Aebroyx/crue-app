import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { Product } from "@/components/product/product";
import { catalogProducts, productByHandle } from "@/lib/catalog";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("REQ-008 product page", () => {
  it("REQ-008 reads each home product from the catalog file", () => {
    render(<Storefront showIntro={false} />);

    for (const product of catalogProducts().filter((item) =>
      [
        "Horizon Shell Jacket",
        "Singularity Run Tee",
        "Orbit Half Tight",
        "Accretion Split Short",
      ].includes(item.title),
    )) {
      expect(screen.getByRole("link", { name: product.title })).toHaveAttribute(
        "href",
        `/products/${product.handle}`,
      );
      expect(productByHandle(product.handle)?.title).toBe(product.title);
    }
    expect(productByHandle("missing")).toBeUndefined();
    expect(read("src/app/products/[handle]/page.tsx")).toMatch(/productByHandle/);
    expect(read("src/app/products/[handle]/page.tsx")).toMatch(/notFound/);
  });

  it("REQ-008 starts Horizon Shell Jacket on size M and Void Black", () => {
    render(<Product product={productByHandle("horizon-shell-jacket")!} />);

    expect(screen.getByRole("heading", { name: "Horizon Shell Jacket" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Void Black" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "M" }).parentElement).toHaveClass("grid-cols-3", "md:grid-cols-6");
    expect(screen.getAllByRole("button", { name: "Add to bag, M" })).toHaveLength(2);
  });

  it("REQ-008 changes the pressed size and the add label", () => {
    render(<Product product={productByHandle("horizon-shell-jacket")!} />);

    fireEvent.click(screen.getByRole("button", { name: "L" }));

    expect(screen.getByRole("button", { name: "L" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByRole("button", { name: "Add to bag, L" })).toHaveLength(2);
  });

  it("REQ-008 confirms the size and colour and counts the bag on this page", () => {
    const { unmount } = render(<Product product={productByHandle("horizon-shell-jacket")!} />);

    fireEvent.click(screen.getByRole("button", { name: "L" }));
    fireEvent.click(screen.getByRole("button", { name: "Photon White" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Add to bag, L" })[0]);

    expect(screen.getAllByRole("button", { name: "Added: L, Photon White" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "BAG (1)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bag, 1 items" })).toBeInTheDocument();

    unmount();
    render(<Storefront showIntro={false} />);
    expect(screen.getByRole("button", { name: "BAG (0)" })).toBeInTheDocument();
  });

  it("REQ-008 keeps the catalog in Storefront shape and does not call Shopify", () => {
    const horizon = productByHandle("horizon-shell-jacket")!;
    const tee = productByHandle("singularity-run-tee")!;
    const file = read("src/data/catalog.json");
    const sources = ["src/lib/catalog.ts", "src/app/products/[handle]/page.tsx", "src/components/product/product.tsx"]
      .map(read)
      .join("\n");

    expect(catalogProducts()).toHaveLength(6);
    expect(horizon.options).toEqual(tee.options);
    expect(horizon.variants.map((variant) => variant.selectedOptions)).toEqual(
      tee.variants.map((variant) => variant.selectedOptions),
    );
    expect(horizon.variants.every((variant) => variant.availableForSale && variant.price.amount === "[PRICE]")).toBe(
      true,
    );
    expect(file).not.toMatch(/currency/);
    expect(sources).not.toMatch(/shopify|Storefront API/i);
  });
});

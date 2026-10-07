import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { Product } from "@/components/product/product";
import { productByHandle, type CatalogProduct } from "@/lib/catalog";

function soldOutProduct(unavailable: { colour: string; size: string }[]) {
  const product = JSON.parse(JSON.stringify(productByHandle("horizon-shell-jacket"))) as CatalogProduct;
  for (const variant of product.variants) {
    const colour = variant.selectedOptions.find((option) => option.name === "Colour")?.value;
    const size = variant.selectedOptions.find((option) => option.name === "Size")?.value;
    if (unavailable.some((pair) => pair.colour === colour && pair.size === size)) {
      variant.availableForSale = false;
    }
  }
  return product;
}

function renderSoldOut() {
  return render(
    <Product
      product={soldOutProduct([
        { colour: "Void Black", size: "XL" },
        { colour: "Void Black", size: "S" },
      ])}
    />,
  );
}

describe("REQ-022 sold-out size", () => {
  it("REQ-022 shows a sold-out size as struck through and selectable", () => {
    renderSoldOut();

    const xl = screen.getByRole("button", { name: "XL" });
    expect(xl).toHaveClass("line-through", "text-dim");
    expect(xl).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "M" })).not.toHaveClass("line-through");
    expect(screen.getByRole("button", { name: "M" })).not.toHaveClass("text-dim");

    fireEvent.click(xl);

    expect(screen.getByRole("button", { name: "XL" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "XL" })).toHaveClass("line-through", "text-dim");
    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute("aria-pressed", "false");
  });

  it("REQ-022 swaps Add to bag for the notify label", () => {
    renderSoldOut();

    fireEvent.click(screen.getByRole("button", { name: "XL" }));

    const notify = screen.getAllByRole("button", { name: "Notify me when XL is back" });
    expect(notify).toHaveLength(2);
    for (const button of notify) {
      expect(button).toHaveClass("border", "bg-transparent", "text-text");
      expect(button).not.toHaveClass("bg-text");
    }
    expect(screen.queryByRole("button", { name: "Add to bag, XL" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BAG (0)" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "S" }));
    expect(screen.getAllByRole("button", { name: "Notify me when S is back" })).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Notify me when XL is back" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "XL" }));
    fireEvent.click(screen.getByRole("button", { name: "Photon White" }));

    expect(screen.queryByRole("button", { name: "Notify me when XL is back" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Add to bag, XL" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "XL" })).not.toHaveClass("line-through");
    expect(screen.getByRole("button", { name: "XL" })).not.toHaveClass("text-dim");
    expect(screen.getByRole("button", { name: "BAG (0)" })).toBeInTheDocument();
  });

  it("REQ-022 confirms without emailing or adding a line", () => {
    renderSoldOut();
    const address = window.location.href;
    const productSource = fs.readFileSync(
      path.join(process.cwd(), "src/components/product/product.tsx"),
      "utf8",
    );

    fireEvent.click(screen.getByRole("button", { name: "XL" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Notify me when XL is back" })[0]);

    const confirmed = screen.getAllByRole("button", { name: "We will email you when XL is back" });
    expect(confirmed).toHaveLength(2);
    for (const button of confirmed) {
      expect(button).toHaveClass("border", "bg-transparent", "text-text");
      expect(button).not.toHaveClass("bg-text");
    }
    expect(screen.queryByRole("button", { name: "Notify me when XL is back" })).not.toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BAG (0)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bag, 0 items" })).toBeInTheDocument();
    expect(window.location.href).toBe(address);
    expect(productSource).not.toMatch(/fetch\(|mailto:|XMLHttpRequest|shopify/i);

    fireEvent.click(screen.getAllByRole("button", { name: "We will email you when XL is back" })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: "We will email you when XL is back" })[1]);

    expect(screen.getAllByRole("button", { name: "We will email you when XL is back" })).toHaveLength(2);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BAG (0)" })).toBeInTheDocument();
    expect(window.location.href).toBe(address);
  });

  it("REQ-022 returns to Add to bag for an available size", () => {
    renderSoldOut();

    fireEvent.click(screen.getByRole("button", { name: "XL" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Notify me when XL is back" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "M" }));

    const add = screen.getAllByRole("button", { name: "Add to bag, M" });
    expect(add).toHaveLength(2);
    expect(add[0]).toHaveClass("bg-text");
    expect(screen.queryByRole("button", { name: "Notify me when XL is back" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "We will email you when XL is back" })).not.toBeInTheDocument();

    fireEvent.click(add[0]);

    expect(screen.getAllByRole("button", { name: "Added: M, Void Black" })).toHaveLength(2);
    expect(screen.getByRole("listitem")).toHaveTextContent("Void Black / M");
    expect(screen.getByRole("button", { name: "BAG (1)" })).toBeInTheDocument();

    const catalog = fs.readFileSync(path.join(process.cwd(), "src/data/catalog.json"), "utf8");
    expect(catalog).not.toMatch(/"availableForSale": false/);
    expect(productByHandle("horizon-shell-jacket")!.variants.every((variant) => variant.availableForSale)).toBe(true);
  });
});

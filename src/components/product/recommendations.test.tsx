import fs from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { Product } from "@/components/product/product";
import { catalogProducts, productByHandle, type CatalogProduct } from "@/lib/catalog";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function titlesIn(region: HTMLElement) {
  return within(region).getAllByRole("link").map((link) => link.textContent);
}

function region() {
  return screen.getByRole("region", { name: "You may also like" });
}

describe("REQ-023 you may also like", () => {
  const horizon = productByHandle("horizon-shell-jacket")!;
  const tee = productByHandle("singularity-run-tee")!;

  it("REQ-023 shows four other products under Horizon", () => {
    render(<Product product={horizon} />);
    const row = region();

    expect(screen.getByRole("heading", { name: "You may also like" })).toBeInTheDocument();
    expect(titlesIn(row)).toEqual([
      "Singularity Run Tee",
      "Orbit Half Tight",
      "Accretion Split Short",
      "Event Horizon Long Sleeve",
    ]);
    expect(titlesIn(row)).not.toContain(horizon.title);
    expect(within(row).queryByRole("link", { name: "Photon Run Cap" })).not.toBeInTheDocument();
    expect(row).toHaveClass("pb-28");
    expect(row.querySelector("article")?.parentElement).toHaveClass(
      "overflow-x-auto",
      "md:grid",
      "md:grid-cols-4",
      "md:overflow-visible",
    );
    expect(row.querySelector("article")).toHaveClass("w-[160px]", "shrink-0");
  });

  it("REQ-023 excludes the product on screen and keeps the price placeholder", () => {
    const { unmount } = render(<Product product={tee} />);
    const row = region();

    expect(titlesIn(row)).toEqual([
      "Horizon Shell Jacket",
      "Orbit Half Tight",
      "Accretion Split Short",
      "Event Horizon Long Sleeve",
    ]);
    expect(titlesIn(row)).not.toContain(tee.title);
    expect(within(row).getAllByText("[PRICE]")).toHaveLength(4);
    expect(within(row).queryByText("Void Black")).not.toBeInTheDocument();

    const images = row.querySelectorAll("[data-product-image]");
    expect(images).toHaveLength(4);
    for (const image of images) {
      expect([...image.querySelectorAll("img")].map((img) => img.getAttribute("src"))).toEqual([
        "/brand/crue-mark-white.png",
        "/brand/crue-mark-black.png",
      ]);
    }

    unmount();
    render(<Product product={horizon} catalog={[horizon]} />);
    const alone = region();
    expect(screen.getByRole("heading", { name: "You may also like" })).toBeInTheDocument();
    expect(within(alone).queryByRole("link")).not.toBeInTheDocument();
    expect(alone.querySelector("[data-product-image]")).toBeNull();
    expect(catalogProducts()).toHaveLength(6);
  });

  it("REQ-023 links a card to its product page", () => {
    render(<Product product={horizon} />);
    const row = region();
    const others: CatalogProduct[] = catalogProducts()
      .filter((item) => item.handle !== horizon.handle)
      .slice(0, 4);

    for (const product of others) {
      expect(within(row).getByRole("link", { name: product.title })).toHaveAttribute(
        "href",
        `/products/${product.handle}`,
      );
    }

    const source = read("src/components/product/product.tsx");
    expect(source).not.toMatch(/productRecommendations/);
    expect(source).not.toMatch(/shopify/i);
  });
});

import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import ProductPage from "@/app/products/[handle]/page";
import { Catalog } from "@/components/catalog/catalog";
import { Product } from "@/components/product/product";
import { type CatalogProduct } from "@/lib/catalog";
import { mapStorefrontProduct, requestStorefrontProducts } from "@/lib/storefront";

const node = {
  id: "gid://shopify/Product/1",
  handle: "horizon-shell-jacket",
  title: "Horizon Shell Jacket",
  description: "A shell for the long run.",
  productType: "Layers",
  options: [
    { name: "Color", values: ["Void Black"] },
    { name: "Size", values: ["M"] },
  ],
  variants: {
    nodes: [
      {
        id: "gid://shopify/ProductVariant/1",
        availableForSale: false,
        selectedOptions: [
          { name: "Color", value: "Void Black" },
          { name: "Size", value: "M" },
        ],
        price: { amount: "189000.0" },
      },
    ],
  },
  images: {
    nodes: [{ url: "https://cdn.shopify.com/horizon.jpg", altText: "Front" }],
  },
};

function product(images: CatalogProduct["images"]): CatalogProduct {
  return {
    ...mapStorefrontProduct(node),
    images,
  };
}

describe("REQ-025 storefront products", () => {
  it("REQ-025 reads products from the Storefront fields and not from catalog.json", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          products: {
            pageInfo: { hasNextPage: false, endCursor: null },
            nodes: [node],
          },
        },
      }),
    });

    const products = await requestStorefrontProducts(
      { domain: "https://crue-dev.myshopify.com/", token: "public-token" },
      fetchImpl as unknown as typeof fetch,
    );
    const query = JSON.parse(String(fetchImpl.mock.calls[0][1].body)).query as string;

    expect(fs.existsSync(path.join(process.cwd(), "src/data/catalog.json"))).toBe(false);
    expect(fs.readFileSync(path.join(process.cwd(), "src/lib/catalog.ts"), "utf8")).not.toMatch(/catalog\.json/);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://crue-dev.myshopify.com/api/2026-10/graphql.json",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Shopify-Storefront-Access-Token": "public-token",
        }),
      }),
    );
    expect(query).toMatch(/availableForSale/);
    expect(query).toMatch(/altText/);
    expect(query).toMatch(/amount/);
    expect(products[0]).toMatchObject({
      handle: "horizon-shell-jacket",
      description: "A shell for the long run.",
      category: "Layers",
      options: [
        { name: "Colour", values: ["Void Black"] },
        { name: "Size", values: ["M"] },
      ],
      variants: [
        {
          availableForSale: false,
          price: { amount: "189000.0" },
          selectedOptions: [
            { name: "Colour", value: "Void Black" },
            { name: "Size", value: "M" },
          ],
        },
      ],
      images: [{ url: "https://cdn.shopify.com/horizon.jpg", alt: "Front", altText: "Front" }],
    });
  });

  it("REQ-025 renders price and image URL on the catalog and the product page", () => {
    const item = product([{ url: "https://cdn.shopify.com/horizon.jpg", alt: "Front", altText: "Front" }]);

    const catalog = render(<Catalog products={[item]} />);
    expect(screen.getByText("189000.0")).toBeInTheDocument();
    expect(catalog.container.querySelector('img[src="https://cdn.shopify.com/horizon.jpg"]')).toBeTruthy();
    catalog.unmount();

    const page = render(<Product product={item} catalog={[item]} />);
    expect(screen.getAllByText("189000.0").length).toBeGreaterThan(0);
    expect(page.container.querySelector('img[src="https://cdn.shopify.com/horizon.jpg"]')).toBeTruthy();
  });

  it("REQ-025 keeps the settled mark when a product has no image", () => {
    const item = product([]);
    const catalog = render(<Catalog products={[item]} />);

    expect(catalog.container.querySelector('img[src="https://cdn.shopify.com/horizon.jpg"]')).toBeNull();
    expect(catalog.container.querySelector("[data-placeholder] img[src='/brand/crue-mark-black.png']")).toBeTruthy();
  });

  it("REQ-025 shows the empty catalog when the query fails and not-found for a missing handle", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("down"));
    const products = await requestStorefrontProducts(
      { domain: "crue-dev.myshopify.com", token: "public-token" },
      fetchImpl as unknown as typeof fetch,
    );

    render(<Catalog products={products} />);
    expect(screen.getByText("Nothing in this orbit")).toBeInTheDocument();

    await expect(ProductPage({ params: Promise.resolve({ handle: "missing" }) })).rejects.toThrow();
  });
});

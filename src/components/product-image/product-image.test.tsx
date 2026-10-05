import fs from "node:fs";
import path from "node:path";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { forgetBagMemory } from "@/components/bag/bag";
import { Catalog } from "@/components/catalog/catalog";
import { Product } from "@/components/product/product";
import { ProductImage } from "@/components/product-image/product-image";
import { productByHandle } from "@/lib/catalog";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function photo() {
  return screen.getByRole("img", { name: "Jacket" });
}

describe("REQ-019 product image skeleton", () => {
  const matchMedia = window.matchMedia;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    window.matchMedia = matchMedia;
    forgetBagMemory();
  });

  it("REQ-019 shows the settled placeholder with no src", () => {
    const { rerender } = render(<ProductImage markClassName="w-[72px] opacity-[0.08]" />);

    expect(document.querySelector('img[src="/brand/crue-mark-black.png"]')).toBeTruthy();
    expect(document.querySelector('img[src="/brand/crue-mark-white.png"]')).toBeTruthy();
    expect(document.querySelector("[data-placeholder]")).toBeTruthy();
    expect(document.querySelector(".product-image-pulse")).toBeNull();

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(document.querySelector(".product-image-pulse")).toBeNull();

    rerender(<ProductImage src="" markClassName="w-[72px] opacity-[0.08]" />);
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(document.querySelector("[data-placeholder]")).toBeTruthy();
    expect(document.querySelector(".product-image-pulse")).toBeNull();
  });

  it("REQ-019 skips the pulse when the image loads quickly", () => {
    render(<ProductImage src="/jacket.jpg" alt="Jacket" />);
    fireEvent.load(photo());
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(document.querySelector(".product-image-pulse")).toBeNull();
    expect(document.querySelector("[data-placeholder]")).toBeNull();
    expect(photo()).toHaveClass("object-cover");
  });

  it("REQ-019 pulses after 200ms and then shows the image", () => {
    render(<ProductImage src="/jacket.jpg" alt="Jacket" />);
    expect(read("src/app/globals.css")).toMatch(
      /\.product-image-pulse \{[\s\S]*cubic-bezier\(0\.16, 1, 0\.3, 1\)/,
    );

    act(() => {
      jest.advanceTimersByTime(199);
    });
    expect(document.querySelector(".product-image-pulse")).toBeNull();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(document.querySelector(".product-image-pulse")).toBeTruthy();
    expect(photo()).toHaveClass("opacity-0");

    fireEvent.load(photo());
    expect(document.querySelector(".product-image-pulse")).toBeNull();
    expect(document.querySelector("[data-placeholder]")).toBeNull();
    expect(photo()).toHaveClass("object-cover");
  });

  it("REQ-019 settles when the image fails", () => {
    render(<ProductImage src="/jacket.jpg" alt="Jacket" />);
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(document.querySelector(".product-image-pulse")).toBeTruthy();

    fireEvent.error(photo());
    expect(document.querySelector(".product-image-pulse")).toBeNull();
    expect(document.querySelector("[data-placeholder]")).toBeTruthy();
    expect(photo()).toHaveClass("opacity-0");
    expect(screen.queryByText(/error/i)).toBeNull();
  });

  it("REQ-019 does not pulse under reduced motion", () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;

    render(<ProductImage src="/jacket.jpg" alt="Jacket" />);
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(document.querySelector(".product-image-pulse")).toBeNull();
    expect(document.querySelector("[data-placeholder]")).toBeTruthy();
    expect(read("src/app/globals.css")).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.product-image-pulse \{[\s\S]*animation: none/,
    );

    fireEvent.load(photo());
    expect(photo()).toHaveClass("object-cover");
  });

  it("REQ-019 uses the product image on home, catalog, product, and bag", () => {
    expect(read("src/components/home/home.tsx")).toMatch(/ProductImage/);
    expect(read("src/components/catalog/catalog.tsx")).toMatch(/ProductImage/);
    expect(read("src/components/product/product.tsx")).toMatch(/ProductImage/);
    expect(read("src/components/bag/bag.tsx")).toMatch(/ProductImage/);
    expect(read("src/components/search/search.tsx")).not.toMatch(/ProductImage/);

    const home = render(<Storefront showIntro={false} />);
    expect(home.container.querySelectorAll("[data-product-image]")).toHaveLength(4);
    home.unmount();

    const catalog = render(<Catalog />);
    expect(catalog.container.querySelectorAll("[data-product-image]")).toHaveLength(6);
    catalog.unmount();

    const jacket = productByHandle("horizon-shell-jacket")!;
    const product = render(<Product product={jacket} />);
    expect(product.container.querySelectorAll("[data-product-image]")).toHaveLength(jacket.images.length * 2);

    fireEvent.click(screen.getAllByRole("button", { name: "Add to bag, M" })[0]);
    const bag = screen.getByRole("dialog", { name: "Bag" });
    expect(within(bag).getAllByRole("listitem")).toHaveLength(1);
    expect(bag.querySelectorAll("[data-product-image]")).toHaveLength(1);
    product.unmount();
  });
});

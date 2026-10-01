import { fireEvent, render, screen } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { Catalog } from "@/components/catalog/catalog";
import { catalogProducts } from "@/lib/catalog";

describe("REQ-011 catalog", () => {
  it("REQ-011 opens the catalog from Shop", () => {
    const home = render(<Storefront showIntro={false} />);
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/catalog");
    home.unmount();

    render(<Catalog />);
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("heading", { name: "Enter the orbit" })).not.toBeInTheDocument();
  });

  it("REQ-011 lists six products from the catalog file", () => {
    render(<Catalog />);

    expect(screen.getByRole("heading", { name: "Shop all" })).toBeInTheDocument();
    expect(screen.getByText("(6)")).toBeInTheDocument();
    for (const product of catalogProducts()) {
      expect(screen.getByRole("link", { name: new RegExp(product.title) })).toHaveAttribute(
        "href",
        `/products/${product.handle}`,
      );
    }
    expect(catalogProducts().map((product) => product.category)).toEqual([
      "Layers",
      "Tops",
      "Bottoms",
      "Bottoms",
      "Tops",
      "Accessories",
    ]);
  });

  it("REQ-011 filters by category, size, and colour", () => {
    render(<Catalog />);

    fireEvent.click(screen.getAllByRole("button", { name: /Layers/ })[0]);

    expect(screen.getByRole("heading", { name: "Layers" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Horizon Shell Jacket/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Singularity Run Tee/ })).not.toBeInTheDocument();
    expect(window.location.search).toContain("category=Layers");

    fireEvent.click(screen.getByRole("button", { name: "M" }));
    fireEvent.click(screen.getByRole("button", { name: "Void Black" }));

    expect(window.location.search).toContain("size=M");
    expect(window.location.search).toContain("colour=Void");
    expect(screen.queryByRole("link", { name: /Photon Run Cap/ })).not.toBeInTheDocument();
  });

  it("REQ-011 changes the grid when filters are hidden", () => {
    render(<Catalog />);

    const grid = screen.getByRole("link", { name: /Horizon Shell Jacket/ }).parentElement;
    expect(grid).toHaveClass("grid-cols-2", "md:grid-cols-3");

    fireEvent.click(screen.getByRole("button", { name: "Hide filters" }));
    expect(screen.getByRole("link", { name: /Horizon Shell Jacket/ }).parentElement).toHaveClass("md:grid-cols-4");
  });

  it("REQ-011 shows the empty state and does not sort", () => {
    const { unmount } = render(<Catalog />);
    const before = catalogProducts().map((product) => product.title).join(",");
    fireEvent.click(screen.getByRole("button", { name: "Sort: Featured" }));
    expect(catalogProducts().map((product) => product.title).join(",")).toBe(before);
    unmount();

    render(<Catalog category="Accessories" size="M" />);
    expect(screen.getByText("Nothing in this orbit")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });
});

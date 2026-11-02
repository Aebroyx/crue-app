import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { searchLink } from "@/components/search/search";
import { catalogProducts } from "@/lib/catalog";
import { requestPredictiveSearch, setSearchClient, type SearchAnswer, type SearchClient, type SearchHit } from "@/lib/search";

function openSearch() {
  fireEvent.click(screen.getAllByRole("button", { name: "Search" })[0]);
}

const snowboard: SearchHit = {
  id: "gid://shopify/Product/1",
  handle: "the-complete-snowboard",
  title: "The Complete Snowboard",
  amount: "699.95",
  imageUrl: "https://cdn.shopify.com/snowboard.jpg",
  imageAlt: "Snowboard",
};

describe("REQ-027 predictive search", () => {
  it("REQ-027 shows predictiveSearch products for a query", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          predictiveSearch: {
            queries: [{ text: "snowboard" }],
            products: [
              {
                id: snowboard.id,
                handle: snowboard.handle,
                title: snowboard.title,
                featuredImage: { url: snowboard.imageUrl, altText: snowboard.imageAlt },
                variants: { nodes: [{ price: { amount: snowboard.amount } }] },
              },
            ],
          },
        },
      }),
    });

    const hits = await requestPredictiveSearch("snow", fetchImpl as unknown as typeof fetch);
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body)) as {
      query: string;
      variables: { query: string };
    };

    expect(body.query).toMatch(/predictiveSearch/);
    expect(body.query).toMatch(/queries/);
    expect(body.variables.query).toBe("snow");
    expect(hits).toEqual({ products: [snowboard], queries: ["snowboard"] });

    setSearchClient({ search: () => ({ products: [snowboard], queries: [] }) });
    render(<Storefront showIntro={false} />);
    openSearch();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "snow" } });

    const result = within(screen.getByRole("dialog", { name: "Search" })).getByRole("link", {
      name: /The Complete Snowboard/,
    });
    expect(result).toHaveAttribute("href", "/products/the-complete-snowboard");
    expect(result.querySelector('img[src="https://cdn.shopify.com/snowboard.jpg"]')).toBeTruthy();
    expect(screen.getByText("699.95")).toBeInTheDocument();
    expect(screen.getByText("1 result")).toBeInTheDocument();

    setSearchClient({
      search: () => ({ products: [{ ...snowboard, imageUrl: undefined, imageAlt: "" }], queries: [] }),
    });
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "board" } });
    const plain = screen.getByRole("link", { name: /The Complete Snowboard/ });
    expect(plain.querySelector('img[src="https://cdn.shopify.com/snowboard.jpg"]')).toBeNull();
    expect(plain.querySelector("[data-placeholder]")).toBeTruthy();
  });

  it("REQ-027 keeps the no-match copy and the chips", () => {
    const search = jest.fn(
      (): SearchAnswer => ({ products: [], queries: ["snowboard", "wax"] }),
    );
    setSearchClient({ search });
    render(<Storefront showIntro={false} />);
    openSearch();

    expect(screen.getByRole("button", { name: catalogProducts()[0].title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Horizon Shell Jacket" }));
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("Horizon Shell Jacket");
    expect(search).toHaveBeenCalledWith("Horizon Shell Jacket");

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "nope" } });
    const dialog = within(screen.getByRole("dialog", { name: "Search" }));
    expect(screen.getByText("No results for “nope”")).toBeInTheDocument();
    expect(screen.getByText("Check the spelling or try one of these.")).toBeInTheDocument();
    expect(dialog.getByRole("button", { name: "snowboard" })).toBeInTheDocument();
    expect(dialog.getByRole("button", { name: "wax" })).toBeInTheDocument();
    expect(dialog.queryByRole("button", { name: "Shell jacket" })).not.toBeInTheDocument();
    expect(dialog.queryByText("Popular searches")).not.toBeInTheDocument();
  });

  it("REQ-027 links View all in shop to the catalog", () => {
    setSearchClient({
      search: () => ({ products: [snowboard], queries: [] }),
    } satisfies SearchClient);
    render(<Storefront showIntro={false} />);
    openSearch();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "snow" } });

    const shop = screen.getByRole("link", { name: "View all in shop" });
    expect(shop).toHaveAttribute("href", "/catalog");
    const go = jest.spyOn(searchLink, "go").mockImplementation(() => undefined);
    fireEvent.click(shop);
    expect(go).toHaveBeenCalledWith("/catalog");
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();
    go.mockRestore();
  });

  it("REQ-027 does not query a blank search", () => {
    const search = jest.fn(() => ({ products: [snowboard], queries: [] }));
    setSearchClient({ search });
    render(<Storefront showIntro={false} />);
    openSearch();

    expect(search).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "   " } });
    expect(search).not.toHaveBeenCalled();
    expect(screen.getByText("Popular searches")).toBeInTheDocument();
  });
});

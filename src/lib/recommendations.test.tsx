import { fireEvent, render, screen, within } from "@testing-library/react";
import { Product } from "@/components/product/product";
import { productByHandle } from "@/lib/catalog";
import { requestProductRecommendations, type Recommendation } from "@/lib/recommendations";

const horizon = productByHandle("horizon-shell-jacket")!;

function card(handle: string, title: string, amount = "10.0", imageUrl?: string): Recommendation {
  return { id: handle, handle, title, amount, imageUrl, imageAlt: title };
}

const returned: Recommendation[] = [
  card(horizon.handle, horizon.title, "1.0"),
  card("singularity-run-tee", "Singularity Run Tee", "189000.0", "https://cdn.shopify.com/tee.jpg"),
  card("orbit-half-tight", "Orbit Half Tight", "20.0"),
  card("accretion-split-short", "Accretion Split Short", "30.0"),
  card("event-horizon-long-sleeve", "Event Horizon Long Sleeve", "40.0"),
  card("photon-run-cap", "Photon Run Cap", "50.0"),
];

describe("REQ-028 product recommendations", () => {
  it("REQ-028 shows up to four productRecommendations and leaves out the product on screen", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          productRecommendations: returned.map((item) => ({
            id: item.id,
            handle: item.handle,
            title: item.title,
            featuredImage: item.imageUrl ? { url: item.imageUrl, altText: item.imageAlt } : null,
            variants: { nodes: [{ price: { amount: item.amount } }] },
          })),
        },
      }),
    });

    const recommendations = await requestProductRecommendations(horizon.id, fetchImpl as unknown as typeof fetch);
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body)) as {
      query: string;
      variables: { productId: string };
    };

    expect(body.query).toMatch(/productRecommendations/);
    expect(body.query).not.toMatch(/intent/);
    expect(body.variables.productId).toBe(horizon.id);

    render(<Product product={horizon} recommendations={recommendations} />);
    const row = screen.getByRole("region", { name: "You may also like" });
    expect(within(row).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Singularity Run Tee",
      "Orbit Half Tight",
      "Accretion Split Short",
      "Event Horizon Long Sleeve",
    ]);
    expect(within(row).queryByRole("link", { name: horizon.title })).not.toBeInTheDocument();
    expect(within(row).queryByRole("link", { name: "Photon Run Cap" })).not.toBeInTheDocument();
  });

  it("REQ-028 renders the price amount and the image URL", () => {
    render(<Product product={horizon} recommendations={[returned[1]]} />);
    const row = screen.getByRole("region", { name: "You may also like" });

    expect(within(row).getByText("189000.0")).toBeInTheDocument();
    expect(row.querySelector('img[src="https://cdn.shopify.com/tee.jpg"]')).toBeTruthy();
  });

  it("REQ-028 links a card to its product page", () => {
    render(<Product product={horizon} recommendations={[returned[1]]} />);

    expect(screen.getByRole("link", { name: "Singularity Run Tee" })).toHaveAttribute(
      "href",
      "/products/singularity-run-tee",
    );
    fireEvent.click(screen.getByRole("link", { name: "Singularity Run Tee" }));
  });

  it("REQ-028 shows no card when recommendations are empty or the query fails", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false });
    const failed = await requestProductRecommendations(horizon.id, fetchImpl as unknown as typeof fetch);
    expect(failed).toEqual([]);

    const { unmount } = render(<Product product={horizon} recommendations={failed} />);
    expect(screen.getByRole("heading", { name: "You may also like" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Singularity Run Tee" })).not.toBeInTheDocument();
    unmount();

    render(<Product product={horizon} recommendations={[card(horizon.handle, horizon.title)]} />);
    const row = screen.getByRole("region", { name: "You may also like" });
    expect(within(row).queryByRole("link")).not.toBeInTheDocument();
  });
});

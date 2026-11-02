import { render, screen } from "@testing-library/react";
import { Home } from "@/components/home/home";
import { manifestoFallback, requestManifesto } from "@/lib/manifesto";

const shopify = {
  heading: "Pull is the training.",
  body: "Cut for the long run.",
  bodyWide: "And the heavy set.",
  linkLabel: "Read about CRUE",
  linkHref: "/about",
};

function payload(fields: Record<string, string | null> | null) {
  return {
    ok: true,
    json: async () => ({
      data: {
        metaobjects: {
          nodes: fields
            ? [
                {
                  heading: { value: fields.heading },
                  body: { value: fields.body },
                  body_wide: { value: fields.body_wide },
                  link_label: { value: fields.link_label },
                  link_href: { value: fields.link_href },
                },
              ]
            : [],
        },
      },
    }),
  };
}

describe("REQ-031 home manifesto", () => {
  it("REQ-031 reads the manifesto fields from the metaobject", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const fetchImpl = jest.fn().mockResolvedValue(
      payload({
        heading: shopify.heading,
        body: shopify.body,
        body_wide: shopify.bodyWide,
        link_label: shopify.linkLabel,
        link_href: shopify.linkHref,
      }),
    );

    const manifesto = await requestManifesto(fetchImpl as unknown as typeof fetch);
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body)) as { query: string };

    expect(body.query).toMatch(/metaobjects\(type:\s*"manifesto"/);
    expect(body.query).toMatch(/heading/);
    expect(body.query).toMatch(/body_wide/);
    expect(body.query).toMatch(/link_label/);
    expect(body.query).toMatch(/link_href/);
    expect(manifesto).toEqual(shopify);
  });

  it("REQ-031 shows the wide sentence only on a wide screen and links the manifesto", () => {
    render(<Home manifesto={shopify} />);
    const band = screen.getByRole("heading", { name: shopify.heading }).closest("section");

    expect(band).toHaveAttribute("id", "manifesto");
    expect(screen.getByText(shopify.bodyWide)).toHaveClass("hidden", "md:inline");
    expect(screen.getByRole("link", { name: shopify.linkLabel })).toHaveAttribute("href", "/about");
    expect(band?.querySelector("img")).toBeNull();
  });

  it("REQ-031 falls back to the REQ-004 manifesto when the metaobject is missing", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const missing = await requestManifesto(
      jest.fn().mockResolvedValue(payload(null)) as unknown as typeof fetch,
    );
    const failed = await requestManifesto(
      jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch,
    );
    const blankField = await requestManifesto(
      jest.fn().mockResolvedValue(
        payload({
          heading: "   ",
          body: shopify.body,
          body_wide: shopify.bodyWide,
          link_label: shopify.linkLabel,
          link_href: shopify.linkHref,
        }),
      ) as unknown as typeof fetch,
    );

    expect(missing).toEqual(manifestoFallback);
    expect(failed).toEqual(manifestoFallback);
    expect(blankField).toEqual({
      heading: manifestoFallback.heading,
      body: shopify.body,
      bodyWide: shopify.bodyWide,
      linkLabel: shopify.linkLabel,
      linkHref: shopify.linkHref,
    });

    render(<Home />);
    expect(screen.getByRole("heading", { name: "Gravity is your training partner." })).toBeInTheDocument();
    expect(screen.getByText("Every piece is cut to move between both.")).toHaveClass("hidden", "md:inline");
    expect(screen.getByRole("link", { name: "Read the story" })).toHaveAttribute("href", "#manifesto");
  });
});

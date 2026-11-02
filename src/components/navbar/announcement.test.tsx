import { render, screen } from "@testing-library/react";
import { AnnouncementProvider } from "@/components/announcement-context";
import { Navbar } from "@/components/navbar/navbar";
import { announcementFallback, requestAnnouncement } from "@/lib/announcement";

const shopify = {
  mobileText: "New drop, this week",
  desktopText: "New drop: Night Orbit, this week",
  shippingText: "Free shipping over Rp 1.500.000",
};

function payload(fields: { mobile_text?: string; desktop_text?: string; shipping_text?: string } | null) {
  return {
    ok: true,
    json: async () => ({
      data: {
        metaobjects: {
          nodes: fields
            ? [
                {
                  mobile_text: { value: fields.mobile_text ?? null },
                  desktop_text: { value: fields.desktop_text ?? null },
                  shipping_text: { value: fields.shipping_text ?? null },
                },
              ]
            : [],
        },
      },
    }),
  };
}

describe("REQ-029 announcement bar", () => {
  it("REQ-029 reads the announcement fields from the metaobject", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const fetchImpl = jest.fn().mockResolvedValue(
      payload({
        mobile_text: shopify.mobileText,
        desktop_text: shopify.desktopText,
        shipping_text: shopify.shippingText,
      }),
    );

    const announcement = await requestAnnouncement(fetchImpl as unknown as typeof fetch);
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body)) as { query: string };

    expect(body.query).toMatch(/metaobjects\(type:\s*"announcement"/);
    expect(body.query).toMatch(/mobile_text/);
    expect(body.query).toMatch(/desktop_text/);
    expect(body.query).toMatch(/shipping_text/);
    expect(announcement).toEqual(shopify);
  });

  it("REQ-029 shows the phone line and the wide lines", () => {
    render(
      <AnnouncementProvider announcement={shopify}>
        <Navbar />
      </AnnouncementProvider>,
    );

    expect(screen.getByText(shopify.mobileText)).toHaveClass("md:hidden");
    expect(screen.getByText(shopify.desktopText)).toHaveClass("hidden", "md:inline");
    expect(screen.getByText(shopify.shippingText)).toHaveClass("hidden", "text-muted", "md:inline");
  });

  it("REQ-029 falls back to the REQ-004 lines when the metaobject is missing", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const missing = await requestAnnouncement(
      jest.fn().mockResolvedValue(payload(null)) as unknown as typeof fetch,
    );
    const failed = await requestAnnouncement(
      jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch,
    );
    const blankField = await requestAnnouncement(
      jest.fn().mockResolvedValue(
        payload({
          mobile_text: "   ",
          desktop_text: shopify.desktopText,
          shipping_text: shopify.shippingText,
        }),
      ) as unknown as typeof fetch,
    );

    expect(missing).toEqual(announcementFallback);
    expect(failed).toEqual(announcementFallback);
    expect(blankField).toEqual({
      mobileText: announcementFallback.mobileText,
      desktopText: shopify.desktopText,
      shippingText: shopify.shippingText,
    });

    render(<Navbar />);
    expect(screen.getByText("Drop 001, out now")).toHaveClass("md:hidden");
    expect(screen.getByText("Drop 001: Event Horizon, out now")).toHaveClass("hidden", "md:inline");
    expect(screen.getByText("Free shipping over [THRESHOLD]")).toHaveClass("hidden", "md:inline");
  });
});

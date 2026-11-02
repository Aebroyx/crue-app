import { act, fireEvent, render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/hero";
import { requestBanners, type BannerSlide } from "@/lib/banners";

function slide(
  position: string | null,
  url: string | null,
  alt = "",
  copy: Partial<BannerSlide> = {},
): BannerSlide {
  return {
    eyebrow: "",
    heading: "",
    body: "",
    bodyWide: "",
    buttonLabel: "",
    buttonHref: "",
    ...copy,
    position: position === null ? null : Number(position),
    imageUrl: url,
    imageAlt: alt,
  };
}

function node(
  position: string | null,
  url: string | null,
  alt: string | null = "",
  typename = "MediaImage",
  fields: Record<string, string | null> = {},
) {
  return {
    position: { value: position },
    eyebrow: { value: fields.eyebrow ?? "Drop 002" },
    heading: { value: fields.heading ?? "Night\nOrbit" },
    body: { value: fields.body ?? "A second line." },
    body_wide: { value: fields.body_wide ?? "Wide sentence." },
    button_label: { value: fields.button_label ?? "Shop it" },
    button_href: { value: fields.button_href ?? "/catalog" },
    image: {
      reference: url
        ? { __typename: typename, image: { url, altText: alt } }
        : { __typename: "GenericFile", image: null },
    },
  };
}

function payload(nodes: ReturnType<typeof node>[]) {
  return {
    ok: true,
    json: async () => ({
      data: {
        metaobjects: {
          pageInfo: { hasNextPage: false, endCursor: null },
          nodes,
        },
      },
    }),
  };
}

describe("REQ-030 top banner carousel", () => {
  afterEach(() => {
    jest.useRealTimers();
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })) as unknown as typeof window.matchMedia;
  });

  it("REQ-030 reads the banner image in position order", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const extra = Array.from({ length: 8 }, (_, index) =>
      node(String(index + 3), `https://cdn.shopify.com/${index + 3}.jpg`),
    );
    const fetchImpl = jest.fn().mockResolvedValue(
      payload([
        node(null, "https://cdn.shopify.com/last.jpg"),
        node("2", "https://cdn.shopify.com/two.jpg", "Second"),
        node("11", "https://cdn.shopify.com/high.jpg"),
        ...extra,
        node("1", "https://cdn.shopify.com/one.jpg", ""),
      ]),
    );

    const banners = await requestBanners(fetchImpl as unknown as typeof fetch);
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body)) as { query: string };

    expect(body.query).toMatch(/metaobjects\(type:\s*"home_banner"/);
    expect(body.query).toMatch(/position/);
    expect(body.query).toMatch(/image/);
    expect(body.query).toMatch(/altText/);
    expect(body.query).toMatch(/eyebrow/);
    expect(body.query).toMatch(/heading/);
    expect(body.query).toMatch(/body_wide/);
    expect(body.query).toMatch(/button_label/);
    expect(body.query).toMatch(/button_href/);
    expect(banners[0]).toMatchObject({
      heading: "Night\nOrbit",
      buttonLabel: "Shop it",
      buttonHref: "/catalog",
    });
    expect(banners.map((item) => item.imageUrl)).toEqual([
      "https://cdn.shopify.com/one.jpg",
      "https://cdn.shopify.com/two.jpg",
      "https://cdn.shopify.com/3.jpg",
      "https://cdn.shopify.com/4.jpg",
      "https://cdn.shopify.com/5.jpg",
      "https://cdn.shopify.com/6.jpg",
      "https://cdn.shopify.com/7.jpg",
      "https://cdn.shopify.com/8.jpg",
      "https://cdn.shopify.com/9.jpg",
      "https://cdn.shopify.com/10.jpg",
    ]);
    expect(banners[0].imageAlt).toBe("");
    expect(banners[1].imageAlt).toBe("Second");
    expect(banners.some((item) => item.imageUrl?.includes("last.jpg"))).toBe(false);
    expect(banners.some((item) => item.imageUrl?.includes("high.jpg"))).toBe(false);
  });

  it("REQ-030 advances the image and that slide's words every 3 seconds", () => {
    jest.useFakeTimers();
    render(
      <Hero
        slides={[
          slide("1", "https://cdn.shopify.com/one.jpg", "", {
            heading: "Event\nHorizon",
            buttonLabel: "Shop all",
            buttonHref: "/catalog",
          }),
          slide("2", "https://cdn.shopify.com/two.jpg", "", {
            eyebrow: "Drop 002",
            heading: "Night\nOrbit",
            bodyWide: "Shown on a wide screen.",
            buttonLabel: "Shop the night",
            buttonHref: "/catalog",
          }),
          slide("3", "https://cdn.shopify.com/three.jpg", "", { heading: "Third" }),
        ]}
      />,
    );

    const photo = () => document.querySelector("section img");
    expect(photo()).toHaveAttribute("src", "https://cdn.shopify.com/one.jpg");
    expect(photo()).toHaveClass("absolute", "inset-0", "size-full", "object-cover");
    expect(screen.getByRole("heading", { name: /Event\s+Horizon/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop all" })).toHaveAttribute("href", "/catalog");

    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(photo()).toHaveAttribute("src", "https://cdn.shopify.com/one.jpg");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(photo()).toHaveAttribute("src", "https://cdn.shopify.com/two.jpg");
    expect(screen.getByRole("heading", { name: /Night\s+Orbit/ })).not.toHaveAttribute("data-banner-meta");
    expect(screen.getByText("Shown on a wide screen.").closest("p")).toHaveAttribute("data-banner-meta");
    expect(screen.getByRole("link", { name: "Shop the night" })).toHaveAttribute("href", "/catalog");

    act(() => {
      jest.advanceTimersByTime(6000);
    });
    expect(photo()).toHaveAttribute("src", "https://cdn.shopify.com/one.jpg");
    expect(screen.getByRole("heading", { name: /Event\s+Horizon/ })).toBeInTheDocument();
  });

  it("REQ-030 pauses while the frame is hovered or focused", () => {
    jest.useFakeTimers();
    render(
      <Hero
        slides={[
          slide("1", "https://cdn.shopify.com/one.jpg", "", {
            heading: "Event\nHorizon",
            buttonLabel: "Shop all",
            buttonHref: "/catalog",
          }),
          slide("2", "https://cdn.shopify.com/two.jpg", "", {
            heading: "Second",
            buttonLabel: "Shop all",
            buttonHref: "/catalog",
          }),
        ]}
      />,
    );
    const frame = screen.getByRole("heading", { name: /Event\s+Horizon/ }).closest("section");
    if (!frame) throw new Error("Missing banner frame");

    fireEvent.mouseEnter(frame);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector("section img")).toHaveAttribute("src", "https://cdn.shopify.com/one.jpg");

    fireEvent.mouseLeave(frame);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector("section img")).toHaveAttribute("src", "https://cdn.shopify.com/two.jpg");

    fireEvent.focus(screen.getByRole("link", { name: "Shop all" }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector("section img")).toHaveAttribute("src", "https://cdn.shopify.com/two.jpg");

    fireEvent.blur(screen.getByRole("link", { name: "Shop all" }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector("section img")).toHaveAttribute("src", "https://cdn.shopify.com/one.jpg");
  });

  it("REQ-030 does not advance for one image, a failed query, or reduced motion", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const failed = await requestBanners(jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch);
    expect(failed).toEqual([]);

    jest.useFakeTimers();
    const { unmount } = render(<Hero slides={[slide("1", "https://cdn.shopify.com/only.jpg")]} />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector("section img")).toHaveAttribute("src", "https://cdn.shopify.com/only.jpg");
    unmount();

    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })) as unknown as typeof window.matchMedia;

    render(
      <Hero slides={[slide("1", "https://cdn.shopify.com/still.jpg"), slide("2", "https://cdn.shopify.com/next.jpg")]} />,
    );
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector("section img")).toHaveAttribute("src", "https://cdn.shopify.com/still.jpg");
  });

  it("REQ-030 shows the glow and the mark when the image is missing", () => {
    jest.useFakeTimers();
    render(
      <Hero
        slides={[slide("1", "https://cdn.shopify.com/one.jpg", ""), slide("2", null), slide("3", "https://cdn.shopify.com/three.jpg")]}
      />,
    );

    expect(document.querySelector('img[src="/brand/glow-dark.jpg"]')).toBeNull();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector('img[src="https://cdn.shopify.com/one.jpg"]')).toBeNull();
    expect(document.querySelector('img[src="/brand/glow-dark.jpg"]')).toBeTruthy();
    expect(document.querySelector('img[src="/brand/crue-mark-black.png"]')).toBeNull();
    expect(document.querySelector('img[src="/brand/crue-mark-white.png"]')).toBeTruthy();
    expect(screen.queryByRole("heading", { name: /Event\s+Horizon/ })).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(document.querySelector("section img")).toHaveAttribute("src", "https://cdn.shopify.com/three.jpg");
  });

  it("REQ-030 omits an empty field and keeps the fields that have text", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const banners = await requestBanners(
      jest.fn().mockResolvedValue(
        payload([
          node("1", "https://cdn.shopify.com/one.jpg", "", "MediaImage", {
            eyebrow: "   ",
            heading: "Night\nOrbit",
            body: "",
            body_wide: "",
            button_label: "Shop the shell",
            button_href: "",
          }),
        ]),
      ) as unknown as typeof fetch,
    );

    expect(banners[0]).toMatchObject({
      eyebrow: "",
      heading: "Night\nOrbit",
      body: "",
      bodyWide: "",
      buttonLabel: "Shop the shell",
      buttonHref: "",
    });

    render(<Hero slides={banners} />);
    expect(screen.queryByText("Drop 001")).not.toBeInTheDocument();
    expect(screen.queryByText("Technical running wear for the hybrid athlete.")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Shop the shell" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Night\s+Orbit/ }).querySelector("br")).toBeTruthy();
  });
});

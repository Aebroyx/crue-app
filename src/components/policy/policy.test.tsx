import fs from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/components/footer/footer";
import { Policy, policyByHandle, policySentence } from "@/components/policy/policy";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const pages = [
  {
    handle: "shipping",
    title: "Shipping policy",
    headings: ["Processing time", "Delivery regions and times", "Shipping costs", "Tracking your order"],
  },
  {
    handle: "returns",
    title: "Returns policy",
    headings: ["Return window", "Condition of items", "How to start a return", "Refunds and exchanges"],
  },
  {
    handle: "privacy",
    title: "Privacy policy",
    headings: ["What we collect", "How we use it", "Cookies", "Your rights"],
  },
  {
    handle: "terms",
    title: "Terms of service",
    headings: ["Orders and payment", "Pricing and availability", "Intellectual property", "Governing law"],
  },
] as const;

function topicNavs() {
  const navs = screen.getAllByRole("navigation", { name: "Help topics" });
  return {
    phone: navs.find((nav) => nav.classList.contains("md:hidden")) as HTMLElement,
    desktop: navs.find((nav) => nav.classList.contains("md:flex")) as HTMLElement,
  };
}

describe("REQ-021 policy pages", () => {
  it("REQ-021 renders the four policy pages from the screen headings", () => {
    for (const page of pages) {
      const policy = policyByHandle(page.handle);
      const view = render(<Policy handle={page.handle} />);

      expect(screen.getByRole("heading", { level: 1, name: page.title })).toHaveClass("text-[34px]", "md:text-[64px]");
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
      expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("Help");

      const article = screen.getByRole("heading", { level: 2, name: page.headings[0] }).closest("article");
      expect(article).toHaveClass("max-w-[680px]");

      for (const heading of page.headings) {
        const sentence = `[Your ${policy!.label.toLowerCase()} policy text for \u201C${heading.toLowerCase()}\u201D goes here. Keep it short and plain.]`;
        expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
        expect(policySentence(policy!.label, heading)).toBe(sentence);
        expect(screen.getByText(sentence)).toBeInTheDocument();
      }

      view.unmount();
    }
  });

  it("REQ-021 keeps the date and support placeholders", () => {
    render(<Policy handle="shipping" />);
    const help = screen.getByText("Still need help?").parentElement;

    expect(screen.getByText("Last updated [DATE]")).toBeInTheDocument();
    expect(help).toHaveClass("bg-surface");
    expect(help).toHaveTextContent("Email [SUPPORT EMAIL] and we will reply within [RESPONSE TIME].");
    expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).not.toBeInTheDocument();
  });

  it("REQ-021 changes topic by route", () => {
    const shipping = render(<Policy handle="shipping" />);
    const shippingTopics = topicNavs();
    const shippingDesktop = within(shippingTopics.desktop).getByRole("link", { name: "Shipping" });
    const returnsLink = within(shippingTopics.desktop).getByRole("link", { name: "Returns" });
    const shippingChip = within(shippingTopics.phone).getByRole("link", { name: "Shipping" });
    const returnsChip = within(shippingTopics.phone).getByRole("link", { name: "Returns" });

    expect(shippingDesktop).toHaveAttribute("href", "/policies/shipping");
    expect(shippingDesktop).toHaveAttribute("aria-current", "page");
    expect(shippingDesktop).toHaveClass("text-text");
    expect(shippingDesktop.querySelector("span")).toHaveClass("size-2", "bg-text");
    expect(returnsLink).toHaveAttribute("href", "/policies/returns");
    expect(returnsLink).not.toHaveAttribute("aria-current");
    expect(returnsLink).toHaveClass("text-muted");
    expect(returnsLink.querySelector("span")).toHaveClass("size-2", "bg-transparent");
    expect(shippingTopics.desktop).toHaveClass("w-60");
    expect(shippingChip).toHaveClass("h-11", "bg-text", "text-bg");
    expect(returnsChip).toHaveAttribute("href", "/policies/returns");
    expect(returnsChip).toHaveClass("h-11", "border-control-border");
    expect(returnsChip).not.toHaveClass("bg-text");
    shipping.unmount();

    render(<Policy handle="returns" />);
    const returnsTopics = topicNavs();

    expect(screen.getByRole("heading", { name: "Returns policy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Return window" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Processing time" })).not.toBeInTheDocument();
    expect(within(returnsTopics.desktop).getByRole("link", { name: "Returns" })).toHaveAttribute("aria-current", "page");
    expect(within(returnsTopics.phone).getByRole("link", { name: "Returns" })).toHaveClass("bg-text");
    expect(within(returnsTopics.desktop).getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/policies/privacy");
    expect(within(returnsTopics.desktop).getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/policies/terms");
  });

  it("REQ-021 links the footer and shows not-found for an unknown handle", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByRole("link", { name: "Shipping" })).toHaveAttribute("href", "/policies/shipping");
    expect(within(footer).getByRole("link", { name: "Returns" })).toHaveAttribute("href", "/policies/returns");
    expect(within(footer).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/policies/shipping");
    expect(policyByHandle("missing")).toBeNull();
    expect(read("src/app/policies/[handle]/page.tsx")).toMatch(/if \(!policy\) notFound\(\)/);
    expect(read("src/app/not-found.tsx")).toContain("NotFound");
  });
});

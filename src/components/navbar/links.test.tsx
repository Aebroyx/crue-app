import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { introCookie, introCookieName } from "@/lib/intro-cookie";

describe("REQ-009 home and intro links", () => {
  beforeEach(() => {
    document.cookie = `${introCookieName}=; Path=/; Max-Age=0`;
  });

  it("REQ-009 does not clear the intro when Shop is used", () => {
    document.cookie = introCookie();
    render(<Storefront showIntro={false} />);

    fireEvent.click(screen.getByRole("link", { name: "Shop" }));

    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/catalog");
    expect(document.cookie).toContain(`${introCookieName}=1`);
  });

  it("REQ-009 sends the wordmark to the intro", () => {
    document.cookie = introCookie();
    render(<Storefront showIntro={false} />);

    const marks = screen.getAllByRole("link", { name: "CRUE home" });
    expect(marks).toHaveLength(2);
    for (const mark of marks) {
      expect(mark).toHaveAttribute("href", "/");
    }

    fireEvent.click(marks[0]);
    expect(document.cookie).not.toContain(`${introCookieName}=1`);
  });

  it("REQ-009 dismisses the replay with Enter", () => {
    render(<Storefront showIntro />);

    fireEvent.click(screen.getByRole("button", { name: "Enter" }));

    expect(document.querySelector("[data-intro]")).toBeNull();
    expect(screen.getByRole("heading", { name: /Event\s+Horizon/ })).toBeInTheDocument();
  });

  it("REQ-009 leaves the other nav links and the footer wordmark unchanged", () => {
    render(<Storefront showIntro={false} />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Run" })).toHaveAttribute("href", "#drop");
    expect(within(nav).getByRole("link", { name: "Train" })).toHaveAttribute("href", "#drop");
    expect(within(nav).getByRole("link", { name: "Drops" })).toHaveAttribute("href", "#drop");
    expect(within(nav).getByRole("link", { name: "Journal" })).toHaveAttribute("href", "#manifesto");

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).queryByRole("link", { name: "CRUE home" })).toBeNull();
    expect(within(footer).getByRole("img", { name: "CRUE" })).toBeInTheDocument();
  });
});

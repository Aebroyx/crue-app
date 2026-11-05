import { fireEvent, render, screen, within } from "@testing-library/react";
import HomePage, { Storefront } from "@/app/page";
import { menuLink } from "@/components/navbar/menu";
import { hasSeenIntro, introCookie, introCookieName, showIntroForVisit } from "@/lib/intro-cookie";

jest.mock("next/font/google", () => ({
  Geist: () => ({ className: "font-geist" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex" }),
}));

const cookieGet = jest.fn();

jest.mock("next/headers", () => ({
  cookies: async () => ({
    get: cookieGet,
  }),
}));

const week = 7 * 24 * 60 * 60 * 1000;

describe("REQ-034 nav links", () => {
  beforeEach(() => {
    document.cookie = `${introCookieName}=; Path=/; Max-Age=0`;
    cookieGet.mockReset();
  });

  it("REQ-034 shows Shop and About in the header and leaves out Run, Train, and Drops", () => {
    render(<Storefront showIntro={false} />);
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(within(nav).getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/catalog");
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(within(nav).queryByRole("link", { name: "Run" })).toBeNull();
    expect(within(nav).queryByRole("link", { name: "Train" })).toBeNull();
    expect(within(nav).queryByRole("link", { name: "Drops" })).toBeNull();
  });

  it("REQ-034 shows Shop and About in the phone menu", () => {
    render(<Storefront showIntro={false} />);
    const go = jest.spyOn(menuLink, "go").mockImplementation(() => undefined);

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    const nav = within(dialog).getByRole("navigation", { name: "Main" });

    expect(nav.textContent?.replace(/\s+/g, "")).toBe("ShopAbout");
    expect(within(nav).queryByRole("link", { name: "Run" })).toBeNull();
    expect(within(nav).queryByRole("link", { name: "Train" })).toBeNull();
    expect(within(nav).queryByRole("link", { name: "Drops" })).toBeNull();

    fireEvent.click(within(nav).getByRole("link", { name: "Shop" }));
    expect(go).toHaveBeenCalledWith("/catalog");
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "Menu" })).getByRole("link", { name: "About" }));
    expect(go).toHaveBeenCalledWith("/about");

    go.mockRestore();
  });

  it("REQ-034 leaves Run and Train out of the footer", () => {
    render(<Storefront showIntro={false} />);
    const shop = within(screen.getByRole("contentinfo")).getByRole("navigation", { name: "Shop" });

    expect(within(shop).getByRole("link", { name: "New arrivals" })).toBeInTheDocument();
    expect(within(shop).getByRole("link", { name: "Accessories" })).toBeInTheDocument();
    expect(within(shop).queryByRole("link", { name: "Run" })).toBeNull();
    expect(within(shop).queryByRole("link", { name: "Train" })).toBeNull();
  });

  it("REQ-034 sends the wordmark home and keeps the intro cookie", () => {
    document.cookie = introCookie();
    const seen = document.cookie;
    render(<Storefront showIntro={false} />);

    const marks = screen.getAllByRole("link", { name: "CRUE home" });
    expect(marks).toHaveLength(2);
    for (const mark of marks) {
      expect(mark).toHaveAttribute("href", "/");
      fireEvent.click(mark);
    }

    expect(document.cookie).toBe(seen);
  });

  it("REQ-034 shows the intro for a first visit, after the session or seven days, and for ?intro on a development server", async () => {
    const now = Date.now();
    expect(introCookie(now)).toBe(`${introCookieName}=${now}; Path=/; SameSite=Lax`);
    expect(introCookie(now)).not.toContain("Max-Age");
    expect(hasSeenIntro(undefined, now)).toBe(false);
    expect(hasSeenIntro(String(now), now)).toBe(true);
    expect(hasSeenIntro(String(now - week), now)).toBe(false);
    expect(showIntroForVisit(undefined, { now })).toBe(true);
    expect(showIntroForVisit(String(now), { now })).toBe(false);
    expect(showIntroForVisit(String(now), { intro: true, development: false, now })).toBe(false);
    expect(showIntroForVisit(String(now), { intro: true, development: true, now })).toBe(true);

    cookieGet.mockReturnValue(undefined);
    const { unmount } = render(await HomePage());
    expect(document.querySelector("[data-intro]")).toBeInTheDocument();
    unmount();

    cookieGet.mockReturnValue({ value: String(now) });
    render(await HomePage());
    expect(document.querySelector("[data-intro]")).not.toBeInTheDocument();
  });
});

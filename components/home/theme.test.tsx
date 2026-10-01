import { render, screen, within, fireEvent } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "@/app/layout";
import { Storefront } from "@/app/page";
import { themeCookieName, themeFromCookie } from "@/lib/theme-cookie";

jest.mock("next/font/google", () => ({
  Geist: () => ({ className: "font-geist" }),
  Archivo: () => ({ variable: "font-archivo" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex" }),
}));

const cookieGet = jest.fn();

jest.mock("next/headers", () => ({
  cookies: async () => ({
    get: cookieGet,
  }),
}));

function namesIn(header: HTMLElement) {
  return within(header)
    .getAllByRole("button")
    .map((button) => button.getAttribute("aria-label") ?? button.textContent);
}

describe("REQ-005 theme switch", () => {
  beforeEach(() => {
    cookieGet.mockReset();
    cookieGet.mockReturnValue(undefined);
    delete document.documentElement.dataset.theme;
    document.cookie = `${themeCookieName}=; Path=/; Max-Age=0`;
  });

  it("REQ-005 names the switch for the theme it will turn on", () => {
    const { rerender } = render(<Storefront showIntro={false} theme="light" />);
    const darkSwitch = screen.getByRole("button", { name: "Dark" });
    expect(darkSwitch).toHaveClass("rounded-full");
    expect(darkSwitch.querySelector('img[src="/brand/crue-mark-white.png"]')).toBeTruthy();
    expect(darkSwitch.querySelector('img[src="/brand/crue-mark-black.png"]')).toBeTruthy();

    rerender(<Storefront showIntro={false} theme="dark" />);
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
  });

  it("REQ-005 places the circle switch in the footer", () => {
    render(<Storefront showIntro={false} />);

    const footer = screen.getByRole("contentinfo");
    const switchButton = within(footer).getByRole("button", { name: "Dark" });
    expect(switchButton).toHaveClass("size-11", "rounded-full");
    expect(switchButton.querySelector(".theme-slice")).toBeTruthy();

    const desktop = screen.getByRole("navigation", { name: "Main" }).closest("header");
    const mobile = screen.getByRole("button", { name: "Menu" }).closest("header");
    expect(namesIn(desktop as HTMLElement)).toEqual(["Search", "Account", "BAG (0)"]);
    expect(namesIn(mobile as HTMLElement)).toEqual(["Menu", "Search", "Bag, 0 items"]);

    const css = require("node:fs").readFileSync(
      require("node:path").join(process.cwd(), "app/globals.css"),
      "utf8",
    );
    expect(css).toMatch(/\.theme-slice\s*\{[^}]*clip-path:\s*polygon\(100% 0, 100% 100%, 0 100%\)/);
    expect(css).toMatch(/\.theme-slice\s*\{[^}]*transition:\s*transform/);
    expect(css).toMatch(/\.theme-slice-cut\s*\{[^}]*rotate\(180deg\)/);
    expect(css).toMatch(/\.theme-slice-cut \.theme-slice-mark\s*\{[^}]*rotate\(-180deg\)/);
    expect(css).not.toMatch(/\.group:hover \.theme-slice/);
    expect(css).toMatch(/prefers-reduced-motion[\s\S]*\.theme-slice,[\s\S]*transition:\s*none/);
  });

  it("REQ-005 switches theme and keeps it on the next load", async () => {
    render(<Storefront showIntro={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Dark" }));

    expect(document.cookie).toContain(`${themeCookieName}=dark`);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByRole("button", { name: "Light" }).querySelector(".theme-slice")).toHaveClass(
      "theme-slice-cut",
    );

    fireEvent.click(screen.getByRole("button", { name: "Light" }));

    expect(document.cookie).toContain(`${themeCookieName}=light`);
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();

    cookieGet.mockImplementation((name: string) =>
      name === themeCookieName ? { value: "dark" } : undefined,
    );
    const html = renderToStaticMarkup(await RootLayout({ children: <div /> }));
    expect(html).toContain('data-theme="dark"');
  });

  it("REQ-005 defaults to light", async () => {
    expect(themeFromCookie(undefined)).toBe("light");
    expect(themeFromCookie("nope")).toBe("light");

    const html = renderToStaticMarkup(await RootLayout({ children: <div /> }));
    expect(html).not.toContain('data-theme="dark"');
    render(<Storefront showIntro={false} />);
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });

  it("REQ-005 keeps the intro dark in both themes", () => {
    const { rerender } = render(<Storefront showIntro theme="light" />);
    expect(document.querySelector("[data-intro]")).toHaveClass("bg-bg-intro");

    rerender(<Storefront showIntro theme="dark" />);
    expect(document.querySelector("[data-intro]")).toHaveClass("bg-bg-intro");
  });
});

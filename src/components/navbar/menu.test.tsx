import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { menuLink } from "@/components/navbar/menu";
import { themeCookieName } from "@/lib/theme-cookie";

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  return screen.getByRole("dialog", { name: "Menu" });
}

describe("REQ-020 mobile menu", () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
    document.cookie = `${themeCookieName}=; Path=/; Max-Age=0`;
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    document.cookie = `${themeCookieName}=; Path=/; Max-Age=0`;
  });

  it("REQ-020 opens the phone menu and hides it on desktop", () => {
    render(<Storefront showIntro={false} />);
    const address = window.location.href;
    const menuButton = screen.getByRole("button", { name: "Menu" });
    const desktop = screen.getByRole("navigation", { name: "Main" }).closest("header");

    expect(menuButton.closest("header")).toHaveClass("md:hidden");
    expect(within(desktop as HTMLElement).queryByRole("button", { name: "Menu" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();

    const dialog = openMenu();

    expect(dialog).toHaveClass("fixed", "inset-0", "menu-panel", "md:hidden");
    expect(dialog.className).toContain("[&_button]:cursor-pointer");
    expect(dialog.className).toContain("[&_a]:cursor-pointer");
    expect(dialog.querySelector("[data-scrim]")).toBeNull();
    expect(within(dialog).getByRole("navigation", { name: "Main" }).textContent?.replace(/\s+/g, "")).toBe(
      "ShopRunTrainDropsAbout",
    );
    expect(within(dialog).getByRole("navigation", { name: "Help" }).textContent?.replace(/\s+/g, "")).toBe(
      "AccountShipping&returnsSizeguideContact",
    );
    expect(within(dialog).getByText("Theme")).toBeInTheDocument();
    expect(within(dialog).getByRole("group", { name: "Theme" })).toBeInTheDocument();
    expect(within(dialog).getByText("Instagram")).toBeInTheDocument();
    expect(within(dialog).getByText("Strava")).toBeInTheDocument();
    expect(within(dialog).getByText("TikTok")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bag, 0 items" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();
    expect(window.location.href).toBe(address);
    expect(within(dialog).getByRole("button", { name: "Close menu" })).toHaveFocus();
  });

  it("REQ-020 navigates Shop, Run, Train, Drops, and About", () => {
    render(<Storefront showIntro={false} />);
    const go = jest.spyOn(menuLink, "go").mockImplementation(() => undefined);
    const expected = [
      ["Shop", "/catalog"],
      ["Run", "/catalog"],
      ["Train", "/catalog"],
      ["Drops", "/"],
      ["About", "/about"],
    ] as const;

    for (const [label, href] of expected) {
      const dialog = openMenu();
      const link = within(dialog).getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);

      fireEvent.click(link);

      expect(go).toHaveBeenCalledWith(href);
      expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    }

    go.mockRestore();
  });

  it("REQ-020 opens policies and the size guide", () => {
    render(<Storefront showIntro={false} />);
    const address = window.location.href;
    const go = jest.spyOn(menuLink, "go").mockImplementation(() => undefined);

    for (const label of ["Shipping & returns", "Contact"]) {
      const dialog = openMenu();
      const link = within(dialog).getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", "/policies/shipping");

      fireEvent.click(link);

      expect(go).toHaveBeenCalledWith("/policies/shipping");
      expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    }

    const dialog = openMenu();
    fireEvent.click(within(dialog).getByRole("button", { name: "Size guide" }));

    const guide = screen.getByRole("dialog", { name: "Size guide" });
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    expect(guide).toHaveClass("size-guide-panel");
    expect(within(guide).getByRole("tab", { name: "Tops" })).toHaveAttribute("aria-selected", "true");
    expect(within(guide).getByRole("button", { name: "cm" })).toHaveAttribute("aria-pressed", "true");
    expect(go).toHaveBeenCalledTimes(2);
    expect(window.location.href).toBe(address);
    go.mockRestore();
  });

  it("REQ-020 does not navigate for the social labels", () => {
    render(<Storefront showIntro={false} />);
    const address = window.location.href;
    const go = jest.spyOn(menuLink, "go").mockImplementation(() => undefined);
    const dialog = openMenu();

    for (const label of ["Instagram", "Strava", "TikTok"]) {
      const social = within(dialog).getByText(label);
      expect(social.tagName).toBe("SPAN");
      expect(social).not.toHaveAttribute("href");
      expect(within(dialog).queryByRole("link", { name: label })).not.toBeInTheDocument();
      fireEvent.click(social);
    }

    expect(go).not.toHaveBeenCalled();
    expect(window.location.href).toBe(address);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    go.mockRestore();
  });

  it("REQ-020 switches theme and closes the menu", () => {
    const dark = render(<Storefront showIntro={false} theme="dark" />);
    const darkMenu = openMenu();
    expect(within(darkMenu).getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
    expect(within(darkMenu).getByRole("button", { name: "Dark" })).toHaveClass("bg-text", "text-bg");
    dark.unmount();

    render(<Storefront showIntro={false} />);
    const address = window.location.href;
    const dialog = openMenu();
    const footer = screen.getByRole("contentinfo");
    const close = within(dialog).getByRole("button", { name: "Close menu" });

    expect(within(dialog).getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "true");
    expect(within(dialog).getByRole("button", { name: "Light" })).toHaveClass("bg-text", "text-bg");
    expect(within(footer).getByRole("button", { name: "Dark" })).toHaveClass("rounded-full");
    expect(close).toHaveFocus();

    within(dialog).getByRole("button", { name: "Light" }).focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    fireEvent.click(within(dialog).getByRole("button", { name: "Dark" }));

    expect(document.cookie).toContain(`${themeCookieName}=dark`);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
    expect(within(dialog).getByRole("button", { name: "Dark" })).toHaveClass("bg-text", "text-bg");
    expect(within(dialog).getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "false");
    expect(within(footer).getByRole("button", { name: "Light" })).toHaveClass("rounded-full");

    fireEvent.click(within(dialog).getByRole("button", { name: "Light" }));

    expect(document.cookie).toContain(`${themeCookieName}=light`);
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(within(dialog).getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();

    fireEvent.click(close);
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    expect(window.location.href).toBe(address);

    openMenu();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    expect(window.location.href).toBe(address);
    expect(document.querySelector("[data-scrim]")).toBeNull();

    const sheet = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const reduced = sheet.slice(sheet.indexOf("prefers-reduced-motion"));
    expect(sheet).toMatch(/@keyframes menu-in \{[\s\S]*?opacity: 0;[\s\S]*?transform: translateY\(-16px\);/);
    expect(sheet).toMatch(/\.menu-panel\s*\{[^}]*menu-in 0\.45s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(sheet).toMatch(/\.menu-panel-out\s*\{[^}]*menu-out 0\.35s cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
    expect(reduced).toContain(".menu-panel");
    expect(reduced).toMatch(/animation:\s*none/);
  });
});

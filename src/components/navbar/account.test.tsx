import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Storefront } from "@/app/page";
import { menuLink } from "@/components/navbar/menu";

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  return screen.getByRole("dialog", { name: "Menu" });
}

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") ? [full] : [];
  });
}

describe("REQ-024 account control", () => {
  it("REQ-024 does not navigate from the header Account control", () => {
    render(<Storefront showIntro={false} />);
    const address = window.location.href;
    const go = jest.spyOn(menuLink, "go").mockImplementation(() => undefined);
    const account = screen.getByRole("button", { name: "Account" });

    expect(account.tagName).toBe("BUTTON");
    expect(account.closest("a")).toBeNull();
    expect(account).not.toHaveAttribute("href");

    fireEvent.click(account);

    expect(window.location.href).toBe(address);
    expect(go).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Bag" })).not.toBeInTheDocument();
    go.mockRestore();
  });

  it("REQ-024 does not navigate from the menu Account row", () => {
    render(<Storefront showIntro={false} />);
    const address = window.location.href;
    const go = jest.spyOn(menuLink, "go").mockImplementation(() => undefined);
    const dialog = openMenu();
    const account = within(dialog).getByRole("button", { name: "Account" });

    expect(account.tagName).toBe("BUTTON");
    expect(account.closest("a")).toBeNull();
    expect(account).not.toHaveAttribute("href");

    fireEvent.click(account);

    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    expect(window.location.href).toBe(address);
    expect(go).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "Bag" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Search" })).not.toBeInTheDocument();
    go.mockRestore();
  });

  it("REQ-024 does not add an account route", () => {
    expect(fs.existsSync(path.join(process.cwd(), "src/app/account"))).toBe(false);

    const linked = sourceFiles(path.join(process.cwd(), "src"))
      .filter((file) => !file.endsWith(`${path.sep}account.test.tsx`))
      .filter((file) => /#account|["'`]\/account["'`]/.test(fs.readFileSync(file, "utf8")));

    expect(linked).toEqual([]);

    const navbar = fs.readFileSync(path.join(process.cwd(), "src/components/navbar/navbar.tsx"), "utf8");
    const menu = fs.readFileSync(path.join(process.cwd(), "src/components/navbar/menu.tsx"), "utf8");

    expect(navbar).toMatch(/<button type="button" aria-label="Account"/);
    expect(menu).toMatch(/<button[\s\S]*?type="button"[\s\S]*?>\s*Account\s*<\/button>/);
  });
});

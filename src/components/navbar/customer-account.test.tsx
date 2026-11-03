import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { AccountUrlProvider } from "@/components/account-url";
import { Storefront } from "@/app/page";
import { accountLink, customerAccountUrl } from "@/lib/customer-account";

const destination = "https://crue-dev.myshopify.com/account";

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  return screen.getByRole("dialog", { name: "Menu" });
}

function renderStore() {
  return render(
    <AccountUrlProvider url={destination}>
      <Storefront showIntro={false} />
    </AccountUrlProvider>,
  );
}

describe("REQ-033 customer account", () => {
  it("REQ-033 sends the header Account control to Shopify customer accounts", () => {
    expect(customerAccountUrl("https://crue-dev.myshopify.com/")).toBe(destination);
    expect(customerAccountUrl("")).toBe("");

    renderStore();
    const go = jest.spyOn(accountLink, "go").mockImplementation(() => undefined);
    const account = screen.getByRole("button", { name: "Account" });

    expect(account.closest("a")).toBeNull();
    fireEvent.click(account);

    expect(go).toHaveBeenCalledWith(destination);
    expect(window.location.pathname.endsWith("account")).toBe(false);
    go.mockRestore();
  });

  it("REQ-033 sends the menu Account row to Shopify customer accounts", () => {
    renderStore();
    const go = jest.spyOn(accountLink, "go").mockImplementation(() => undefined);
    const dialog = openMenu();

    fireEvent.click(within(dialog).getByRole("button", { name: "Account" }));

    expect(go).toHaveBeenCalledWith(destination);
    expect(window.location.pathname.endsWith("account")).toBe(false);
    go.mockRestore();
  });

  it("REQ-033 does not add a local account page", () => {
    expect(fs.existsSync(path.join(process.cwd(), "src/app/account"))).toBe(false);
    const page = fs.readFileSync(path.join(process.cwd(), "src/components/navbar/navbar.tsx"), "utf8");
    const menu = fs.readFileSync(path.join(process.cwd(), "src/components/navbar/menu.tsx"), "utf8");

    expect(page).not.toMatch(/href=["']\/account["']/);
    expect(menu).not.toMatch(/href=["']\/account["']/);
    expect(page).not.toMatch(/type=["']password["']/);
    expect(menu).not.toMatch(/type=["']password["']/);
  });
});

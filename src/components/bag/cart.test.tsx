import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { checkoutLink, forgetBagMemory } from "@/components/bag/bag";
import { Storefront } from "@/app/page";
import { Product } from "@/components/product/product";
import { memoryCartClient, requestCartCreate, setCartClient, type CartClient, type CartItem } from "@/lib/cart";
import { productByHandle } from "@/lib/catalog";

const variantId = "gid://shopify/ProductVariant/1";

function renderJacket() {
  return render(<Product product={productByHandle("horizon-shell-jacket")!} />);
}

function addMedium() {
  fireEvent.click(screen.getAllByRole("button", { name: "Add to bag, M" })[0]);
}

describe("REQ-026 storefront cart", () => {
  it("REQ-026 adds a variant to the Storefront cart", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          cartCreate: {
            cart: {
              id: "gid://shopify/Cart/1",
              checkoutUrl: "https://crue-dev.myshopify.com/cart/c/1",
              cost: { subtotalAmount: { amount: "189000.0" } },
              lines: {
                nodes: [
                  {
                    id: "gid://shopify/CartLine/1",
                    quantity: 1,
                    cost: { totalAmount: { amount: "189000.0" } },
                    merchandise: {
                      id: variantId,
                      price: { amount: "189000.0" },
                      selectedOptions: [
                        { name: "Color", value: "Void Black" },
                        { name: "Size", value: "M" },
                      ],
                      image: { url: "https://cdn.shopify.com/horizon.jpg", altText: "Front" },
                      product: { title: "Horizon Shell Jacket" },
                    },
                  },
                ],
              },
            },
            userErrors: [],
          },
        },
      }),
    });

    process.env.SHOPIFY_STORE_DOMAIN = "crue-dev.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "public-token";
    const item: CartItem = {
      variantId,
      title: "Horizon Shell Jacket",
      colour: "Void Black",
      size: "M",
      amount: "189000.0",
    };
    const cart = await requestCartCreate(item, fetchImpl as unknown as typeof fetch);
    const body = JSON.parse(String(fetchImpl.mock.calls[0][1].body)) as {
      query: string;
      variables: { merchandiseId: string };
    };

    expect(body.variables.merchandiseId).toBe(variantId);
    expect(body.query).toMatch(/cartCreate/);
    expect(body.query).toMatch(/checkoutUrl/);
    expect(cart).toMatchObject({
      id: "gid://shopify/Cart/1",
      checkoutUrl: "https://crue-dev.myshopify.com/cart/c/1",
      subtotal: "189000.0",
      lines: [{ variantId, title: "Horizon Shell Jacket", colour: "Void Black", size: "M", quantity: 1, amount: "189000.0" }],
    });

    renderJacket();
    addMedium();

    const line = screen.getByRole("listitem");
    expect(line).toHaveTextContent("Horizon Shell Jacket");
    expect(line).toHaveTextContent("Void Black / M");
    expect(screen.getByRole("dialog", { name: "Bag" })).toBeInTheDocument();
  });

  it("REQ-026 keeps the cart across refresh and leaves the drawer closed", () => {
    const view = renderJacket();
    addMedium();
    expect(screen.getByRole("dialog", { name: "Bag" })).toBeInTheDocument();

    view.unmount();
    forgetBagMemory();
    render(<Storefront showIntro={false} />);

    expect(screen.queryByRole("dialog", { name: "Bag" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BAG (1)" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "BAG (1)" }));
    expect(screen.getByRole("listitem")).toHaveTextContent("Void Black / M");
  });

  it("REQ-026 updates quantity and remove", () => {
    renderJacket();
    addMedium();
    const line = () => screen.getByRole("listitem");

    fireEvent.click(within(line()).getByRole("button", { name: "Increase quantity" }));
    expect(within(line()).getByText("2")).toBeInTheDocument();

    fireEvent.click(within(line()).getByRole("button", { name: "Decrease quantity" }));
    expect(within(line()).getByText("1")).toBeInTheDocument();

    fireEvent.click(within(line()).getByRole("button", { name: "Remove" }));
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
  });

  it("REQ-026 sends Checkout to checkoutUrl", () => {
    const go = jest.spyOn(checkoutLink, "go").mockImplementation(() => undefined);
    renderJacket();
    addMedium();

    fireEvent.click(screen.getByRole("button", { name: "Checkout" }));

    expect(go).toHaveBeenCalledWith("https://checkout.shopify.com/cart");
    expect(fs.readdirSync(path.join(process.cwd(), "src/app"), { recursive: true }).join("\n")).not.toMatch(
      /checkout\/page\.tsx/,
    );
    go.mockRestore();
  });

  it("REQ-026 does not navigate when checkout is unavailable", () => {
    const go = jest.spyOn(checkoutLink, "go").mockImplementation(() => undefined);
    const home = render(<Storefront showIntro={false} />);
    fireEvent.click(screen.getByRole("button", { name: "BAG (0)" }));

    expect(screen.queryByRole("button", { name: "Checkout" })).not.toBeInTheDocument();
    expect(go).not.toHaveBeenCalled();
    home.unmount();
    forgetBagMemory();

    const failing: CartClient = {
      create() {
        return null;
      },
      linesAdd() {
        return null;
      },
      linesUpdate() {
        return null;
      },
      linesRemove() {
        return null;
      },
    };
    setCartClient(failing);
    renderJacket();
    addMedium();

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(go).not.toHaveBeenCalled();
    setCartClient(memoryCartClient);
    go.mockRestore();
  });

  it("REQ-026 drops a line Shopify has already removed", async () => {
    renderJacket();
    addMedium();
    expect(screen.getByRole("listitem")).toBeInTheDocument();

    setCartClient({
      create: memoryCartClient.create,
      linesAdd: memoryCartClient.linesAdd,
      linesUpdate() {
        return null;
      },
      linesRemove() {
        return null;
      },
      fetchCart(cartId) {
        return Promise.resolve({
          id: cartId,
          checkoutUrl: "https://checkout.shopify.com/cart",
          subtotal: "",
          lines: [],
        });
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
  });
});

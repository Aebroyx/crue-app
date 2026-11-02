import { optionName, storefrontGraphql } from "@/lib/storefront";

export type CartItem = {
  variantId: string;
  title: string;
  colour: string;
  size: string;
  amount: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type CartLine = CartItem & {
  id: string;
  quantity: number;
};

export type CartSnapshot = {
  id: string;
  checkoutUrl: string;
  subtotal: string;
  lines: CartLine[];
};

export type CartClient = {
  create(item: CartItem): CartSnapshot | Promise<CartSnapshot | null> | null;
  linesAdd(cartId: string, item: CartItem): CartSnapshot | Promise<CartSnapshot | null> | null;
  linesUpdate(cartId: string, lineId: string, quantity: number): CartSnapshot | Promise<CartSnapshot | null> | null;
  linesRemove(cartId: string, lineId: string): CartSnapshot | Promise<CartSnapshot | null> | null;
  fetchCart?(cartId: string): Promise<CartSnapshot | null>;
};

const cartFields = `
  id
  checkoutUrl
  cost {
    subtotalAmount {
      amount
    }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      cost {
        totalAmount {
          amount
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          price {
            amount
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
          product {
            title
          }
        }
      }
    }
  }
`;

type CartPayload = {
  data?: {
    cartCreate?: { cart?: RawCart | null; userErrors?: { message: string }[] };
    cartLinesAdd?: { cart?: RawCart | null; userErrors?: { message: string }[] };
    cartLinesUpdate?: { cart?: RawCart | null; userErrors?: { message: string }[] };
    cartLinesRemove?: { cart?: RawCart | null; userErrors?: { message: string }[] };
    cart?: RawCart | null;
  } | null;
};

type RawCart = {
  id: string;
  checkoutUrl?: string | null;
  cost?: { subtotalAmount?: { amount?: string | null } | null } | null;
  lines?: {
    nodes?: {
      id: string;
      quantity: number;
      cost?: { totalAmount?: { amount?: string | null } | null } | null;
      merchandise?: {
        id?: string;
        price?: { amount?: string | null } | null;
        selectedOptions?: { name: string; value: string }[];
        image?: { url?: string | null; altText?: string | null } | null;
        product?: { title?: string | null } | null;
      } | null;
    }[];
  } | null;
};

export function mapCart(cart: RawCart | null | undefined): CartSnapshot | null {
  if (!cart?.id || !cart.checkoutUrl) return null;
  const lines = (cart.lines?.nodes ?? []).flatMap((line) => {
    const merchandise = line.merchandise;
    if (!merchandise?.id) return [];
    const selected = Object.fromEntries(
      (merchandise.selectedOptions ?? []).map((option) => [optionName(option.name), option.value]),
    );
    return [
      {
        id: line.id,
        variantId: merchandise.id,
        title: merchandise.product?.title ?? "",
        colour: selected.Colour ?? "",
        size: selected.Size ?? "",
        quantity: line.quantity,
        amount: line.cost?.totalAmount?.amount ?? merchandise.price?.amount ?? "",
        imageUrl: merchandise.image?.url || undefined,
        imageAlt: merchandise.image?.altText ?? "",
      },
    ];
  });

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    subtotal: cart.cost?.subtotalAmount?.amount ?? "",
    lines,
  };
}

function snapshotFrom(payload: CartPayload | null, key: "cartCreate" | "cartLinesAdd" | "cartLinesUpdate" | "cartLinesRemove") {
  const result = payload?.data?.[key];
  if (!result || (result.userErrors && result.userErrors.length > 0)) return null;
  return mapCart(result.cart);
}

export async function requestCartCreate(item: CartItem, fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<CartPayload>(
    `mutation CartCreate($merchandiseId: ID!, $quantity: Int!) {
      cartCreate(input: { lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }] }) {
        cart { ${cartFields} }
        userErrors { message }
      }
    }`,
    { merchandiseId: item.variantId, quantity: 1 },
    fetchImpl,
  );
  return snapshotFrom(payload, "cartCreate");
}

export async function requestCartLinesAdd(cartId: string, item: CartItem, fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<CartPayload>(
    `mutation CartLinesAdd($cartId: ID!, $merchandiseId: ID!, $quantity: Int!) {
      cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }]) {
        cart { ${cartFields} }
        userErrors { message }
      }
    }`,
    { cartId, merchandiseId: item.variantId, quantity: 1 },
    fetchImpl,
  );
  return snapshotFrom(payload, "cartLinesAdd");
}

export async function requestCartLinesUpdate(
  cartId: string,
  lineId: string,
  quantity: number,
  fetchImpl: typeof fetch = fetch,
) {
  const payload = await storefrontGraphql<CartPayload>(
    `mutation CartLinesUpdate($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
        cart { ${cartFields} }
        userErrors { message }
      }
    }`,
    { cartId, lineId, quantity },
    fetchImpl,
  );
  return snapshotFrom(payload, "cartLinesUpdate");
}

export async function requestCartLinesRemove(cartId: string, lineId: string, fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<CartPayload>(
    `mutation CartLinesRemove($cartId: ID!, $lineId: ID!) {
      cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
        cart { ${cartFields} }
        userErrors { message }
      }
    }`,
    { cartId, lineId },
    fetchImpl,
  );
  return snapshotFrom(payload, "cartLinesRemove");
}

export async function requestCart(cartId: string, fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<CartPayload>(
    `query Cart($cartId: ID!) {
      cart(id: $cartId) { ${cartFields} }
    }`,
    { cartId },
    fetchImpl,
  );
  return mapCart(payload?.data?.cart);
}

export const shopifyCartClient: CartClient = {
  create: (item) => import("@/lib/cart-api").then((api) => api.createCart(item)),
  linesAdd: (cartId, item) => import("@/lib/cart-api").then((api) => api.addCartLine(cartId, item)),
  linesUpdate: (cartId, lineId, quantity) =>
    import("@/lib/cart-api").then((api) => api.updateCartLine(cartId, lineId, quantity)),
  linesRemove: (cartId, lineId) => import("@/lib/cart-api").then((api) => api.removeCartLine(cartId, lineId)),
  fetchCart: (cartId) => import("@/lib/cart-api").then((api) => api.fetchCart(cartId)),
};

const memoryCarts = new Map<string, CartSnapshot>();
let memorySequence = 0;

export function resetMemoryCart() {
  memoryCarts.clear();
  memorySequence = 0;
}

function remember(cart: CartSnapshot) {
  memoryCarts.set(cart.id, cart);
  return cart;
}

function lineFrom(item: CartItem, quantity = 1): CartLine {
  memorySequence += 1;
  return { ...item, id: `line-${memorySequence}`, quantity };
}

export const memoryCartClient: CartClient = {
  create(item) {
    return remember({
      id: `cart-${memorySequence + 1}`,
      checkoutUrl: "https://checkout.shopify.com/cart",
      subtotal: "[SUBTOTAL]",
      lines: [lineFrom(item)],
    });
  },
  linesAdd(cartId, item) {
    const cart = memoryCarts.get(cartId);
    if (!cart) return null;
    const existing = cart.lines.find((line) => line.variantId === item.variantId);
    const lines = existing
      ? cart.lines.map((line) => (line.variantId === item.variantId ? { ...line, quantity: line.quantity + 1 } : line))
      : [...cart.lines, lineFrom(item)];
    return remember({ ...cart, lines });
  },
  linesUpdate(cartId, lineId, quantity) {
    const cart = memoryCarts.get(cartId);
    if (!cart) return null;
    return remember({
      ...cart,
      lines: cart.lines.map((line) => (line.id === lineId ? { ...line, quantity } : line)),
    });
  },
  linesRemove(cartId, lineId) {
    const cart = memoryCarts.get(cartId);
    if (!cart) return null;
    return remember({ ...cart, lines: cart.lines.filter((line) => line.id !== lineId) });
  },
};

let client: CartClient = shopifyCartClient;

export function setCartClient(next: CartClient) {
  client = next;
}

export function cartClient() {
  return client;
}

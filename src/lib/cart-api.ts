"use server";

import {
  requestCart,
  requestCartCreate,
  requestCartLinesAdd,
  requestCartLinesRemove,
  requestCartLinesUpdate,
  type CartItem,
} from "@/lib/cart";

export async function createCart(item: CartItem) {
  return requestCartCreate(item);
}

export async function addCartLine(cartId: string, item: CartItem) {
  return requestCartLinesAdd(cartId, item);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  return requestCartLinesUpdate(cartId, lineId, quantity);
}

export async function removeCartLine(cartId: string, lineId: string) {
  return requestCartLinesRemove(cartId, lineId);
}

export async function fetchCart(cartId: string) {
  return requestCart(cartId);
}

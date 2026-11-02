"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { ProductImage } from "@/components/product-image/product-image";
import { cartClient, type CartItem, type CartLine, type CartSnapshot } from "@/lib/cart";

export type BagLine = CartLine;

type BagState = {
  cartId: string;
  checkoutUrl: string;
  subtotal: string;
  lines: BagLine[];
  open: boolean;
};

const storageKey = "crue-cart";
const emptyState: BagState = { cartId: "", checkoutUrl: "", subtotal: "", lines: [], open: false };

let state: BagState = { ...emptyState };
let hydrated = false;
let busy = false;
const waiters: Array<() => void> = [];
const listeners = new Set<() => void>();

function readStored(): Omit<BagState, "open"> {
  if (typeof sessionStorage === "undefined") return emptyState;
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<BagState>;
    if (!parsed || !Array.isArray(parsed.lines)) return emptyState;
    return {
      cartId: parsed.cartId ?? "",
      checkoutUrl: parsed.checkoutUrl ?? "",
      subtotal: parsed.subtotal ?? "",
      lines: parsed.lines,
    };
  } catch {
    return emptyState;
  }
}

function commit(next: BagState) {
  state = next;
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        subtotal: state.subtotal,
        lines: state.lines,
      }),
    );
  }
  listeners.forEach((listener) => listener());
}

function clone(value: BagState): BagState {
  return JSON.parse(JSON.stringify(value)) as BagState;
}

function fromCart(cart: CartSnapshot, open: boolean): BagState {
  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    subtotal: cart.subtotal,
    lines: cart.lines,
    open,
  };
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T>)?.then === "function";
}

function release() {
  const next = waiters.shift();
  if (next) next();
  else busy = false;
}

function enqueue<T>(task: () => T | Promise<T>): T | Promise<T> {
  if (!busy) {
    busy = true;
    try {
      const result = task();
      if (isPromise(result)) return result.finally(release);
      release();
      return result;
    } catch (error) {
      release();
      throw error;
    }
  }
  return new Promise((resolve, reject) => {
    waiters.push(() => {
      try {
        const result = task();
        if (isPromise(result)) result.then(resolve, reject).finally(release);
        else {
          resolve(result);
          release();
        }
      } catch (error) {
        reject(error);
        release();
      }
    });
  });
}

async function restore(previous: BagState, open: boolean) {
  const fetchCart = cartClient().fetchCart;
  if (state.cartId && fetchCart) {
    try {
      const fresh = await fetchCart(state.cartId);
      if (fresh) {
        commit(fromCart(fresh, open));
        return false;
      }
    } catch {
      // The saved lines stay when the cart cannot be read back.
    }
  }
  commit(previous);
  return false;
}

function settle(
  previous: BagState,
  result: CartSnapshot | Promise<CartSnapshot | null> | null,
  open: boolean,
): boolean | Promise<boolean> {
  if (isPromise(result)) {
    return result
      .then((cart) => {
        if (!cart) return restore(previous, open);
        commit(fromCart(cart, open));
        return true;
      })
      .catch(() => restore(previous, open));
  }
  if (!result) return restore(previous, open);
  commit(fromCart(result, open));
  return true;
}

export function resetBag() {
  hydrated = false;
  busy = false;
  waiters.length = 0;
  state = { ...emptyState };
  if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(storageKey);
  listeners.forEach((listener) => listener());
}

export function forgetBagMemory() {
  hydrated = false;
  state = { ...emptyState };
  listeners.forEach((listener) => listener());
}

export function addLine(item: CartItem) {
  return enqueue(() => {
    const previous = clone(state);
    const result = state.cartId ? cartClient().linesAdd(state.cartId, item) : cartClient().create(item);
    return settle(previous, result, true);
  });
}

function changeQuantity(id: string, next: number) {
  return enqueue(() => {
    const previous = clone(state);
    const quantity = Math.max(1, next);
    if (!state.cartId) return false;
    const result = cartClient().linesUpdate(state.cartId, id, quantity);
    return settle(previous, result, state.open);
  });
}

function removeLine(id: string) {
  return enqueue(() => {
    const previous = clone(state);
    if (!state.cartId) return false;
    const result = cartClient().linesRemove(state.cartId, id);
    return settle(previous, result, state.open);
  });
}

export function useBag() {
  const [snapshot, setSnapshot] = useState(state);

  useEffect(() => {
    if (!hydrated) {
      state = { ...readStored(), open: false };
      hydrated = true;
    }
    const sync = () => setSnapshot({ ...state });
    listeners.add(sync);
    sync();
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const count = snapshot.lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    lines: snapshot.lines,
    open: snapshot.open,
    subtotal: snapshot.subtotal,
    count,
    add: addLine,
    openBag: () => commit({ ...state, open: true }),
    closeBag: () => commit({ ...state, open: false }),
    increase: (id: string) => {
      const line = state.lines.find((item) => item.id === id);
      if (line) changeQuantity(id, line.quantity + 1);
    },
    decrease: (id: string) => {
      const line = state.lines.find((item) => item.id === id);
      if (line) changeQuantity(id, line.quantity - 1);
    },
    remove: removeLine,
  };
}

export const checkoutLink = {
  go(href: string) {
    window.location.assign(href);
  },
};

function checkout() {
  if (state.lines.length === 0 || !state.checkoutUrl) return;
  checkoutLink.go(state.checkoutUrl);
}

export const catalogLink = {
  go(href: string) {
    window.location.assign(href);
  },
};

function prefersReducedMotion() {
  if (typeof window.matchMedia !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Bag() {
  const bag = useBag();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(bag.closeBag);
  const [closing, setClosing] = useState(false);

  closeRef.current = bag.closeBag;

  function dismiss() {
    if (prefersReducedMotion()) {
      closeRef.current();
      return;
    }
    setClosing(true);
  }

  useEffect(() => {
    if (!bag.open) {
      setClosing(false);
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const nodes = [...dialog.querySelectorAll<HTMLElement>("button, a")];
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [bag.open]);

  if (!bag.open) return null;

  const filled = bag.lines.length > 0;

  return (
    <div className="fixed inset-0 z-40 flex justify-end font-[family-name:var(--font-benzin)] text-text">
      <div
        data-scrim
        className={`bag-scrim absolute inset-0 bg-[rgba(28,28,26,0.38)] dark:bg-[rgba(5,5,6,0.72)] ${closing ? "bag-scrim-out" : ""}`}
        onClick={dismiss}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Bag"
        tabIndex={-1}
        onAnimationEnd={(event) => {
          if (event.animationName === "bag-out") closeRef.current();
        }}
        className={`bag-panel relative flex h-full w-full flex-col bg-bg outline-none md:w-[460px] md:border-l md:border-line ${closing ? "bag-panel-out" : ""}`}
      >
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line pr-2 pl-5 md:h-[72px] md:pl-7">
          <h2 className="text-[18px] font-extrabold uppercase">Bag ({bag.count})</h2>
          <button type="button" aria-label="Close bag" onClick={dismiss} className="flex size-11 items-center justify-center">
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <p className="shrink-0 bg-surface px-5 py-3 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] text-text-2 uppercase md:px-7">
          Free shipping over [THRESHOLD]
        </p>
        {filled ? (
          <>
            <ul className="min-h-0 flex-1 list-none overflow-y-auto px-5 md:px-7">
              {bag.lines.map((line) => (
                <li key={line.id} className="flex gap-4 border-b border-line py-6">
                  <ProductImage
                    src={line.imageUrl}
                    alt={line.imageAlt ?? ""}
                    className="h-32 w-24 shrink-0"
                    markClassName="h-[15px] w-11 opacity-10"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[13px] font-bold tracking-[0.04em] uppercase">{line.title}</span>
                      <span className="font-[family-name:var(--font-plex)] text-[13px] whitespace-nowrap">{line.amount}</span>
                    </div>
                    <span className="text-[13px] text-muted">
                      {line.colour} / {line.size}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div role="group" aria-label="Quantity" className="flex border border-control-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => bag.decrease(line.id)}
                          className="flex size-10 items-center justify-center text-[16px]"
                        >
                          −
                        </button>
                        <span className="flex w-9 items-center justify-center font-[family-name:var(--font-plex)] text-[13px]">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => bag.increase(line.id)}
                          className="flex size-10 items-center justify-center text-[16px]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => bag.remove(line.id)}
                        className="h-10 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] text-muted uppercase underline underline-offset-[5px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex shrink-0 flex-col gap-3 border-t border-line px-5 pt-5 pb-7 md:px-7">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-bold tracking-[0.1em] uppercase">Subtotal</span>
                <span className="font-[family-name:var(--font-plex)] text-[14px]">{bag.subtotal}</span>
              </div>
              <p className="text-[13px] text-muted">Shipping and taxes are calculated at checkout.</p>
              <button
                type="button"
                onClick={checkout}
                className="flex h-[60px] w-full items-center justify-between bg-text px-6 text-[12px] font-bold tracking-[0.12em] text-bg uppercase active:scale-[0.98]"
              >
                <span>Checkout</span>
                <ArrowRight className="size-[18px]" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center md:px-7">
            <img src="/brand/crue-mark-white.png" alt="" className="hidden h-10 w-[120px] opacity-25 dark:block" />
            <img src="/brand/crue-mark-black.png" alt="" className="h-10 w-[120px] opacity-25 dark:hidden" />
            <p className="text-[22px] font-extrabold uppercase">Your bag is empty</p>
            <p className="text-[14px] text-text-2">Nothing pulled in yet.</p>
            <a
              href="/catalog"
              onClick={(event) => {
                event.preventDefault();
                closeRef.current();
                catalogLink.go("/catalog");
              }}
              className="flex h-[52px] items-center bg-text px-7 text-[12px] font-bold tracking-[0.12em] text-bg uppercase active:scale-[0.98]"
            >
              Shop all
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

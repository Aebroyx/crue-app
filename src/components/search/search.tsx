"use client";

import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { catalogProducts } from "@/lib/catalog";

const popular = ["Shell jacket", "Run tee", "Tight", "Short"];

export const searchLink = {
  go(href: string) {
    window.location.assign(href);
  },
};

function prefersReducedMotion() {
  if (typeof window.matchMedia !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function matches(query: string) {
  return catalogProducts().filter((product) =>
    `${product.title} ${product.category}`.toLowerCase().includes(query),
  );
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [query, setQuery] = useState("");
  const [closing, setClosing] = useState(false);

  onCloseRef.current = onClose;

  function dismiss() {
    if (prefersReducedMotion()) {
      onCloseRef.current();
      return;
    }
    setClosing(true);
  }

  useEffect(() => {
    if (!closing) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let closed = false;

    function finish(event?: AnimationEvent) {
      if (closed || (event && event.animationName !== "search-out")) return;
      closed = true;
      onCloseRef.current();
    }

    dialog.addEventListener("animationend", finish);
    const timer = window.setTimeout(finish, 400);
    return () => {
      dialog.removeEventListener("animationend", finish);
      window.clearTimeout(timer);
    };
  }, [closing]);

  useEffect(() => {
    if (!open) {
      setClosing(false);
      setQuery("");
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.querySelector("input")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const nodes = [...dialog.querySelectorAll<HTMLElement>("input, button, a")];
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
  }, [open]);

  if (!open) return null;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed ? matches(trimmed) : [];
  const idle = trimmed.length === 0;
  const noResults = !idle && results.length === 0;

  return (
    <div className="fixed inset-0 z-40 font-[family-name:var(--font-benzin)] text-text">
      <div
        data-scrim
        className={`search-scrim absolute inset-0 bg-[rgba(28,28,26,0.38)] dark:bg-[rgba(5,5,6,0.72)] ${closing ? "search-scrim-out" : ""}`}
        onClick={dismiss}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        tabIndex={-1}
        className={`search-panel relative flex h-full w-full flex-col border-b border-line bg-bg outline-none md:h-[620px] ${closing ? "search-panel-out" : ""}`}
      >
        <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-line pr-2 pl-4 md:h-[96px] md:pl-12">
          <SearchIcon className="size-5 shrink-0 text-muted" strokeWidth={1.5} aria-hidden />
          <input
            type="search"
            aria-label="Search"
            placeholder="Search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="search-field h-full min-w-0 flex-1 appearance-none border-0 bg-transparent text-[24px] font-extrabold tracking-[-0.01em] text-text uppercase outline-none placeholder:text-text/35 md:text-[40px]"
          />
          <button type="button" aria-label="Close search" onClick={dismiss} className="flex size-11 items-center justify-center text-text outline-none">
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-7 pb-10 md:px-12">
          {idle ? <Popular onPick={setQuery} /> : null}
          {results.length > 0 ? (
            <div className="flex flex-col gap-5">
              <span className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.16em] text-muted uppercase">
                {results.length === 1 ? "1 result" : `${results.length} results`}
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-6">
                {results.map((product) => (
                  <a key={product.handle} href={`/products/${product.handle}`} className="flex flex-col gap-2.5">
                    <div className="flex aspect-[3/4] items-center justify-center bg-surface">
                      <img src="/brand/crue-mark-white.png" alt="" className="hidden h-[19px] w-14 opacity-10 dark:block" />
                      <img src="/brand/crue-mark-black.png" alt="" className="h-[19px] w-14 opacity-10 dark:hidden" />
                    </div>
                    <span className="text-[12px] font-bold tracking-[0.04em] uppercase">{product.title}</span>
                    <span className="font-[family-name:var(--font-plex)] text-[12px]">
                      {product.variants[0]?.price.amount ?? "[PRICE]"}
                    </span>
                  </a>
                ))}
              </div>
              <a
                href="/catalog"
                onClick={(event) => {
                  event.preventDefault();
                  onCloseRef.current();
                  searchLink.go("/catalog");
                }}
                className="self-start py-2.5 font-[family-name:var(--font-plex)] text-[12px] tracking-[0.14em] uppercase underline-offset-6"
              >
                View all in shop
              </a>
            </div>
          ) : null}
          {noResults ? (
            <div className="flex flex-col gap-4">
              <p className="text-[22px] font-extrabold uppercase">No results for “{query.trim()}”</p>
              <p className="text-[14px] text-text-2">Check the spelling or try one of these.</p>
              <Popular onPick={setQuery} labelled={false} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Popular({ onPick, labelled = true }: { onPick: (label: string) => void; labelled?: boolean }) {
  const chips = (
      <div className="flex flex-wrap gap-2">
        {popular.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onPick(label)}
            className="h-11 border border-control-border px-[18px] text-[12px] font-bold tracking-[0.12em] uppercase"
          >
            {label}
          </button>
        ))}
      </div>
  );

  if (!labelled) return chips;

  return (
    <div className="flex flex-col gap-4">
      <span className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.16em] text-muted uppercase">
        Popular searches
      </span>
      {chips}
    </div>
  );
}

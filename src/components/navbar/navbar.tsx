"use client";

import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { clearIntroCookie } from "@/lib/intro-cookie";

function replayIntro() {
  document.cookie = clearIntroCookie();
}

export function Navbar({ bagCount = 0 }: { bagCount?: number }) {
  return (
    <>
      <div className="flex h-8 items-center justify-center bg-surface px-4 font-[family-name:var(--font-plex)] text-[10px] tracking-[0.16em] uppercase md:h-9 md:gap-8 md:text-[11px] md:tracking-[0.18em]">
        <span className="md:hidden">Drop 001, out now</span>
        <span className="hidden md:inline">Drop 001: Event Horizon, out now</span>
        <span className="hidden text-muted md:inline">Free shipping over [THRESHOLD]</span>
      </div>

      <header className="hidden h-[72px] grid-cols-3 items-center border-b border-line px-12 md:grid">
        <nav aria-label="Main" className="flex gap-7 text-[12px] font-semibold tracking-[0.12em] uppercase">
          <a href="/">Shop</a>
          <a href="#drop">Run</a>
          <a href="#drop">Train</a>
          <a href="#drop">Drops</a>
          <a href="#manifesto">Journal</a>
        </nav>
        <a href="/" aria-label="CRUE home" className="justify-self-center" onClick={replayIntro}>
          <Wordmark className="h-[22px] w-[104px]" />
        </a>
        <div className="flex items-center justify-end gap-2">
          <button type="button" aria-label="Search" className="flex size-11 items-center justify-center">
            <Search className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
          <button type="button" aria-label="Account" className="flex size-11 items-center justify-center">
            <User className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
          <button type="button" className="flex h-11 items-center gap-2 px-1 font-[family-name:var(--font-plex)] text-[12px] tracking-[0.1em]">
            <ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden />
            <span>BAG ({bagCount})</span>
          </button>
        </div>
      </header>

      <header className="flex h-[60px] items-center justify-between border-b border-line px-2 md:hidden">
        <button type="button" aria-label="Menu" className="flex size-11 items-center justify-center">
          <Menu className="size-[22px]" strokeWidth={1.5} aria-hidden />
        </button>
        <a href="/" aria-label="CRUE home" onClick={replayIntro}>
          <Wordmark className="h-[18px] w-[86px]" />
        </a>
        <div className="flex">
          <button type="button" aria-label="Search" className="flex size-11 items-center justify-center">
            <Search className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
          <button type="button" aria-label={`Bag, ${bagCount} items`} className="relative flex size-11 items-center justify-center">
            <ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden />
            {bagCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-text px-1 font-[family-name:var(--font-plex)] text-[10px] text-bg">
                {bagCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>
    </>
  );
}

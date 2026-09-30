"use client";

import { useState } from "react";
import { introCookie } from "@/lib/intro-cookie";

export function Intro() {
  const [open, setOpen] = useState(true);

  function dismiss() {
    document.cookie = introCookie();
    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div
      data-intro
      className="fixed inset-0 z-10 overflow-hidden bg-bg-intro font-[family-name:var(--font-archivo)] text-text"
    >
      <div className="intro-stars-3 pointer-events-none absolute -inset-[20%] opacity-70" />
      <div className="intro-stars-2 pointer-events-none absolute -inset-[20%]" />
      <div className="intro-stars pointer-events-none absolute -inset-[10%] origin-center" />
      <div className="intro-halo pointer-events-none absolute top-1/2 left-1/2 size-[min(140vw,800px)] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.03)_40%,transparent_70%)]" />

      <div className="intro-bh pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-[min(142vw,1100px)] -translate-1/2 scale-y-[0.14] md:scale-y-[0.13]">
          <div className="intro-disk aspect-square w-full rounded-full opacity-85 blur-[2px] md:blur-[3px]" />
        </div>
        <div className="absolute top-1/2 left-1/2 size-[min(44vw,300px)] -translate-1/2 rounded-full shadow-[0_0_0_1.5px_rgba(255,255,255,0.7),0_0_60px_14px_rgba(255,255,255,0.22),0_0_160px_40px_rgba(255,255,255,0.08)]" />
        <div className="absolute top-1/2 left-1/2 size-[min(40vw,276px)] -translate-1/2 rounded-full bg-hole" />
        <div className="absolute top-1/2 left-1/2 h-3.5 w-[min(142vw,1100px)] -translate-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.35)_30%,transparent_70%)] blur-[2px]" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 md:gap-10">
        <img
          src="/brand/crue-mark-white.png"
          alt="CRUE mark"
          className="intro-mark block h-auto w-[min(72vw,28.75rem)]"
        />
        <div className="flex flex-col items-center gap-3.5 md:gap-[18px]">
          <img
            src="/brand/crue-wordmark-white.png"
            alt="CRUE"
            className="intro-rise-1 block h-auto w-[min(34vw,11.875rem)]"
          />
          <p className="intro-rise-2 m-0 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.3em] text-muted uppercase md:text-xs md:tracking-[0.32em]">
            Get pulled in
          </p>
        </div>
      </div>

      <div className="absolute inset-x-5 top-14 flex items-center justify-between font-[family-name:var(--font-plex)] text-[10px] tracking-[0.18em] text-muted uppercase md:inset-x-12 md:top-9 md:text-[11px] md:tracking-[0.2em]">
        <span className="md:hidden">Drop 001</span>
        <span className="hidden md:inline">Drop 001 / Event Horizon</span>
      </div>

      <div className="absolute inset-x-5 bottom-12 flex flex-col gap-6 md:inset-x-12 md:bottom-10 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="hidden w-80 flex-col gap-3 md:flex">
          <span className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.2em] text-muted uppercase">
            Crossing the event horizon
          </span>
          <div className="h-px w-full bg-white/15">
            <div className="intro-bar h-px bg-text" />
          </div>
        </div>
        <div className="h-px bg-white/15 md:hidden">
          <div className="intro-bar h-px bg-text" />
        </div>
        <div className="intro-rise-3 flex flex-col gap-2 md:flex-row md:items-center md:gap-7">
          <button
            type="button"
            onClick={dismiss}
            className="hidden bg-transparent px-0 py-3.5 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.2em] text-muted uppercase md:inline"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-14 items-center justify-between gap-3.5 border border-text px-[22px] text-[13px] font-bold tracking-[0.14em] uppercase transition-[background,color] duration-300 stretch-[125%] hover:bg-text hover:text-bg-intro md:h-[52px] md:justify-center md:px-7"
          >
            <span>Enter</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="self-center bg-transparent px-4 py-3.5 font-[family-name:var(--font-plex)] text-[10px] tracking-[0.2em] text-muted uppercase md:hidden"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}

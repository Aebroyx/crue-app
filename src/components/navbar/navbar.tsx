"use client";

import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAccountUrl } from "@/components/account-url";
import { useAnnouncement } from "@/components/announcement-context";
import { Bag, useBag } from "@/components/bag/bag";
import { MobileMenu } from "@/components/navbar/menu";
import { SearchOverlay } from "@/components/search/search";
import { useSizeCharts } from "@/components/size-chart-context";
import { SizeGuide } from "@/components/size-guide/size-guide";
import { Wordmark } from "@/components/wordmark";
import { accountLink } from "@/lib/customer-account";
import type { Theme } from "@/lib/theme-cookie";

function navSurface(overlay: boolean, stuck: boolean) {
  const place = "sticky top-0 z-30 text-text transition-[background-color,border-color,color] duration-300 ease-out";
  if (overlay && !stuck) return `${place} border-b border-transparent bg-transparent`;
  return `${place} border-b border-line bg-bg`;
}

export function Navbar({
  shopCurrent = false,
  aboutCurrent = false,
  overlay = false,
  theme = "light",
}: {
  shopCurrent?: boolean;
  aboutCurrent?: boolean;
  overlay?: boolean;
  theme?: Theme;
}) {
  const charts = useSizeCharts();
  const bag = useBag();
  const accountUrl = useAccountUrl();
  const announcement = useAnnouncement();
  const barRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guide, setGuide] = useState(false);
  const surface = navSurface(overlay, stuck);
  const onPhoto = overlay && !stuck;

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => {
      const height = barRef.current?.offsetHeight ?? 0;
      setStuck(window.scrollY > height);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  return (
    <>
      <div ref={barRef} className="relative z-20 flex h-8 items-center justify-center bg-surface px-4 font-[family-name:var(--font-plex)] text-[10px] tracking-[0.16em] uppercase md:h-9 md:gap-8 md:text-[11px] md:tracking-[0.18em]">
        <span className="md:hidden">{announcement.mobileText}</span>
        <span className="hidden md:inline">{announcement.desktopText}</span>
        <span className="hidden text-muted md:inline">{announcement.shippingText}</span>
      </div>

      <header data-nav-on-photo={onPhoto ? "" : undefined} className={`hidden h-[72px] grid-cols-3 items-center px-12 md:grid ${surface}`}>
        <nav aria-label="Main" className="flex gap-7 text-[12px] font-semibold tracking-[0.12em] uppercase">
          <a
            href="/catalog"
            aria-current={shopCurrent ? "page" : undefined}
            className={shopCurrent ? "underline decoration-1 underline-offset-8" : undefined}
          >
            Shop
          </a>
          <a
            href="/about"
            aria-current={aboutCurrent ? "page" : undefined}
            className={aboutCurrent ? "underline decoration-1 underline-offset-8" : undefined}
          >
            About
          </a>
        </nav>
        <a href="/" aria-label="CRUE home" className="justify-self-center">
          <Wordmark onDark={onPhoto} className="h-[22px] w-[104px]" />
        </a>
        <div className="flex items-center justify-end gap-2">
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className="flex size-11 cursor-pointer items-center justify-center">
            <Search className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
          <button type="button" aria-label="Account" onClick={() => accountLink.go(accountUrl)} className="flex size-11 cursor-pointer items-center justify-center">
            <User className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            onClick={bag.openBag}
            className="flex h-11 cursor-pointer items-center gap-2 px-1 font-[family-name:var(--font-plex)] text-[12px] tracking-[0.1em]"
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden />
            <span>BAG ({bag.count})</span>
          </button>
        </div>
      </header>

      <header data-nav-on-photo={onPhoto ? "" : undefined} className={`flex h-[60px] items-center justify-between px-2 md:hidden ${surface}`}>
        <button type="button" aria-label="Menu" onClick={() => setMenuOpen(true)} className="flex size-11 items-center justify-center">
          <Menu className="size-[22px]" strokeWidth={1.5} aria-hidden />
        </button>
        <a href="/" aria-label="CRUE home">
          <Wordmark onDark={onPhoto} className="h-[18px] w-[86px]" />
        </a>
        <div className="flex">
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className="flex size-11 cursor-pointer items-center justify-center">
            <Search className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Bag, ${bag.count} items`}
            onClick={bag.openBag}
            className="relative flex size-11 cursor-pointer items-center justify-center"
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden />
            {bag.count > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-text px-1 font-[family-name:var(--font-plex)] text-[10px] text-bg">
                {bag.count}
              </span>
            ) : null}
          </button>
        </div>
      </header>
      <Bag />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu
        open={menuOpen}
        theme={theme}
        onClose={() => setMenuOpen(false)}
        showSizeGuide={charts.length > 0}
        onSizeGuide={() => {
          setMenuOpen(false);
          setGuide(true);
        }}
      />
      <SizeGuide open={guide} charts={charts} onClose={() => setGuide(false)} />
    </>
  );
}

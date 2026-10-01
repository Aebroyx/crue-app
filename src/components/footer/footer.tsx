import { ThemeSwitch } from "@/components/home/theme-switch";
import { Wordmark } from "@/components/wordmark";
import type { Theme } from "@/lib/theme-cookie";

export function Footer({ theme = "light" }: { theme?: Theme }) {
  return (
    <footer className="flex flex-col justify-between gap-10 border-t border-line px-5 pt-14 pb-8 md:h-[404px] md:px-12 md:pt-[72px] md:pb-10">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-6">
        <img src="/brand/crue-mark-white.png" alt="" className="hidden w-24 dark:md:block" />
        <img src="/brand/crue-mark-black.png" alt="" className="hidden w-24 md:block dark:md:hidden" />
        <nav aria-label="Shop" className="flex flex-col gap-3 text-[14px] md:gap-3.5">
          <span className="text-[12px] font-bold tracking-[0.1em] text-muted">SHOP</span>
          <a href="#drop">New arrivals</a>
          <a href="#drop">Run</a>
          <a href="#drop">Train</a>
          <a href="#drop" className="hidden md:inline">Accessories</a>
        </nav>
        <nav aria-label="Help" className="flex flex-col gap-3 text-[14px] md:gap-3.5">
          <span className="text-[12px] font-bold tracking-[0.1em] text-muted">HELP</span>
          <a href="#drop">Shipping</a>
          <a href="#drop">Returns</a>
          <a href="#drop">Size guide</a>
          <a href="#drop" className="hidden md:inline">Contact</a>
        </nav>
      </div>
      <div className="flex items-end justify-between gap-6">
        <Wordmark className="h-[74px] w-full max-w-[350px] md:h-16 md:w-[300px]" />
        <div className="flex flex-col items-end gap-4">
          <ThemeSwitch theme={theme} />
          <span className="font-[family-name:var(--font-plex)] text-[10px] tracking-[0.16em] text-dim md:text-[11px]">
            © CRUE [YEAR]
          </span>
        </div>
      </div>
    </footer>
  );
}

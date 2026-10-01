import { ThemeSwitch } from "./theme-switch";
import type { Theme } from "@/lib/theme-cookie";

const products = [
  {
    name: "Horizon Shell Jacket",
    meta: "Void Black, 3 colours",
    metaShort: "Void Black",
  },
  {
    name: "Singularity Run Tee",
    meta: "Photon White, 3 colours",
    metaShort: "Photon White",
  },
  {
    name: "Orbit Half Tight",
    meta: "Void Black, 2 colours",
    metaShort: "Void Black",
  },
  {
    name: "Accretion Split Short",
    meta: "Nebula Grey, 3 colours",
    metaShort: "Nebula Grey",
  },
];

const display =
  "font-extrabold font-stretch-[125%] uppercase leading-[0.9] tracking-[-0.02em]";

function Arrow({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 8h14l-1 13H6L5 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 8h18M3 16h18" />
    </svg>
  );
}

function Wordmark({ className }: { className: string }) {
  return (
    <span className={`relative block ${className}`}>
      <img src="/brand/crue-wordmark-white.png" alt="CRUE" className="hidden h-full w-full dark:block" />
      <img src="/brand/crue-wordmark-black.png" alt="" className="h-full w-full dark:hidden" />
    </span>
  );
}

export function Home({ theme = "light" }: { theme?: Theme }) {
  return (
    <div className="bg-bg font-[family-name:var(--font-archivo)] text-text">
      <div className="flex h-8 items-center justify-center bg-surface px-4 font-[family-name:var(--font-plex)] text-[10px] tracking-[0.16em] uppercase md:h-9 md:gap-8 md:text-[11px] md:tracking-[0.18em]">
        <span className="md:hidden">Drop 001, out now</span>
        <span className="hidden md:inline">Drop 001: Event Horizon, out now</span>
        <span className="hidden text-muted md:inline">Free shipping over [THRESHOLD]</span>
      </div>

      <header className="hidden h-[72px] grid-cols-3 items-center border-b border-line px-12 md:grid">
        <nav aria-label="Main" className="flex gap-7 text-[12px] font-semibold font-stretch-[112%] tracking-[0.12em] uppercase">
          <a href="#drop">Shop</a>
          <a href="#drop">Run</a>
          <a href="#drop">Train</a>
          <a href="#drop">Drops</a>
          <a href="#manifesto">Journal</a>
        </nav>
        <a href="#drop" aria-label="CRUE home" className="justify-self-center">
          <Wordmark className="h-[22px] w-[104px]" />
        </a>
        <div className="flex items-center justify-end gap-2">
          <button type="button" aria-label="Search" className="flex size-11 items-center justify-center">
            <SearchIcon />
          </button>
          <button type="button" aria-label="Account" className="flex size-11 items-center justify-center">
            <AccountIcon />
          </button>
          <button type="button" className="flex h-11 items-center gap-2 px-1 font-[family-name:var(--font-plex)] text-[12px] tracking-[0.1em]">
            <BagIcon />
            <span>BAG (0)</span>
          </button>
        </div>
      </header>

      <header className="flex h-[60px] items-center justify-between border-b border-line px-2 md:hidden">
        <button type="button" aria-label="Menu" className="flex size-11 items-center justify-center">
          <MenuIcon />
        </button>
        <a href="#drop" aria-label="CRUE home">
          <Wordmark className="h-[18px] w-[86px]" />
        </a>
        <div className="flex">
          <button type="button" aria-label="Search" className="flex size-11 items-center justify-center">
            <SearchIcon />
          </button>
          <button type="button" aria-label="Bag, 0 items" className="flex size-11 items-center justify-center">
            <BagIcon />
          </button>
        </div>
      </header>

      <section className="relative h-[700px] overflow-hidden md:h-[820px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_60%_32%,#26262A_0%,#121214_50%,#0B0B0C_80%)] md:bg-[radial-gradient(ellipse_60%_70%_at_72%_42%,#26262A_0%,#121214_45%,#0B0B0C_75%)] hidden dark:block" />
        <img
          src="/brand/glow-dark.jpg"
          alt=""
          className="absolute top-[-20%] left-0 h-[180%] w-[160%] max-w-none object-cover opacity-55 dark:hidden"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(243,243,241,0.92)_0%,rgba(243,243,241,0.55)_38%,rgba(243,243,241,0)_70%)] dark:hidden" />
        <img
          src="/brand/crue-mark-white.png"
          alt=""
          className="absolute top-[150px] left-[-60px] w-[520px] opacity-[0.07] md:left-[36%] md:w-[1200px] hidden dark:block"
        />
        <div className="absolute right-5 bottom-8 left-5 flex flex-col gap-5 md:right-12 md:bottom-14 md:left-12 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="flex flex-col gap-5 md:gap-7">
            <span className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.2em] text-muted uppercase md:text-[12px]">
              Drop 001
            </span>
            <h1 className={`${display} text-[50px] leading-[0.88] md:text-[148px] md:leading-[0.86]`}>
              Event
              <br />
              Horizon
            </h1>
          </div>
          <div className="flex flex-col gap-5 md:w-[340px] md:gap-7 md:pb-2">
            <p className="text-[15px] leading-[1.55] text-text-2 md:text-[16px]">
              Technical running wear for the hybrid athlete.
              <span className="hidden md:inline"> Built for the long run and the heavy set.</span>
            </p>
            <a
              href="#drop"
              className="flex h-14 items-center justify-between bg-text px-5 text-[13px] font-bold font-stretch-[125%] tracking-[0.12em] text-bg uppercase active:scale-[0.98] md:px-6"
            >
              <span>Shop Drop 001</span>
              <Arrow className="size-[18px]" />
            </a>
          </div>
        </div>
      </section>

      <section id="drop" className="flex flex-col gap-6 px-4 py-16 md:gap-10 md:px-12 md:py-24">
        <h2 className={`${display} text-[30px] leading-none md:text-[44px]`}>The Drop</h2>
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-6 md:grid-cols-4 md:gap-4">
          {products.map((product) => (
            <article key={product.name} className="flex flex-col gap-3 md:gap-4">
              <div className="flex h-[228px] items-center justify-center bg-surface md:h-[432px]">
                <img src="/brand/crue-mark-white.png" alt="" className="w-[72px] opacity-[0.08] md:w-[120px] hidden dark:block" />
                <img src="/brand/crue-mark-black.png" alt="" className="w-[72px] opacity-[0.08] md:w-[120px] dark:hidden" />
              </div>
              <div className="flex flex-col gap-1 md:flex-row md:justify-between md:gap-3">
                <div className="flex flex-col gap-1 md:gap-1.5">
                  <span className="text-[12px] font-bold font-stretch-[112%] tracking-[0.03em] uppercase md:text-[14px] md:tracking-[0.04em]">
                    {product.name}
                  </span>
                  <span className="text-[12px] text-muted md:hidden">{product.metaShort}</span>
                  <span className="hidden text-[13px] text-muted md:inline">{product.meta}</span>
                </div>
                <span className="font-[family-name:var(--font-plex)] text-[12px] md:text-[13px]">[PRICE]</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="manifesto" className="bg-surface px-5 py-[72px] md:px-12 md:py-[120px]">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-x-6">
          <div className="flex flex-col gap-6 md:col-start-4 md:col-span-8 md:gap-8">
            <h2 className={`${display} text-[34px] leading-[1.04] md:text-[64px] md:leading-[1.02]`}>
              Gravity is your training partner.
            </h2>
            <p className="max-w-[560px] text-[15px] leading-[1.6] text-text-2 md:text-[17px]">
              CRUE is built for the hybrid athlete: the one who runs at first light and lifts after dark.
              <span className="hidden md:inline"> Every piece is cut to move between both.</span>
            </p>
            <a
              href="#manifesto"
              className="self-start py-3 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.16em] uppercase underline-offset-[5px] md:text-[12px] md:underline-offset-[6px]"
            >
              Read the story
            </a>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2.5 px-4 py-16 md:grid md:h-[968px] md:grid-cols-[7fr_5fr] md:grid-rows-2 md:gap-4 md:px-12 md:py-24">
        <a href="#drop" className="relative block h-[362px] overflow-hidden bg-surface md:col-start-1 md:row-span-2 md:h-auto">
          <img src="/brand/glow-dark.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,12,0.85),rgba(11,11,12,0.1)_55%)]" />
          <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between md:right-8 md:bottom-8 md:left-8">
            <span className={`${display} text-[48px] md:text-[72px]`}>Run</span>
            <Arrow className="size-[26px] md:size-8" />
          </div>
        </a>
        <a href="#drop" className="relative block h-[200px] bg-surface-2 md:h-auto">
          <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between md:right-7 md:bottom-7 md:left-7">
            <span className={`${display} text-[24px] md:text-[44px]`}>Train</span>
            <Arrow className="size-5 md:size-7" />
          </div>
        </a>
        <a href="#drop" className="relative block h-[200px] overflow-hidden bg-text text-bg md:h-auto">
          <img src="/brand/crue-mark-black.png" alt="" className="absolute top-6 -right-8 w-[180px] opacity-[0.08] md:top-10 md:-right-10 md:w-[360px] hidden dark:block" />
          <img src="/brand/crue-mark-white.png" alt="" className="absolute top-6 -right-8 w-[180px] opacity-[0.08] md:top-10 md:-right-10 md:w-[360px] dark:hidden" />
          <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between md:right-7 md:bottom-7 md:left-7">
            <span className={`${display} text-[24px] md:text-[44px]`}>Layers</span>
            <Arrow className="size-5 md:size-7" />
          </div>
        </a>
      </section>

      <footer className="flex flex-col justify-between gap-10 border-t border-line px-5 pt-14 pb-8 md:h-[404px] md:px-12 md:pt-[72px] md:pb-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-6">
          <img src="/brand/crue-mark-white.png" alt="" className="hidden w-24 dark:md:block" />
          <img src="/brand/crue-mark-black.png" alt="" className="hidden w-24 md:block dark:md:hidden" />
          <nav aria-label="Shop" className="flex flex-col gap-3 text-[14px] md:gap-3.5">
            <span className="text-[12px] font-bold font-stretch-[112%] tracking-[0.1em] text-muted">SHOP</span>
            <a href="#drop">New arrivals</a>
            <a href="#drop">Run</a>
            <a href="#drop">Train</a>
            <a href="#drop" className="hidden md:inline">Accessories</a>
          </nav>
          <nav aria-label="Help" className="flex flex-col gap-3 text-[14px] md:gap-3.5">
            <span className="text-[12px] font-bold font-stretch-[112%] tracking-[0.1em] text-muted">HELP</span>
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
    </div>
  );
}

import { Navbar } from "@/components/navbar/navbar";

export function NotFound() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg font-[family-name:var(--font-benzin)] text-text">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-12 overflow-hidden px-6 md:px-80">
        <img
          src="/brand/crue-mark-white.png"
          alt=""
          className="not-found-mark hidden h-auto w-[min(72vw,28.75rem)] shrink-0 dark:block"
        />
        <img
          src="/brand/crue-mark-black.png"
          alt=""
          className="not-found-mark h-auto w-[min(72vw,28.75rem)] shrink-0 dark:hidden"
        />
        <div className="flex w-full flex-col items-center gap-[18px] text-center">
          <span className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.2em] text-muted uppercase">
            Error 404
          </span>
          <h1 className="text-[30px] leading-[0.98] font-extrabold text-balance uppercase md:text-[52px]">
            Lost past the event horizon
          </h1>
          <p className="text-[15px] leading-[1.6] font-normal text-text-2">
            This page was pulled in and never came back.
          </p>
          <div className="mt-2.5 flex w-full flex-col gap-2.5 md:w-auto md:flex-row">
            <a
              href="/"
              className="flex h-[52px] w-full items-center justify-center bg-text px-7 text-[12px] font-bold tracking-[0.12em] text-bg uppercase active:scale-[0.98] md:w-auto"
            >
              Back to home
            </a>
            <a
              href="/catalog"
              className="flex h-[52px] w-full items-center justify-center border border-control-border bg-transparent px-7 text-[12px] font-bold tracking-[0.12em] text-text uppercase active:scale-[0.98] md:w-auto"
            >
              Shop all
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

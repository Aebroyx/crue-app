"use client";

export function Newsletter() {
  return (
    <section className="relative h-[460px] overflow-hidden bg-surface md:h-[480px]">
      <img
        src="/brand/glow-light.jpg"
        alt=""
        className="pointer-events-none absolute top-[-80px] -left-[200px] h-[527px] w-[790px] max-w-none object-cover opacity-[0.22] md:inset-0 md:h-full md:w-full"
      />
      <div className="absolute inset-x-5 bottom-12 flex flex-col gap-4 md:inset-x-0 md:bottom-[72px] md:items-center md:gap-5">
        <h2 className="text-[28px] font-extrabold uppercase md:text-[40px]">Enter the orbit</h2>
        <form
          className="flex flex-col gap-2 md:w-[520px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="newsletter-email" className="text-[14px] text-text-2 md:text-center">
            Get early access to every drop.
          </label>
          <div className="flex h-14 border border-control-border bg-bg">
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="you@email.com"
              className="min-w-0 flex-1 bg-transparent px-4 font-[family-name:var(--font-plex)] text-[13px] text-text outline-none md:px-5"
            />
            <button
              type="button"
              className="bg-text px-[22px] text-[12px] font-bold tracking-[0.12em] text-bg uppercase md:px-7"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

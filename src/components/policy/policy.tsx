import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import type { Theme } from "@/lib/theme-cookie";

const policies = [
  {
    handle: "shipping",
    label: "Shipping",
    title: "Shipping policy",
    headings: ["Processing time", "Delivery regions and times", "Shipping costs", "Tracking your order"],
  },
  {
    handle: "returns",
    label: "Returns",
    title: "Returns policy",
    headings: ["Return window", "Condition of items", "How to start a return", "Refunds and exchanges"],
  },
  {
    handle: "privacy",
    label: "Privacy",
    title: "Privacy policy",
    headings: ["What we collect", "How we use it", "Cookies", "Your rights"],
  },
  {
    handle: "terms",
    label: "Terms",
    title: "Terms of service",
    headings: ["Orders and payment", "Pricing and availability", "Intellectual property", "Governing law"],
  },
] as const;

export type PolicyPage = (typeof policies)[number];

export function policyByHandle(handle: string) {
  return policies.find((policy) => policy.handle === handle) ?? null;
}

export function policySentence(label: string, heading: string) {
  return `[Your ${label.toLowerCase()} policy text for “${heading.toLowerCase()}” goes here. Keep it short and plain.]`;
}

export function Policy({ handle, theme = "light" }: { handle: string; theme?: Theme }) {
  const policy = policyByHandle(handle);
  if (!policy) return null;

  return (
    <div className="bg-bg font-[family-name:var(--font-benzin)] text-text">
      <Navbar theme={theme} />
      <div className="flex flex-col gap-4 px-5 pt-8 pb-5 md:border-b md:border-line md:px-12 md:pt-14 md:pb-8">
        <nav
          aria-label="Breadcrumb"
          className="flex gap-2.5 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] text-muted uppercase"
        >
          <a href="/" className="hover:opacity-75">
            Home
          </a>
          <span>/</span>
          <span>Help</span>
        </nav>
        <h1 className="text-[34px] leading-[0.95] font-extrabold uppercase md:text-[64px]">{policy.title}</h1>
        <span className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] text-muted uppercase">
          Last updated [DATE]
        </span>
      </div>
      <nav
        aria-label="Help topics"
        className="flex gap-2 overflow-x-auto border-b border-line px-4 pb-4 [scrollbar-width:none] md:hidden"
      >
        {policies.map((topic) => (
          <TopicChip key={topic.handle} topic={topic} active={topic.handle === policy.handle} />
        ))}
      </nav>
      <main className="px-5 pt-7 pb-16 md:flex md:gap-24 md:px-12 md:pt-12 md:pb-24">
        <nav aria-label="Help topics" className="hidden w-60 shrink-0 flex-col md:flex">
          {policies.map((topic) => (
            <TopicLink key={topic.handle} topic={topic} active={topic.handle === policy.handle} />
          ))}
        </nav>
        <article className="flex max-w-[680px] flex-1 flex-col gap-9">
          {policy.headings.map((heading) => (
            <section key={heading} className="flex flex-col gap-3">
              <h2 className="text-[16px] font-extrabold tracking-[0.04em] uppercase">{heading}</h2>
              <p className="text-[15px] leading-[1.7] text-text-2">{policySentence(policy.label, heading)}</p>
            </section>
          ))}
          <div className="flex flex-col gap-2 bg-surface p-6">
            <span className="text-[14px] font-bold uppercase">Still need help?</span>
            <span className="text-[14px] text-text-2">
              Email [SUPPORT EMAIL] and we will reply within [RESPONSE TIME].
            </span>
          </div>
        </article>
      </main>
      <Footer theme={theme} />
    </div>
  );
}

function TopicChip({ topic, active }: { topic: PolicyPage; active: boolean }) {
  return (
    <a
      href={`/policies/${topic.handle}`}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 shrink-0 items-center px-4 text-[12px] font-bold tracking-[0.08em] whitespace-nowrap uppercase hover:opacity-75 ${
        active ? "border border-text bg-text text-bg" : "border border-control-border text-text"
      }`}
    >
      {topic.label}
    </a>
  );
}

function TopicLink({ topic, active }: { topic: PolicyPage; active: boolean }) {
  return (
    <a
      href={`/policies/${topic.handle}`}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center gap-3 text-[14px] font-bold tracking-[0.06em] uppercase hover:opacity-75 ${
        active ? "text-text" : "text-muted"
      }`}
    >
      <span aria-hidden className={`size-2 shrink-0 ${active ? "bg-text" : "bg-transparent"}`} />
      {topic.label}
    </a>
  );
}

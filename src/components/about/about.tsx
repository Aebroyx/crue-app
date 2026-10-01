import { Navbar } from "@/components/navbar/navbar";

const copy =
  "CRUE is built for the hybrid athlete: the one who runs at first light and lifts after dark. We make technical running wear for both worlds, cut for the long run and the heavy set. Like the black hole in our mark, it pulls you in. Once you are in, there is no going back.";

const panels = [
  {
    className:
      "about-panel absolute top-[84px] -left-[70px] flex h-[160px] w-[230px] -rotate-12 items-end justify-end border border-line-strong bg-[linear-gradient(135deg,#D3D3CF_0%,#E8E8E5_55%,#DCDCD8_100%)] p-4 shadow-[0_24px_48px_rgba(40,40,38,0.14)] md:top-[110px] md:-left-20 md:h-[360px] md:w-[520px] md:p-9 md:shadow-[0_40px_80px_rgba(11,11,12,0.55)] dark:bg-[linear-gradient(135deg,#26262A_0%,#141416_55%,#1C1C1F_100%)] dark:shadow-[0_40px_80px_rgba(11,11,12,0.55)]",
    mark: "w-16 opacity-[0.22] md:w-24",
  },
  {
    className:
      "about-panel about-panel-2 absolute top-[640px] -left-[50px] flex h-[220px] w-[220px] rotate-[8deg] items-center justify-center border border-line-strong bg-[linear-gradient(160deg,#DCDCD8_0%,#E8E8E5_60%,#D3D3CF_100%)] md:top-[590px] md:-left-[60px] md:h-[440px] md:w-[480px] dark:bg-[linear-gradient(160deg,#1C1C1F_0%,#141416_60%,#26262A_100%)]",
    mark: "w-24 opacity-[0.18] md:w-[180px]",
  },
  {
    className:
      "about-panel about-panel-3 absolute top-[110px] -right-20 left-auto flex h-[140px] w-[220px] rotate-[10deg] items-start justify-start border border-line-strong bg-[linear-gradient(200deg,#D3D3CF_0%,#E8E8E5_50%,#DCDCD8_100%)] p-4 md:top-24 md:-right-[120px] md:h-[320px] md:w-[560px] md:p-9 dark:bg-[linear-gradient(200deg,#26262A_0%,#141416_50%,#1C1C1F_100%)]",
    mark: "w-20 opacity-[0.22] md:w-[110px]",
    wordmark: true,
  },
  {
    className:
      "about-panel about-panel-4 absolute top-[600px] -right-[60px] left-auto flex h-[210px] w-[210px] -rotate-8 items-center justify-center border border-line-strong bg-[linear-gradient(135deg,#DCDCD8_0%,#E8E8E5_55%,#D3D3CF_100%)] md:top-[540px] md:-right-20 md:h-[460px] md:w-[460px] dark:bg-[linear-gradient(135deg,#1C1C1F_0%,#141416_55%,#26262A_100%)]",
    mark: "w-28 opacity-[0.18] md:w-[200px]",
  },
];

export function About() {
  return (
    <div className="relative h-dvh overflow-hidden bg-bg font-[family-name:var(--font-benzin)] text-text">
      {panels.map((panel) => (
        <div key={panel.className} className={panel.className}>
          <img
            src={panel.wordmark ? "/brand/crue-wordmark-white.png" : "/brand/crue-mark-white.png"}
            alt=""
            className={`hidden h-auto dark:block ${panel.mark}`}
          />
          <img
            src={panel.wordmark ? "/brand/crue-wordmark-black.png" : "/brand/crue-mark-black.png"}
            alt=""
            className={`h-auto dark:hidden ${panel.mark}`}
          />
        </div>
      ))}
      <Navbar aboutCurrent />
      <main className="about-copy absolute top-1/2 left-1/2 z-10 flex w-[min(500px,calc(100%-2.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 text-center md:gap-8">
        <h1>
          <img src="/brand/crue-mark-white.png" alt="About CRUE" className="hidden h-6 w-[72px] md:h-7 md:w-[84px] dark:block" />
          <img src="/brand/crue-mark-black.png" alt="" className="h-6 w-[72px] md:h-7 md:w-[84px] dark:hidden" />
        </h1>
        <p className="max-w-[500px] text-[14px] leading-[1.7] text-pretty text-text-2 md:text-[15px] md:leading-[1.75]">
          {copy}
        </p>
      </main>
    </div>
  );
}

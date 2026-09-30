import { cookies } from "next/headers";
import { Intro } from "./intro";
import { hasSeenIntro, introCookieName } from "./intro-cookie";

export function Storefront({ showIntro }: { showIntro: boolean }) {
  return (
    <>
      {showIntro ? <Intro /> : null}
      <main className="flex min-h-dvh items-center justify-center overflow-hidden bg-black">
        <div className="relative aspect-[765/248] w-[min(70vw,36rem)] overflow-hidden">
          <img
            src="/cruebh-white.svg"
            alt="Crue"
            className="absolute left-[-49.9346%] top-[-154.8387%] h-auto w-[194.0964%] max-w-none"
          />
        </div>
      </main>
    </>
  );
}

export default async function HomePage() {
  const jar = await cookies();
  return <Storefront showIntro={!hasSeenIntro(jar.get(introCookieName)?.value)} />;
}

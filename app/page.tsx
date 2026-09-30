import { cookies } from "next/headers";
import { Home } from "@/components/home/home";
import { Intro } from "@/components/intro/intro";
import { hasSeenIntro, introCookieName } from "@/lib/intro-cookie";

export function Storefront({ showIntro }: { showIntro: boolean }) {
  return (
    <>
      {showIntro ? <Intro /> : null}
      <Home />
    </>
  );
}

export default async function HomePage() {
  const jar = await cookies();
  return <Storefront showIntro={!hasSeenIntro(jar.get(introCookieName)?.value)} />;
}

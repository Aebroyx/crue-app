import { cookies } from "next/headers";
import { Home } from "@/components/home/home";
import { Intro } from "@/components/intro/intro";
import { hasSeenIntro, introCookieName } from "@/lib/intro-cookie";
import { themeFromCookie, themeCookieName, type Theme } from "@/lib/theme-cookie";

export function Storefront({
  showIntro,
  theme = "light",
}: {
  showIntro: boolean;
  theme?: Theme;
}) {
  return (
    <>
      {showIntro ? <Intro /> : null}
      <Home theme={theme} />
    </>
  );
}

export default async function HomePage() {
  const jar = await cookies();
  return (
    <Storefront
      showIntro={!hasSeenIntro(jar.get(introCookieName)?.value)}
      theme={themeFromCookie(jar.get(themeCookieName)?.value)}
    />
  );
}

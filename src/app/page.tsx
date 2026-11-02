import { cookies } from "next/headers";
import { Home } from "@/components/home/home";
import { Intro } from "@/components/intro/intro";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";
import { hasSeenIntro, introCookieName } from "@/lib/intro-cookie";
import { storefrontProducts } from "@/lib/storefront";
import { themeFromCookie, themeCookieName, type Theme } from "@/lib/theme-cookie";

export function Storefront({
  showIntro,
  theme = "light",
  products,
}: {
  showIntro: boolean;
  theme?: Theme;
  products?: CatalogProduct[];
}) {
  return (
    <>
      {showIntro ? <Intro /> : null}
      <Home theme={theme} products={products ?? catalogProducts()} />
    </>
  );
}

export default async function HomePage() {
  const jar = await cookies();
  return (
    <Storefront
      showIntro={!hasSeenIntro(jar.get(introCookieName)?.value)}
      theme={themeFromCookie(jar.get(themeCookieName)?.value)}
      products={await storefrontProducts()}
    />
  );
}

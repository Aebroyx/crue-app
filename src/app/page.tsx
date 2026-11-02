import { cookies } from "next/headers";
import { Home } from "@/components/home/home";
import { Intro } from "@/components/intro/intro";
import { storefrontBanners, type BannerSlide } from "@/lib/banners";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";
import { hasSeenIntro, introCookieName } from "@/lib/intro-cookie";
import { storefrontProducts } from "@/lib/storefront";
import { themeFromCookie, themeCookieName, type Theme } from "@/lib/theme-cookie";

export function Storefront({
  showIntro,
  theme = "light",
  products,
  banners,
}: {
  showIntro: boolean;
  theme?: Theme;
  products?: CatalogProduct[];
  banners?: BannerSlide[];
}) {
  return (
    <>
      {showIntro ? <Intro /> : null}
      <Home theme={theme} products={products ?? catalogProducts()} banners={banners} />
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
      banners={await storefrontBanners()}
    />
  );
}

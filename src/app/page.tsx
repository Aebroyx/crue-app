import { cookies } from "next/headers";
import { Home } from "@/components/home/home";
import { Intro } from "@/components/intro/intro";
import { storefrontBanners, type BannerSlide } from "@/lib/banners";
import { storefrontManifesto, type Manifesto } from "@/lib/manifesto";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";
import { introCookieName, showIntroForVisit } from "@/lib/intro-cookie";
import { storefrontProducts } from "@/lib/storefront";
import { themeFromCookie, themeCookieName, type Theme } from "@/lib/theme-cookie";

export function Storefront({
  showIntro,
  theme = "light",
  products,
  banners,
  manifesto,
}: {
  showIntro: boolean;
  theme?: Theme;
  products?: CatalogProduct[];
  banners?: BannerSlide[];
  manifesto?: Manifesto;
}) {
  return (
    <>
      {showIntro ? <Intro /> : null}
      <Home theme={theme} products={products ?? catalogProducts()} banners={banners} manifesto={manifesto} />
    </>
  );
}

export default async function HomePage(props?: {
  searchParams?: Promise<{ intro?: string | string[] }>;
}) {
  const jar = await cookies();
  const params = props?.searchParams ? await props.searchParams : {};
  return (
    <Storefront
      showIntro={showIntroForVisit(jar.get(introCookieName)?.value, {
        intro: params.intro !== undefined,
        development: process.env.NODE_ENV === "development",
      })}
      theme={themeFromCookie(jar.get(themeCookieName)?.value)}
      products={await storefrontProducts()}
      banners={await storefrontBanners()}
      manifesto={await storefrontManifesto()}
    />
  );
}

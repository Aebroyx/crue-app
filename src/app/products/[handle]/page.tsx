import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Product } from "@/components/product/product";
import { requestProductRecommendations } from "@/lib/recommendations";
import { storefrontProducts } from "@/lib/storefront";
import { themeCookieName, themeFromCookie } from "@/lib/theme-cookie";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const products = await storefrontProducts();
  const product = products.find((item) => item.handle === handle);
  if (!product) notFound();

  const jar = await cookies();
  return (
    <Product
      product={product}
      recommendations={await requestProductRecommendations(product.id)}
      theme={themeFromCookie(jar.get(themeCookieName)?.value)}
    />
  );
}

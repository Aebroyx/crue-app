import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Product } from "@/components/product/product";
import { productByHandle } from "@/lib/catalog";
import { themeCookieName, themeFromCookie } from "@/lib/theme-cookie";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = productByHandle(handle);
  if (!product) notFound();

  const jar = await cookies();
  return (
    <Product
      product={product}
      theme={themeFromCookie(jar.get(themeCookieName)?.value)}
    />
  );
}

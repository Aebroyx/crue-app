import { Catalog } from "@/components/catalog/catalog";
import { themeCookieName, themeFromCookie } from "@/lib/theme-cookie";
import { cookies } from "next/headers";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; size?: string; colour?: string }>;
}) {
  const query = await searchParams;
  const jar = await cookies();

  return (
    <Catalog
      category={query.category || "All"}
      size={query.size || ""}
      colour={query.colour || ""}
      theme={themeFromCookie(jar.get(themeCookieName)?.value)}
    />
  );
}

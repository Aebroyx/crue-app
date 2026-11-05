import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AccountUrlProvider } from "@/components/account-url";
import { AnnouncementProvider } from "@/components/announcement-context";
import { CatalogProvider } from "@/components/catalog-context";
import { SizeChartProvider } from "@/components/size-chart-context";
import { storefrontAnnouncement } from "@/lib/announcement";
import { storefrontSizeCharts } from "@/lib/size-chart";
import { customerAccountUrl } from "@/lib/customer-account";
import { benzin, geist, plex } from "@/lib/fonts";
import { storefrontProducts } from "@/lib/storefront";
import { themeCookieName, themeFromCookie } from "@/lib/theme-cookie";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crue",
  icons: {
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const theme = themeFromCookie(jar.get(themeCookieName)?.value);
  const [products, announcement, charts] = await Promise.all([
    storefrontProducts(),
    storefrontAnnouncement(),
    storefrontSizeCharts(),
  ]);

  return (
    <html
      lang="en"
      data-theme={theme === "dark" ? "dark" : undefined}
      className={`${benzin.variable} ${plex.variable}`}
    >
      <body className={`${geist.className} bg-bg text-text antialiased`}>
        <AccountUrlProvider url={customerAccountUrl()}>
          <AnnouncementProvider announcement={announcement}>
            <SizeChartProvider charts={charts}>
              <CatalogProvider products={products}>{children}</CatalogProvider>
            </SizeChartProvider>
          </AnnouncementProvider>
        </AccountUrlProvider>
      </body>
    </html>
  );
}

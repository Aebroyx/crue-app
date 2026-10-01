import type { Metadata } from "next";
import { cookies } from "next/headers";
import { benzin, geist, plex } from "@/lib/fonts";
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

  return (
    <html
      lang="en"
      data-theme={theme === "dark" ? "dark" : undefined}
      className={`${benzin.variable} ${plex.variable}`}
    >
      <body className={`${geist.className} bg-bg text-text antialiased`}>
        {children}
      </body>
    </html>
  );
}

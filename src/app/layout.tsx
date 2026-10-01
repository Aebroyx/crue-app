import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Archivo, Geist, IBM_Plex_Mono } from "next/font/google";
import { themeCookieName, themeFromCookie } from "@/lib/theme-cookie";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex",
});

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
      className={`${archivo.variable} ${plex.variable}`}
    >
      <body className={`${geist.className} bg-bg text-text antialiased`}>
        {children}
      </body>
    </html>
  );
}

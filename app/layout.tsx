import type { Metadata } from "next";
import { Archivo, Geist, IBM_Plex_Mono } from "next/font/google";
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
    icon: "/brand/crue-mark-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plex.variable}`}>
      <body className={`${geist.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

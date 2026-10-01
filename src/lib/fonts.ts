import localFont from "next/font/local";
import { Geist, IBM_Plex_Mono } from "next/font/google";

export const geist = Geist({ subsets: ["latin"] });

export const benzin = localFont({
  src: [
    { path: "../../assets/fonts/Benzin-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../assets/fonts/Benzin-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../assets/fonts/Benzin-Semibold.ttf", weight: "600", style: "normal" },
    { path: "../../assets/fonts/Benzin-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../assets/fonts/Benzin-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-benzin",
  display: "swap",
  fallback: ["sans-serif"],
});

export const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex",
});

import fs from "node:fs";
import path from "node:path";
import { metadata } from "./layout";

jest.mock("@/lib/fonts", () => ({
  geist: { className: "font-geist" },
  benzin: { variable: "font-benzin" },
  plex: { variable: "font-plex" },
}));

const pack = [
  "apple-touch-icon.png",
  "favicon-32x32.png",
  "favicon-16x16.png",
  "favicon.ico",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "site.webmanifest",
];

describe("REQ-003 favicon", () => {
  it("REQ-003 links the apple touch icon, the sized icons, and the manifest", () => {
    expect(metadata.icons).toEqual({
      apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
    });
    expect(metadata.manifest).toBe("/site.webmanifest");
  });

  it("REQ-003 serves the favicon pack at the root paths", () => {
    for (const name of pack) {
      const file = path.join(process.cwd(), "public", name);
      expect(fs.statSync(file).size).toBeGreaterThan(0);
    }
  });

  it("REQ-003 does not use the intro mark as the document icon", () => {
    expect(JSON.stringify(metadata.icons)).not.toContain("crue-mark-white.png");
    expect(metadata.title).toBe("Crue");
  });

  it("REQ-003 keeps the manifest contents from the pack", () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "public/site.webmanifest"), "utf8"),
    );

    expect(manifest).toEqual({
      name: "",
      short_name: "",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    });
  });
});

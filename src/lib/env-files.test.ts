import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function parseEnv(text: string) {
  const entries = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=", 1)[0]);
  return entries;
}

describe("REQ-017 environment files", () => {
  it("REQ-017 commits the example with the two empty Shopify names", () => {
    const example = read(".env.example");
    const names = parseEnv(example);

    expect(names).toEqual(["SHOPIFY_STORE_DOMAIN", "SHOPIFY_STOREFRONT_ACCESS_TOKEN"]);
    expect(example).toMatch(/copy.*\.env\.local/i);
    expect(example).not.toMatch(/myshopify\.com|shpat_|shpss_/i);
    for (const line of example.split("\n").filter((row) => row.includes("=") && !row.trim().startsWith("#"))) {
      expect(line).toMatch(/=\s*$/);
    }
  });

  it("REQ-017 does not commit .env.local or a .env file", () => {
    const tracked = execSync("git ls-files", { encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
    const gitignore = read(".gitignore");

    expect(tracked).not.toContain(".env");
    expect(tracked).not.toContain(".env.local");
    expect(fs.existsSync(path.join(root, ".env"))).toBe(false);
    expect(gitignore).toMatch(/^\.env$/m);
    expect(gitignore).toMatch(/^\.env\.\*$/m);
  });

  it("REQ-017 keeps the example allow-list in gitignore", () => {
    const gitignore = read(".gitignore");

    expect(gitignore).toMatch(/^!\.env\.example$/m);
    expect(fs.existsSync(path.join(root, ".env.example"))).toBe(true);
  });
});

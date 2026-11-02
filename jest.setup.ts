import fs from "node:fs";
import path from "node:path";
import "@testing-library/jest-dom";
import { resetBag } from "@/components/bag/bag";
import { memoryCartClient, resetMemoryCart, setCartClient } from "@/lib/cart";
import { setCatalogProducts, type CatalogProduct } from "@/lib/catalog";

const fixture = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/data/catalog.fixture.json"), "utf8"),
) as { products: CatalogProduct[] };

setCatalogProducts(fixture.products);

beforeEach(() => {
  resetMemoryCart();
  setCartClient(memoryCartClient);
  resetBag();
});

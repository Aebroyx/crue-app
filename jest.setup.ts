import fs from "node:fs";
import path from "node:path";
import "@testing-library/jest-dom";
import { resetBag } from "@/components/bag/bag";
import { setCatalogProducts, type CatalogProduct } from "@/lib/catalog";

const fixture = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/data/catalog.fixture.json"), "utf8"),
) as { products: CatalogProduct[] };

setCatalogProducts(fixture.products);

beforeEach(() => {
  resetBag();
});

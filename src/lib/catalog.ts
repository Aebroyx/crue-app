import catalog from "@/data/catalog.json";

export type SelectedOption = { name: string; value: string };

export type CatalogVariant = {
  id: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: { amount: string };
};

export type CatalogProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  options: { name: string; values: string[] }[];
  variants: CatalogVariant[];
  images: { alt: string }[];
  accordions: { title: string; body: string }[];
  category: string;
  listingColours: string[];
  listingSizes: string[];
};

const products = catalog.products as CatalogProduct[];

export function catalogProducts() {
  return products;
}

export function productByHandle(handle: string) {
  return products.find((product) => product.handle === handle);
}

export function optionValues(product: CatalogProduct, name: string) {
  return product.options.find((option) => option.name === name)?.values ?? [];
}

export type SelectedOption = { name: string; value: string };

export type CatalogVariant = {
  id: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: { amount: string };
};

export type CatalogImage = { url?: string; alt: string; altText?: string };

export type CatalogProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  options: { name: string; values: string[] }[];
  variants: CatalogVariant[];
  images: CatalogImage[];
  accordions: { title: string; body: string }[];
  category: string;
  listingColours: string[];
  listingSizes: string[];
};

let products: CatalogProduct[] = [];

export function setCatalogProducts(next: CatalogProduct[]) {
  products = next;
}

export function catalogProducts() {
  return products;
}

export function productByHandle(handle: string) {
  return products.find((product) => product.handle === handle);
}

export function optionValues(product: CatalogProduct, name: string) {
  return product.options.find((option) => option.name === name)?.values ?? [];
}

const swatch: Record<string, string> = {
  "void black": "#0B0B0C",
  "photon white": "#EDECE8",
  "nebula grey": "#7C7C81",
  black: "#0B0B0C",
  white: "#EDECE8",
};

export function swatchFill(name: string) {
  return swatch[name.trim().toLowerCase()] ?? "#E8E8E5";
}

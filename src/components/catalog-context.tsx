"use client";

import { createContext, useContext } from "react";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";

const CatalogContext = createContext<CatalogProduct[] | null>(null);

export function CatalogProvider({
  products,
  children,
}: {
  products: CatalogProduct[];
  children: React.ReactNode;
}) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export function useCatalogProducts() {
  const products = useContext(CatalogContext);
  return products === null ? catalogProducts() : products;
}

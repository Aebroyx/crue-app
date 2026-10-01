"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";
import type { Theme } from "@/lib/theme-cookie";

const categories = ["All", "Tops", "Bottoms", "Layers", "Accessories"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colours = [
  { name: "Void Black", hex: "#0B0B0C" },
  { name: "Photon White", hex: "#EDECE8" },
  { name: "Nebula Grey", hex: "#7C7C81" },
];

export function Catalog({
  category = "All",
  size = "",
  colour = "",
  theme = "light",
}: {
  category?: string;
  size?: string;
  colour?: string;
  theme?: Theme;
}) {
  const [currentCategory, setCurrentCategory] = useState(category);
  const [currentSize, setCurrentSize] = useState(size);
  const [currentColour, setCurrentColour] = useState(colour);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const products = catalogProducts();
  const shown = products.filter((product) => matches(product, currentCategory, currentSize, currentColour));
  const filtered = currentCategory !== "All" || currentSize !== "" || currentColour !== "";
  const extra = Number(Boolean(currentSize)) + Number(Boolean(currentColour));

  function writeQuery(next: { category: string; size: string; colour: string }) {
    const params = new URLSearchParams();
    if (next.category !== "All") params.set("category", next.category);
    if (next.size) params.set("size", next.size);
    if (next.colour) params.set("colour", next.colour);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/catalog?${query}` : "/catalog");
  }

  function apply(next: { category?: string; size?: string; colour?: string }) {
    const value = {
      category: next.category ?? currentCategory,
      size: next.size ?? currentSize,
      colour: next.colour ?? currentColour,
    };
    setCurrentCategory(value.category);
    setCurrentSize(value.size);
    setCurrentColour(value.colour);
    writeQuery(value);
  }

  function clear() {
    apply({ category: "All", size: "", colour: "" });
  }

  return (
    <div className="bg-bg font-[family-name:var(--font-benzin)] text-text">
      <Navbar shopCurrent />
      <div className="flex flex-col gap-5 border-b border-line px-5 py-8 md:flex-row md:items-end md:justify-between md:gap-12 md:px-12 md:pt-14 md:pb-6">
        <div className="flex flex-col gap-4 md:gap-5">
          <nav aria-label="Breadcrumb" className="flex gap-2.5 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] text-muted uppercase">
            <a href="/">Home</a>
            <span>/</span>
            <span>Shop</span>
          </nav>
          <div className="flex items-baseline gap-4 md:gap-5">
            <h1 className="text-[36px] leading-[0.95] font-extrabold tracking-[-0.01em] uppercase md:text-[64px]">
              {currentCategory === "All" ? "Shop all" : currentCategory}
            </h1>
            <span className="font-[family-name:var(--font-plex)] text-[13px] text-muted">({shown.length})</span>
          </div>
        </div>
        <div className="hidden items-center gap-8 font-[family-name:var(--font-plex)] text-[12px] tracking-[0.14em] uppercase md:flex">
          <button
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex h-11 items-center gap-2.5"
          >
            <SlidersHorizontal className="size-[18px]" strokeWidth={1.5} aria-hidden />
            <span>{filtersOpen ? "Hide filters" : "Show filters"}</span>
          </button>
          <button type="button" className="flex h-11 items-center gap-2">
            <span>Sort: Featured</span>
            <ChevronDown className="size-3.5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>

      <div className="md:flex md:items-start">
        {filtersOpen ? (
          <aside className="hidden w-[240px] shrink-0 border-r border-line px-8 py-8 md:block">
            <FilterGroups
              products={products}
              category={currentCategory}
              size={currentSize}
              colour={currentColour}
              onCategory={(value) => apply({ category: value })}
              onSize={(value) => apply({ size: currentSize === value ? "" : value })}
              onColour={(value) => apply({ colour: currentColour === value ? "" : value })}
            />
            {filtered ? (
              <button type="button" onClick={clear} className="mt-5 h-11 font-[family-name:var(--font-plex)] text-[12px] tracking-[0.14em] uppercase underline underline-offset-[6px]">
                Clear all
              </button>
            ) : null}
          </aside>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex gap-2 border-b border-line px-4 pt-4 pb-4 md:hidden">
            <button type="button" onClick={() => setSheetOpen(true)} className="flex h-11 shrink-0 items-center gap-2 border border-control-border px-4 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] uppercase">
              <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden />
              {extra > 0 ? `Filter (${extra})` : "Filter"}
            </button>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={item === currentCategory}
                  onClick={() => apply({ category: item })}
                  className={`h-11 shrink-0 px-4 text-[12px] font-bold tracking-[0.08em] uppercase ${
                    item === currentCategory ? "border border-text bg-text text-bg" : "border border-control-border"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <main className="px-4 py-6 md:px-12 md:py-8">
            {shown.length > 0 ? (
              <div className={`grid grid-cols-2 gap-x-2.5 gap-y-7 md:gap-x-4 md:gap-y-10 ${filtersOpen ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
                {shown.map((product) => (
                  <a key={product.handle} href={`/products/${product.handle}`} className="flex flex-col gap-2.5 md:gap-4">
                    <div className="flex aspect-[3/4] items-center justify-center bg-surface">
                      <img src="/brand/crue-mark-white.png" alt="" className="hidden w-[66px] opacity-[0.08] md:w-[110px] dark:block" />
                      <img src="/brand/crue-mark-black.png" alt="" className="w-[66px] opacity-[0.08] md:w-[110px] dark:hidden" />
                    </div>
                    <span className="text-[12px] font-bold tracking-[0.03em] uppercase md:text-[14px] md:tracking-[0.04em]">{product.title}</span>
                    <span className="flex items-center gap-2.5">
                      <span className="flex gap-1">
                        {product.listingColours.map((name) => (
                          <span key={name} className="size-2.5 border border-control-border" style={{ background: colours.find((item) => item.name === name)?.hex }} />
                        ))}
                      </span>
                      <span className="hidden text-[13px] text-muted md:inline">{product.listingColours[0]}</span>
                    </span>
                    <span className="font-[family-name:var(--font-plex)] text-[12px] md:text-[13px]">[PRICE]</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 bg-surface px-5 py-16 text-center md:h-[480px] md:justify-center md:gap-6">
                <img src="/brand/crue-mark-white.png" alt="" className="hidden w-[150px] opacity-25 dark:block" />
                <img src="/brand/crue-mark-black.png" alt="" className="w-[150px] opacity-25 dark:hidden" />
                <p className="text-[22px] font-extrabold uppercase md:text-[28px]">Nothing in this orbit</p>
                <p className="text-[14px] text-text-2 md:text-[15px]">No pieces match these filters.</p>
                <button type="button" onClick={clear} className="h-[52px] bg-text px-7 text-[12px] font-bold tracking-[0.12em] text-bg uppercase">
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {sheetOpen ? (
        <div role="dialog" aria-label="Filters" className="fixed inset-0 z-20 flex flex-col bg-bg md:hidden">
          <div className="flex h-[60px] items-center justify-between border-b border-line px-5">
            <span className="text-[16px] font-extrabold uppercase">Filters</span>
            <button type="button" onClick={() => setSheetOpen(false)} className="h-11 px-2">
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterGroups
              products={products}
              category={currentCategory}
              size={currentSize}
              colour={currentColour}
              showCategory={false}
              onCategory={(value) => apply({ category: value })}
              onSize={(value) => apply({ size: currentSize === value ? "" : value })}
              onColour={(value) => apply({ colour: currentColour === value ? "" : value })}
            />
          </div>
          <div className="flex gap-3 border-t border-line px-4 py-4">
            <button type="button" onClick={clear} className="h-14 flex-1 border border-control-border text-[12px] font-bold tracking-[0.12em] uppercase">
              Clear
            </button>
            <button type="button" onClick={() => setSheetOpen(false)} className="h-14 flex-[2] bg-text text-[12px] font-bold tracking-[0.12em] text-bg uppercase">
              Show {shown.length} results
            </button>
          </div>
        </div>
      ) : null}
      <Footer theme={theme} />
    </div>
  );
}

function matches(product: CatalogProduct, category: string, size: string, colour: string) {
  const categoryMatches = category === "All" || product.category === category;
  const sizeMatches = size === "" || product.listingSizes.includes(size);
  const colourMatches = colour === "" || product.listingColours.includes(colour);
  return categoryMatches && sizeMatches && colourMatches;
}

function FilterGroups({
  products,
  category,
  size,
  colour,
  onCategory,
  onSize,
  onColour,
  showCategory = true,
}: {
  products: CatalogProduct[];
  category: string;
  size: string;
  colour: string;
  onCategory: (value: string) => void;
  onSize: (value: string) => void;
  onColour: (value: string) => void;
  showCategory?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      {showCategory ? <fieldset className="border-0 border-b border-line p-0 pb-8">
        <legend className="mb-4 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.16em] text-muted uppercase">Category</legend>
        <div className="flex flex-col">
          {categories.map((item) => {
            const count = products.filter((product) => matches(product, item, size, colour)).length;
            const on = item === category;
            return (
              <button key={item} type="button" aria-pressed={on} onClick={() => onCategory(item)} className={`flex h-10 w-full items-center justify-between gap-3 text-[13px] font-bold tracking-[0.04em] uppercase ${on ? "text-text" : "text-muted"}`}>
                <span className="min-w-0">{item}</span>
                <span className="shrink-0 font-[family-name:var(--font-plex)] text-[12px] font-normal">{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset> : null}
      <fieldset className="border-0 border-b border-line p-0 pb-8">
        <legend className="mb-4 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.16em] text-muted uppercase">Size</legend>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={item === size}
              onClick={() => onSize(item)}
              className={`h-11 border font-[family-name:var(--font-plex)] text-[13px] ${item === size ? "border-text bg-text text-bg" : "border-control-border"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="border-0 p-0">
        <legend className="mb-4 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.16em] text-muted uppercase">Colour</legend>
        <div className="flex flex-col">
          {colours.map((item) => (
            <button key={item.name} type="button" aria-pressed={item.name === colour} onClick={() => onColour(item.name)} className="flex h-11 items-center gap-3.5 text-[14px]">
              <span className={`size-8 border ${item.name === colour ? "border-text" : "border-transparent"} p-0.5`}>
                <span className="block size-full border border-control-border" style={{ background: item.hex }} />
              </span>
              {item.name}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useBag } from "@/components/bag/bag";
import { ProductImage } from "@/components/product-image/product-image";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { SizeGuide } from "@/components/size-guide/size-guide";
import { swatchFill, type CatalogProduct } from "@/lib/catalog";
import { type Recommendation } from "@/lib/recommendations";
import type { Theme } from "@/lib/theme-cookie";

function firstSelection(product: CatalogProduct) {
  const selected: Record<string, string> = {};
  for (const option of product.options) {
    selected[option.name] = option.name === "Size" && option.values.includes("M") ? "M" : (option.values[0] ?? "");
  }
  return selected;
}

export function Product({
  product,
  theme = "light",
  recommendations = [],
}: {
  product: CatalogProduct;
  theme?: Theme;
  recommendations?: Recommendation[];
}) {
  const [selected, setSelected] = useState(() => firstSelection(product));
  const colour = selected.Colour ?? "";
  const size = selected.Size ?? "";
  const [open, setOpen] = useState<number | null>(0);
  const [added, setAdded] = useState(false);
  const [notifiedFor, setNotifiedFor] = useState<string | null>(null);
  const [guide, setGuide] = useState(false);
  const bag = useBag();
  const price = matchingVariant(product, selected)?.price.amount ?? product.variants[0]?.price.amount ?? "[PRICE]";
  const extras = product.options
    .filter((option) => option.name !== "Colour" && option.name !== "Size")
    .map((option) => selected[option.name])
    .filter(Boolean);
  const choice = [size, ...extras].filter(Boolean).join(", ");
  const selection = product.options.map((option) => selected[option.name] ?? "").join("|");
  const unavailable = variantUnavailable(product, selected);
  const notified = notifiedFor === selection;
  const label = unavailable
    ? notified
      ? `We will email you when ${choice} is back`
      : `Notify me when ${choice} is back`
    : added
      ? `Added: ${[size, colour, ...extras].filter(Boolean).join(", ")}`
      : `Add to bag, ${choice}`;
  const actionClass = unavailable
    ? "border border-text bg-transparent text-text"
    : "bg-text text-bg";

  function choose(name: string, value: string) {
    setSelected((current) => ({ ...current, [name]: value }));
  }

  function add() {
    const variant = matchingVariant(product, selected);
    if (!variant) return;
    const result = bag.add({
      variantId: variant.id,
      title: product.title,
      colour,
      size: choice,
      amount: variant.price.amount,
      imageUrl: product.images[0]?.url,
      imageAlt: product.images[0]?.alt,
    });
    if (typeof result === "boolean") {
      if (result) setAdded(true);
      return;
    }
    void result.then((ok) => {
      if (ok) setAdded(true);
    });
  }

  function press() {
    if (unavailable) {
      setNotifiedFor(selection);
      return;
    }
    add();
  }

  return (
    <div className="bg-bg font-[family-name:var(--font-benzin)] text-text">
      <Navbar theme={theme} />
      <div className="md:hidden">
        <div className="flex snap-x gap-1.5 overflow-x-auto">
          {product.images.map((image, index) => (
            <Stage
              key={`${image.url ?? image.alt}-${index}`}
              src={image.url}
              alt={image.alt}
              className="h-[480px] w-[360px] shrink-0 snap-start"
            />
          ))}
        </div>
        <div className="flex gap-1.5 px-5 pt-4">
          {product.images.map((image, index) => (
            <span
              key={`${image.url ?? image.alt}-${index}`}
              className={`h-0.5 w-5 ${index === 0 ? "bg-text" : "bg-control-border"}`}
            />
          ))}
        </div>
      </div>

      <main className="flex flex-col gap-7 px-5 pt-7 pb-28 md:flex-row md:gap-16 md:px-12 md:pt-8 md:pb-16">
        <div className="hidden w-[840px] shrink-0 grid-cols-2 gap-3 md:grid">
          {product.images.map((image, index) => (
            <Stage key={`${image.url ?? image.alt}-${index}`} src={image.url} alt={image.alt} className="h-[560px]" />
          ))}
        </div>

        <div className="flex w-full flex-col gap-7 md:w-[440px] md:gap-8 md:pt-6">
          <div className="flex flex-col gap-3 md:gap-3.5">
            <nav
              aria-label="Breadcrumb"
              className="flex gap-2 font-[family-name:var(--font-plex)] text-[10px] tracking-[0.14em] text-muted uppercase md:gap-2.5 md:text-[11px]"
            >
              <a href="/#drop">Run</a>
              <span>/</span>
              <a href="/#drop">Layers</a>
            </nav>
            <div className="flex items-start justify-between gap-4 md:flex-col md:gap-3.5">
              <h1 className="text-[26px] leading-[1.02] font-extrabold uppercase md:text-[36px] md:leading-none">
                {product.title}
              </h1>
              <span className="pt-1 font-[family-name:var(--font-plex)] text-[14px] whitespace-nowrap md:pt-0 md:text-[16px]">
                {price}
              </span>
            </div>
            <p className="text-[14px] leading-[1.6] text-pretty text-text-2 md:text-[15px]">{product.description}</p>
          </div>

          {product.options.map((option) =>
            option.name === "Colour" ? (
              <fieldset key={option.name} className="border-0 p-0">
                <legend className="mb-3 text-[13px] text-text-2 md:mb-3.5">
                  Colour: <span className="font-semibold text-text">{selected.Colour}</span>
                </legend>
                <div className="flex gap-2.5 md:gap-3">
                  {option.values.map((name) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={name}
                      aria-pressed={name === selected.Colour}
                      onClick={() => choose(option.name, name)}
                      className={`size-12 cursor-pointer border p-[3px] md:size-11 ${name === selected.Colour ? "border-text" : "border-transparent"}`}
                    >
                      <span className="block size-full border border-control-border" style={{ background: swatchFill(name) }} />
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              <fieldset key={option.name} aria-label={option.name} className="border-0 p-0">
                <div className="mb-3 flex items-center justify-between md:mb-3.5">
                  <span className="text-[13px] text-text-2">{option.name}</span>
                  {option.name === "Size" ? (
                    <button type="button" onClick={() => setGuide(true)} className="cursor-pointer py-3 text-[13px] underline-offset-4">
                      Size guide
                    </button>
                  ) : null}
                </div>
                <div className={`grid grid-cols-3 gap-2 ${option.name === "Size" ? "md:grid-cols-6" : ""}`}>
                  {option.values.map((value) => {
                    const soldOut = variantUnavailable(product, { ...selected, [option.name]: value });
                    const pressed = value === selected[option.name];
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => choose(option.name, value)}
                        className={`h-12 cursor-pointer border font-[family-name:var(--font-plex)] text-[13px] ${
                          soldOut
                            ? `line-through text-dim ${pressed ? "border-text bg-transparent" : "border-control-border bg-transparent"}`
                            : pressed
                              ? "border-text bg-text text-bg"
                              : "border-control-border bg-transparent text-text"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ),
          )}

          <button
            type="button"
            onClick={press}
            className={`hidden h-[60px] items-center justify-between px-6 text-[13px] font-bold tracking-[0.12em] uppercase active:scale-[0.98] md:flex ${actionClass}`}
          >
            <span>{label}</span>
            <ArrowRight className="size-[18px]" strokeWidth={1.5} aria-hidden />
          </button>

          <div className="border-t border-line-strong">
            {product.accordions.map((item, index) => {
              const expanded = open === index;
              return (
                <div key={item.title} className="border-b border-line-strong">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : index)}
                    className="flex h-14 w-full items-center justify-between text-[12px] font-bold tracking-[0.1em] uppercase md:text-[13px]"
                  >
                    <span>{item.title}</span>
                    <span className="font-[family-name:var(--font-plex)] text-[16px] font-normal">
                      {expanded ? "−" : "+"}
                    </span>
                  </button>
                  {expanded ? <p className="mb-5 text-[14px] leading-[1.6] text-text-2">{item.body}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-bg px-4 pt-3 pb-7 md:hidden">
        <button
          type="button"
          onClick={press}
          className={`flex h-14 w-full items-center justify-between px-5 text-[12px] font-bold tracking-[0.12em] uppercase active:scale-[0.98] ${actionClass}`}
        >
          <span>{label}</span>
          <ArrowRight className="size-[18px]" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <SizeGuide open={guide} onClose={() => setGuide(false)} />
      <YouMayAlsoLike product={product} recommendations={recommendations} />
      <Footer theme={theme} />
    </div>
  );
}

function matchingVariant(product: CatalogProduct, selected: Record<string, string>) {
  return product.variants.find((variant) =>
    variant.selectedOptions.every((option) => selected[option.name] === option.value),
  );
}

function variantUnavailable(product: CatalogProduct, selected: Record<string, string>) {
  const variant = matchingVariant(product, selected);
  return Boolean(variant && variant.availableForSale === false);
}

function YouMayAlsoLike({
  product,
  recommendations,
}: {
  product: CatalogProduct;
  recommendations: Recommendation[];
}) {
  const others = recommendations.filter((item) => item.handle !== product.handle).slice(0, 4);

  return (
    <section
      aria-labelledby="you-may-also-like"
      className="flex flex-col gap-6 px-5 pt-16 pb-28 md:gap-10 md:px-12 md:pt-24 md:pb-24"
    >
      <h2 id="you-may-also-like" className="text-[30px] leading-none font-extrabold uppercase md:text-[44px]">
        You may also like
      </h2>
      <div className="flex gap-2.5 overflow-x-auto md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
        {others.map((item) => (
          <article key={item.handle} className="flex w-[160px] shrink-0 flex-col gap-3 md:w-auto md:gap-4">
            <ProductImage
              src={item.imageUrl}
              alt={item.imageAlt ?? ""}
              className="aspect-[3/4]"
              markClassName="w-[72px] opacity-[0.08] md:w-[120px]"
            />
            <div className="flex flex-col gap-1 md:flex-row md:justify-between md:gap-3">
              <a
                href={`/products/${item.handle}`}
                className="text-[12px] font-bold tracking-[0.03em] uppercase md:text-[14px] md:tracking-[0.04em]"
              >
                {item.title}
              </a>
              <span className="font-[family-name:var(--font-plex)] text-[12px] md:text-[13px]">
                {item.amount}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stage({ src, alt, className }: { src?: string; alt: string; className: string }) {
  return (
    <ProductImage
      src={src}
      alt={alt}
      className={className}
      markClassName="h-8 w-24 opacity-[0.08] md:h-12 md:w-[140px]"
    />
  );
}

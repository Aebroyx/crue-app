"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const charts = {
  Tops: {
    columns: ["Chest", "Waist", "Length"],
    notes: [
      ["Chest", "Measure around the fullest part of your chest, keeping the tape level under your arms."],
      ["Waist", "Measure around your natural waist, the narrowest part of your torso."],
      ["Length", "Measured on the garment, from the highest point of the shoulder to the hem."],
    ],
  },
  Bottoms: {
    columns: ["Waist", "Hip", "Inseam"],
    notes: [
      ["Waist", "Measure around your natural waist, the narrowest part of your torso."],
      ["Hip", "Stand with feet together and measure around the fullest part of your hips."],
      ["Inseam", "Measure from the top of your inner thigh down to your ankle."],
    ],
  },
} as const;

type Category = keyof typeof charts;
type Unit = "cm" | "in";

function prefersReducedMotion() {
  if (typeof window.matchMedia !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [category, setCategory] = useState<Category>("Tops");
  const [unit, setUnit] = useState<Unit>("cm");
  const [closing, setClosing] = useState(false);

  onCloseRef.current = onClose;

  function dismiss() {
    if (prefersReducedMotion()) {
      onCloseRef.current();
      return;
    }
    setClosing(true);
  }

  useEffect(() => {
    if (!open) {
      setClosing(false);
      setCategory("Tops");
      setUnit("cm");
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const nodes = [...dialog.querySelectorAll<HTMLElement>("button")];
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;

  const chart = charts[category];
  const value = unit === "cm" ? "[cm]" : "[in]";

  return (
    <div className="fixed inset-0 z-40 flex items-end font-[family-name:var(--font-benzin)] text-text md:items-center md:justify-center">
      <div
        data-scrim
        className="absolute inset-0 bg-[rgba(28,28,26,0.38)] dark:bg-[rgba(5,5,6,0.72)]"
        onClick={dismiss}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        tabIndex={-1}
        onAnimationEnd={(event) => {
          if (event.animationName === "size-guide-out") onCloseRef.current();
        }}
        className={`size-guide-panel relative flex h-[780px] max-h-full w-full flex-col border-t border-line-strong bg-bg outline-none md:h-[760px] md:w-[760px] md:border ${closing ? "size-guide-panel-out" : ""}`}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-line pr-2 pl-5 md:pl-9">
          <h2 className="text-[20px] font-extrabold uppercase">Size guide</h2>
          <button type="button" aria-label="Close size guide" onClick={dismiss} className="flex size-11 items-center justify-center">
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-6 pb-8 md:px-9">
          <div className="flex items-center justify-between gap-3">
            <div role="tablist" aria-label="Category" className="flex border border-control-border">
              {(["Tops", "Bottoms"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={category === tab}
                  onClick={() => setCategory(tab)}
                  className={`h-10 px-4 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] uppercase ${
                    category === tab ? "bg-text text-bg" : "bg-transparent text-text"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div role="group" aria-label="Units" className="flex border border-control-border">
              {(["cm", "in"] as const).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  aria-pressed={unit === choice}
                  onClick={() => setUnit(choice)}
                  className={`h-10 px-4 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] uppercase ${
                    unit === choice ? "bg-text text-bg" : "bg-transparent text-text"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="text-left font-[family-name:var(--font-plex)] text-[11px] font-normal tracking-[0.14em] text-muted uppercase">
                <th scope="col" className="pb-3 font-normal">
                  Size
                </th>
                {chart.columns.map((column) => (
                  <th key={column} scope="col" className="pb-3 font-normal">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size} className="border-t border-line">
                  <th scope="row" className="py-3.5 text-left font-bold">
                    {size}
                  </th>
                  {chart.columns.map((column) => (
                    <td key={column} className="py-3.5 font-[family-name:var(--font-plex)] text-text-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-3.5 pt-2">
            <h3 className="text-[14px] font-extrabold tracking-[0.04em] uppercase">How to measure</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {chart.notes.map(([title, body]) => (
                <div key={title} className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-bold uppercase">{title}</span>
                  <span className="text-[13px] leading-[1.55] text-text-2">{body}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-muted">[Fit note: for example, true to size; size up for a relaxed fit.]</p>
          </div>
        </div>
      </div>
    </div>
  );
}

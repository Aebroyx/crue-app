"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { orderSizeCharts, type SizeChart } from "@/lib/size-chart";

function prefersReducedMotion() {
  if (typeof window.matchMedia !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SizeGuide({
  open,
  onClose,
  charts,
}: {
  open: boolean;
  onClose: () => void;
  charts: SizeChart[];
}) {
  const ordered = orderSizeCharts(charts);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [chartId, setChartId] = useState(ordered[0]?.id ?? "");
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
      setChartId(ordered[0]?.id ?? "");
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
    // Reset the selected chart when the dialog closes. `charts` is read from this render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || ordered.length === 0) return null;

  const chart = ordered.find((item) => item.id === chartId) ?? ordered[0];
  const measureNotes = chart.columns.flatMap((column, index) => {
    const note = chart.notes[index]?.trim() ?? "";
    return note ? [{ column, note }] : [];
  });

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
          {ordered.length > 1 ? (
            <div role="tablist" aria-label="Chart" className="flex border border-control-border">
              {ordered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === chart.id}
                  onClick={() => setChartId(item.id)}
                  className={`h-10 px-4 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] uppercase ${
                    item.id === chart.id ? "bg-text text-bg" : "bg-transparent text-text"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="text-left font-[family-name:var(--font-plex)] text-[11px] font-normal tracking-[0.14em] text-muted uppercase">
                  <th scope="col" className="pb-3 font-normal">
                    Size
                  </th>
                  {chart.columns.map((column, index) => (
                    <th key={`${column}-${index}`} scope="col" className="pb-3 font-normal">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, rowIndex) => (
                  <tr key={`${row.size}-${rowIndex}`} className="border-t border-line">
                    <th scope="row" className="py-3.5 text-left font-bold">
                      {row.size}
                    </th>
                    {chart.columns.map((column, index) => (
                      <td key={`${column}-${index}`} className="py-3.5 font-[family-name:var(--font-plex)] text-text-2">
                        {row.values[index] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3.5 pt-2">
            {chart.unitLabel ? <p className="text-[13px] text-muted">{chart.unitLabel}</p> : null}
            {chart.fitNote ? <p className="text-[13px] text-muted">{chart.fitNote}</p> : null}
            {measureNotes.length > 0 ? (
              <>
                <h3 className="text-[14px] font-extrabold tracking-[0.04em] uppercase">How to measure</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {measureNotes.map((item) => (
                    <div key={item.column} className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-bold uppercase">{item.column}</span>
                      <span className="text-[13px] leading-[1.55] text-text-2">{item.note}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

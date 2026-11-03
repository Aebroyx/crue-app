"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { type BannerSlide } from "@/lib/banners";

const display = "font-extrabold uppercase leading-[0.9] tracking-[-0.02em]";

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function stayedInside(current: EventTarget, next: EventTarget | null) {
  return next instanceof Node && current instanceof Node && current.contains(next);
}

function FrameBackdrop({ slide }: { slide?: BannerSlide }) {
  if (slide?.imageUrl) {
    return (
      <>
        <img src={slide.imageUrl} alt={slide.imageAlt} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(243,243,241,0.28)_0%,rgba(243,243,241,0.08)_22%,rgba(243,243,241,0)_48%)] dark:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_top,rgba(11,11,12,0.34)_0%,rgba(11,11,12,0.1)_24%,rgba(11,11,12,0)_50%)] dark:block" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_60%_32%,#26262A_0%,#121214_50%,#0B0B0C_80%)] md:bg-[radial-gradient(ellipse_60%_70%_at_72%_42%,#26262A_0%,#121214_45%,#0B0B0C_75%)] hidden dark:block" />
      <img
        src="/brand/glow-dark.jpg"
        alt=""
        className="absolute top-[-20%] left-0 h-[180%] w-[160%] max-w-none object-cover opacity-55 dark:hidden"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(243,243,241,0.92)_0%,rgba(243,243,241,0.55)_38%,rgba(243,243,241,0)_70%)] dark:hidden" />
      <img
        src="/brand/crue-mark-white.png"
        alt=""
        className="absolute top-[150px] left-[-60px] w-[520px] opacity-[0.07] md:left-[36%] md:w-[1200px] hidden dark:block"
      />
    </>
  );
}

export function Hero({ slides = [], underNav = false }: { slides?: BannerSlide[]; underNav?: boolean }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const slide = slides[Math.min(index, Math.max(slides.length - 1, 0))];
  const lines = (slide?.heading ?? "").split("\n");
  const showHeading = Boolean(slide?.heading);
  const showBody = Boolean(slide?.body);
  const showWide = Boolean(slide?.bodyWide);
  const showButton = Boolean(slide?.buttonLabel && slide?.buttonHref);
  const showLeft = Boolean(slide?.eyebrow) || showHeading;
  const showRight = showBody || showWide || showButton;

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (slides.length < 2 || hovering || focused || reduced) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [slides.length, hovering, focused, reduced]);

  return (
    <section
      className={`relative h-[700px] overflow-hidden md:h-[820px] ${underNav ? "-mt-[60px] md:-mt-[72px]" : ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={(event) => {
        if (!stayedInside(event.currentTarget, event.relatedTarget)) setHovering(false);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!stayedInside(event.currentTarget, event.relatedTarget)) setFocused(false);
      }}
    >
      <FrameBackdrop slide={slide} />
      {showLeft || showRight ? (
        <div className="absolute right-5 bottom-8 left-5 flex flex-col gap-5 md:right-12 md:bottom-14 md:left-12 md:flex-row md:items-end md:justify-between md:gap-12">
          {showLeft ? (
            <div className="flex flex-col gap-5 md:gap-7">
              {slide?.eyebrow ? (
                <span
                  data-banner-meta={slide.imageUrl ? "" : undefined}
                  className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.2em] text-muted uppercase md:text-[12px]"
                >
                  {slide.eyebrow}
                </span>
              ) : null}
              {showHeading ? (
                <h1 className={`${display} text-[50px] leading-[0.88] md:text-[148px] md:leading-[0.86]`}>
                  {lines.map((line, lineIndex) => (
                    <span key={`${line}-${lineIndex}`}>
                      {lineIndex > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </h1>
              ) : null}
            </div>
          ) : null}
          {showRight && slide ? (
            <div className="flex flex-col gap-5 md:w-[340px] md:gap-7 md:pb-2">
              {showBody || showWide ? (
                <p
                  data-banner-meta={slide.imageUrl ? "" : undefined}
                  className="text-[15px] leading-[1.55] text-text-2 md:text-[16px]"
                >
                  {slide.body}
                  {showWide ? <span className="hidden md:inline">{showBody ? " " : ""}{slide.bodyWide}</span> : null}
                </p>
              ) : null}
              {showButton ? (
                <a
                  href={slide.buttonHref}
                  className="flex h-14 items-center justify-between bg-text px-5 text-[13px] font-bold tracking-[0.12em] text-bg uppercase active:scale-[0.98] md:px-6"
                >
                  <span>{slide.buttonLabel}</span>
                  <ArrowRight className="size-[18px]" strokeWidth={1.5} aria-hidden />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const holdMs = 200;

function reducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ProductImage({
  src,
  alt = "",
  className = "",
  markClassName = "",
}: {
  src?: string;
  alt?: string;
  className?: string;
  markClassName?: string;
}) {
  const photo = src ? src : undefined;
  const [phase, setPhase] = useState<"settled" | "pending" | "pulsing" | "loaded" | "failed">(
    photo ? "pending" : "settled",
  );
  const loadedRef = useRef(false);
  const failedRef = useRef(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    loadedRef.current = false;
    failedRef.current = false;
    if (!photo) {
      setPhase("settled");
      return;
    }
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      loadedRef.current = true;
      setPhase("loaded");
      return;
    }
    setPhase("pending");
    const timer = window.setTimeout(() => {
      if (!loadedRef.current && !failedRef.current) setPhase("pulsing");
    }, holdMs);
    return () => window.clearTimeout(timer);
  }, [photo]);

  function onLoad() {
    loadedRef.current = true;
    setPhase("loaded");
  }

  function onError() {
    failedRef.current = true;
    setPhase("failed");
  }

  const showPhoto = phase === "loaded" && Boolean(photo);
  const pulsing = phase === "pulsing" && !reducedMotion();

  return (
    <div data-product-image className={`flex items-center justify-center overflow-hidden bg-surface ${className}`}>
      {photo ? (
        <img
          ref={imgRef}
          src={photo}
          alt={alt}
          onLoad={onLoad}
          onError={onError}
          className={showPhoto ? "h-full w-full object-cover" : "pointer-events-none absolute h-px w-px opacity-0"}
        />
      ) : null}
      {showPhoto ? null : (
        <div data-placeholder className={pulsing ? "product-image-pulse" : undefined}>
          <img src="/brand/crue-mark-white.png" alt="" className={`hidden dark:block ${markClassName}`} />
          <img src="/brand/crue-mark-black.png" alt="" className={`dark:hidden ${markClassName}`} />
        </div>
      )}
    </div>
  );
}

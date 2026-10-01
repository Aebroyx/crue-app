"use client";

import { useEffect, useState } from "react";
import { themeCookie, type Theme } from "@/lib/theme-cookie";

const themeEvent = "crue-theme";

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
    return;
  }
  delete document.documentElement.dataset.theme;
}

export function ThemeSwitch({ theme }: { theme: Theme }) {
  const [current, setCurrent] = useState(theme);

  useEffect(() => {
    setCurrent(theme);
  }, [theme]);

  useEffect(() => {
    function onTheme(event: Event) {
      setCurrent((event as CustomEvent<Theme>).detail);
    }
    window.addEventListener(themeEvent, onTheme);
    return () => window.removeEventListener(themeEvent, onTheme);
  }, []);

  function toggle() {
    const next: Theme = current === "dark" ? "light" : "dark";
    document.cookie = themeCookie(next);
    applyTheme(next);
    window.dispatchEvent(new CustomEvent(themeEvent, { detail: next }));
  }

  const label = current === "light" ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="relative size-11 overflow-hidden rounded-full border-0 bg-transparent p-0 shadow-none"
    >
      <span className="absolute inset-0 bg-[#0b0b0c]">
        <img
          src="/brand/crue-mark-white.png"
          alt=""
          className="absolute top-1/2 left-1/2 w-9 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </span>
      <span className={`theme-slice ${current === "dark" ? "theme-slice-cut" : ""}`}>
        <img src="/brand/crue-mark-black.png" alt="" className="theme-slice-mark" />
      </span>
    </button>
  );
}

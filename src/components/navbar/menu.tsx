"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, X } from "lucide-react";
import { useAccountUrl } from "@/components/account-url";
import { Wordmark } from "@/components/wordmark";
import { accountLink } from "@/lib/customer-account";
import { chooseTheme, themeEvent, type Theme } from "@/lib/theme-cookie";

const mainLinks = [
  { label: "Shop", href: "/catalog" },
  { label: "About", href: "/about" },
] as const;

const policyLinks = [
  { label: "Shipping & returns", href: "/policies/shipping" },
  { label: "Contact", href: "/policies/shipping" },
] as const;

const socials = ["Instagram", "Strava", "TikTok"] as const;

const themes = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
] as const;

export const menuLink = {
  go(href: string) {
    window.location.assign(href);
  },
};

function prefersReducedMotion() {
  if (typeof window.matchMedia !== "function") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MobileMenu({
  open,
  theme = "light",
  onClose,
  onSizeGuide,
}: {
  open: boolean;
  theme?: Theme;
  onClose: () => void;
  onSizeGuide: () => void;
}) {
  const accountUrl = useAccountUrl();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [current, setCurrent] = useState(theme);
  const [closing, setClosing] = useState(false);

  onCloseRef.current = onClose;

  useEffect(() => {
    setCurrent(theme);
  }, [theme]);

  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setCurrent("dark");
  }, []);

  useEffect(() => {
    function onTheme(event: Event) {
      setCurrent((event as CustomEvent<Theme>).detail);
    }
    window.addEventListener(themeEvent, onTheme);
    return () => window.removeEventListener(themeEvent, onTheme);
  }, []);

  function dismiss() {
    if (prefersReducedMotion()) {
      onCloseRef.current();
      return;
    }
    setClosing(true);
  }

  function follow(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    onCloseRef.current();
    menuLink.go(href);
  }

  useEffect(() => {
    if (!closing) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let closed = false;

    function finish(event?: AnimationEvent) {
      if (closed || (event && event.animationName !== "menu-out")) return;
      closed = true;
      onCloseRef.current();
    }

    dialog.addEventListener("animationend", finish);
    const timer = window.setTimeout(finish, 400);
    return () => {
      dialog.removeEventListener("animationend", finish);
      window.clearTimeout(timer);
    };
  }, [closing]);

  useEffect(() => {
    if (!open) {
      setClosing(false);
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.querySelector<HTMLElement>("button")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const nodes = [...dialog.querySelectorAll<HTMLElement>("button, a")];
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

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
          className={`menu-panel fixed inset-0 z-40 flex flex-col bg-bg font-[family-name:var(--font-benzin)] text-text outline-none md:hidden [&_a]:cursor-pointer [&_button]:cursor-pointer ${closing ? "menu-panel-out" : ""}`}
    >
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line pr-2 pl-5">
        <Wordmark className="h-[18px] w-[86px]" />
        <button type="button" aria-label="Close menu" onClick={dismiss} className="flex size-11 items-center justify-center">
          <X className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <nav aria-label="Main" className="px-5 pt-4">
          {mainLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => follow(event, link.href)}
              className="flex h-16 items-center justify-between border-b border-line text-[32px] font-extrabold uppercase hover:opacity-75"
            >
              <span>{link.label}</span>
              <ArrowRight className="size-[18px]" strokeWidth={1.5} aria-hidden />
            </a>
          ))}
        </nav>
        <nav aria-label="Help" className="flex flex-col px-5 pt-6">
          <button
            type="button"
            onClick={() => accountLink.go(accountUrl)}
            className="flex h-10 items-center bg-transparent text-left text-[15px] text-text-2 hover:opacity-75"
          >
            Account
          </button>
          <a
            href={policyLinks[0].href}
            onClick={(event) => follow(event, policyLinks[0].href)}
            className="flex h-10 items-center text-[15px] text-text-2 hover:opacity-75"
          >
            {policyLinks[0].label}
          </a>
          <button
            type="button"
            onClick={onSizeGuide}
            className="flex h-10 items-center bg-transparent text-left text-[15px] text-text-2 hover:opacity-75"
          >
            Size guide
          </button>
          <a
            href={policyLinks[1].href}
            onClick={(event) => follow(event, policyLinks[1].href)}
            className="flex h-10 items-center text-[15px] text-text-2 hover:opacity-75"
          >
            {policyLinks[1].label}
          </a>
        </nav>
        <div className="mt-auto flex flex-col gap-4 border-t border-line px-5 pt-5 pb-9">
          <span className="font-[family-name:var(--font-plex)] text-[11px] tracking-[0.16em] text-muted uppercase">Theme</span>
          <div role="group" aria-label="Theme" className="grid grid-cols-2">
            {themes.map((choice) => {
              const selected = current === choice.value;
              return (
                <button
                  key={choice.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseTheme(choice.value)}
                  className={`flex h-12 items-center justify-center border font-[family-name:var(--font-plex)] text-[12px] tracking-[0.14em] uppercase ${
                    selected ? "border-text bg-text text-bg" : "border-control-border bg-transparent text-text"
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-5 font-[family-name:var(--font-plex)] text-[11px] tracking-[0.14em] text-muted uppercase">
            {socials.map((label) => (
              <span key={label} className="py-2">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

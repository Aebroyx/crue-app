export const themeCookieName = "crue_theme";

export type Theme = "light" | "dark";

export function themeFromCookie(value: string | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}

export function themeCookie(theme: Theme) {
  return `${themeCookieName}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export const themeEvent = "crue-theme";

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
    return;
  }
  delete document.documentElement.dataset.theme;
}

export function chooseTheme(theme: Theme) {
  document.cookie = themeCookie(theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent(themeEvent, { detail: theme }));
}

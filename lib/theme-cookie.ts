export const themeCookieName = "crue_theme";

export type Theme = "light" | "dark";

export function themeFromCookie(value: string | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}

export function themeCookie(theme: Theme) {
  return `${themeCookieName}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

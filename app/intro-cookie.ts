export const introCookieName = "crue_intro";

export function hasSeenIntro(value: string | undefined) {
  return value === "1";
}

export function introCookie() {
  return `${introCookieName}=1; Path=/; Max-Age=31536000; SameSite=Lax`;
}

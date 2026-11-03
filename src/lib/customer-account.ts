export function customerAccountUrl(domain = process.env.SHOPIFY_STORE_DOMAIN) {
  const host = domain?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "") ?? "";
  if (!host) return "";
  return `https://${host}/account`;
}

export const accountLink = {
  go(href: string) {
    if (!href) return;
    window.location.assign(href);
  },
};

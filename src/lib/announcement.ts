import { storefrontGraphql } from "@/lib/storefront";

export const announcementFallback = {
  mobileText: "Drop 001, out now",
  desktopText: "Drop 001: Event Horizon, out now",
  shippingText: "Free shipping over [THRESHOLD]",
};

export type Announcement = {
  mobileText: string;
  desktopText: string;
  shippingText: string;
};

type Field = { value?: string | null } | null;

type AnnouncementNode = {
  mobile_text?: Field;
  desktop_text?: Field;
  shipping_text?: Field;
};

type AnnouncementPayload = {
  data?: {
    metaobjects?: {
      nodes?: AnnouncementNode[];
    } | null;
  } | null;
};

const announcementQuery = `
  query Announcement {
    metaobjects(type: "announcement", first: 1) {
      nodes {
        mobile_text: field(key: "mobile_text") { value }
        desktop_text: field(key: "desktop_text") { value }
        shipping_text: field(key: "shipping_text") { value }
      }
    }
  }
`;

function slot(value: string | null | undefined, fallback: string) {
  const text = value?.trim() ?? "";
  return text || fallback;
}

export function mapAnnouncement(payload: AnnouncementPayload | null): Announcement {
  const entry = payload?.data?.metaobjects?.nodes?.[0];
  return {
    mobileText: slot(entry?.mobile_text?.value, announcementFallback.mobileText),
    desktopText: slot(entry?.desktop_text?.value, announcementFallback.desktopText),
    shippingText: slot(entry?.shipping_text?.value, announcementFallback.shippingText),
  };
}

export async function requestAnnouncement(fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<AnnouncementPayload>(announcementQuery, {}, fetchImpl);
  return mapAnnouncement(payload);
}

export async function storefrontAnnouncement() {
  if (process.env.NODE_ENV === "test") return announcementFallback;
  return requestAnnouncement();
}

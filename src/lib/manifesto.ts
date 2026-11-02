import { storefrontGraphql } from "@/lib/storefront";

export const manifestoFallback = {
  heading: "Gravity is your training partner.",
  body: "CRUE is built for the hybrid athlete: the one who runs at first light and lifts after dark.",
  bodyWide: "Every piece is cut to move between both.",
  linkLabel: "Read the story",
  linkHref: "#manifesto",
};

export type Manifesto = {
  heading: string;
  body: string;
  bodyWide: string;
  linkLabel: string;
  linkHref: string;
};

type Field = { value?: string | null } | null;

type ManifestoNode = {
  heading?: Field;
  body?: Field;
  body_wide?: Field;
  link_label?: Field;
  link_href?: Field;
};

type ManifestoPayload = {
  data?: {
    metaobjects?: {
      nodes?: ManifestoNode[];
    } | null;
  } | null;
};

const manifestoQuery = `
  query Manifesto {
    metaobjects(type: "manifesto", first: 1) {
      nodes {
        heading: field(key: "heading") { value }
        body: field(key: "body") { value }
        body_wide: field(key: "body_wide") { value }
        link_label: field(key: "link_label") { value }
        link_href: field(key: "link_href") { value }
      }
    }
  }
`;

function slot(value: string | null | undefined, fallback: string) {
  const text = value?.trim() ?? "";
  return text || fallback;
}

export function mapManifesto(payload: ManifestoPayload | null): Manifesto {
  const entry = payload?.data?.metaobjects?.nodes?.[0];
  return {
    heading: slot(entry?.heading?.value, manifestoFallback.heading),
    body: slot(entry?.body?.value, manifestoFallback.body),
    bodyWide: slot(entry?.body_wide?.value, manifestoFallback.bodyWide),
    linkLabel: slot(entry?.link_label?.value, manifestoFallback.linkLabel),
    linkHref: slot(entry?.link_href?.value, manifestoFallback.linkHref),
  };
}

export async function requestManifesto(fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<ManifestoPayload>(manifestoQuery, {}, fetchImpl);
  return mapManifesto(payload);
}

export async function storefrontManifesto() {
  if (process.env.NODE_ENV === "test") return manifestoFallback;
  return requestManifesto();
}

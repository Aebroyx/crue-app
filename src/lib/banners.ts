import { storefrontGraphql } from "@/lib/storefront";

export type BannerSlide = {
  position: number | null;
  imageUrl: string | null;
  imageAlt: string;
  eyebrow: string;
  heading: string;
  body: string;
  bodyWide: string;
  buttonLabel: string;
  buttonHref: string;
};

type ImageReference = {
  __typename?: string;
  image?: { url?: string | null; altText?: string | null } | null;
} | null;

type TextField = { value?: string | null } | null;

type BannerNode = {
  position?: TextField;
  image?: { reference?: ImageReference } | null;
  eyebrow?: TextField;
  heading?: TextField;
  body?: TextField;
  body_wide?: TextField;
  button_label?: TextField;
  button_href?: TextField;
};

type BannerConnection = {
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
  nodes?: BannerNode[];
};

type BannerPayload = {
  data?: {
    metaobjects?: BannerConnection | null;
  } | null;
};

const bannerQuery = `
  query HomeBanners($cursor: String) {
    metaobjects(type: "home_banner", first: 50, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        position: field(key: "position") { value }
        eyebrow: field(key: "eyebrow") { value }
        heading: field(key: "heading") { value }
        body: field(key: "body") { value }
        body_wide: field(key: "body_wide") { value }
        button_label: field(key: "button_label") { value }
        button_href: field(key: "button_href") { value }
        image: field(key: "image") {
          reference {
            __typename
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

function positionOf(value: string | null | undefined) {
  const text = value?.trim() ?? "";
  if (!text) return null;
  const position = Number(text);
  return Number.isFinite(position) ? position : null;
}

function textOf(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function slideFrom(entry: BannerNode): BannerSlide {
  const reference = entry.image?.reference;
  const image = reference?.__typename === "MediaImage" ? reference.image : null;
  const url = image?.url?.trim() ?? "";
  return {
    position: positionOf(entry.position?.value),
    imageUrl: url || null,
    imageAlt: image?.altText ?? "",
    eyebrow: textOf(entry.eyebrow?.value),
    heading: textOf(entry.heading?.value),
    body: textOf(entry.body?.value),
    bodyWide: textOf(entry.body_wide?.value),
    buttonLabel: textOf(entry.button_label?.value),
    buttonHref: textOf(entry.button_href?.value),
  };
}

export function mapBanners(payload: BannerPayload | null): BannerSlide[] {
  const nodes = payload?.data?.metaobjects?.nodes;
  if (!nodes?.length) return [];

  return nodes
    .map(slideFrom)
    .sort((left, right) => {
      if (left.position === null && right.position === null) return 0;
      if (left.position === null) return 1;
      if (right.position === null) return -1;
      return left.position - right.position;
    })
    .slice(0, 10);
}

export async function requestBanners(fetchImpl: typeof fetch = fetch) {
  const nodes: BannerNode[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < 4; page += 1) {
    const payload: BannerPayload | null = await storefrontGraphql<BannerPayload>(bannerQuery, { cursor }, fetchImpl);
    const connection: BannerConnection | null | undefined = payload?.data?.metaobjects;
    if (!connection?.nodes) return [];
    nodes.push(...connection.nodes);
    if (!connection.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) break;
    cursor = connection.pageInfo.endCursor;
  }

  return mapBanners({ data: { metaobjects: { nodes } } });
}

export async function storefrontBanners() {
  if (process.env.NODE_ENV === "test") return [];
  return requestBanners();
}

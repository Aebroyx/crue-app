import { catalogProducts } from "@/lib/catalog";
import { storefrontGraphql } from "@/lib/storefront";

export type SearchHit = {
  id: string;
  handle: string;
  title: string;
  amount: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SearchAnswer = {
  products: SearchHit[];
  queries: string[];
};

export type SearchClient = {
  search(query: string): SearchAnswer | Promise<SearchAnswer>;
};

type PredictivePayload = {
  data?: {
    predictiveSearch?: {
      queries?: { text?: string | null }[];
      products?: {
        id: string;
        handle: string;
        title: string;
        featuredImage?: { url?: string | null; altText?: string | null } | null;
        variants?: { nodes?: { price?: { amount?: string | null } | null }[] };
      }[];
    } | null;
  } | null;
};

export function mapPredictiveSearch(payload: PredictivePayload | null): SearchAnswer {
  const search = payload?.data?.predictiveSearch;
  return {
    products: (search?.products ?? []).map((product) => ({
      id: product.id,
      handle: product.handle,
      title: product.title,
      amount: product.variants?.nodes?.[0]?.price?.amount ?? "",
      imageUrl: product.featuredImage?.url || undefined,
      imageAlt: product.featuredImage?.altText ?? "",
    })),
    queries: (search?.queries ?? []).flatMap((item) => (item.text ? [item.text] : [])),
  };
}

export async function requestPredictiveSearch(query: string, fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<PredictivePayload>(
    `query PredictiveSearch($query: String!) {
      predictiveSearch(query: $query, limit: 10, types: [PRODUCT, QUERY]) {
        queries {
          text
        }
        products {
          id
          handle
          title
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            nodes {
              price {
                amount
              }
            }
          }
        }
      }
    }`,
    { query },
    fetchImpl,
  );
  return mapPredictiveSearch(payload);
}

export function fixtureSearch(query: string): SearchAnswer {
  const needle = query.trim().toLowerCase();
  return {
    products: catalogProducts()
      .filter((product) => `${product.title} ${product.category}`.toLowerCase().includes(needle))
      .map((product) => ({
        id: product.id,
        handle: product.handle,
        title: product.title,
        amount: product.variants[0]?.price.amount ?? "",
        imageUrl: product.images[0]?.url,
        imageAlt: product.images[0]?.alt,
      })),
    queries: [],
  };
}

export const shopifySearchClient: SearchClient = {
  search: (query) => import("@/lib/search-api").then((api) => api.predictiveSearch(query)),
};

const fixtureSearchClient: SearchClient = { search: fixtureSearch };

let client: SearchClient = shopifySearchClient;

export function setSearchClient(next: SearchClient) {
  client = next;
}

export function searchClient() {
  return client;
}

export function resetSearchClient() {
  client = fixtureSearchClient;
}

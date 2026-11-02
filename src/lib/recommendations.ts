import { storefrontGraphql } from "@/lib/storefront";

export type Recommendation = {
  id: string;
  handle: string;
  title: string;
  amount: string;
  imageUrl?: string;
  imageAlt?: string;
};

type RecommendationPayload = {
  data?: {
    productRecommendations?: {
      id: string;
      handle: string;
      title: string;
      featuredImage?: { url?: string | null; altText?: string | null } | null;
      variants?: { nodes?: { price?: { amount?: string | null } | null }[] };
    }[] | null;
  } | null;
};

export function mapProductRecommendations(payload: RecommendationPayload | null): Recommendation[] {
  return (payload?.data?.productRecommendations ?? []).map((product) => ({
    id: product.id,
    handle: product.handle,
    title: product.title,
    amount: product.variants?.nodes?.[0]?.price?.amount ?? "",
    imageUrl: product.featuredImage?.url || undefined,
    imageAlt: product.featuredImage?.altText ?? "",
  }));
}

export async function requestProductRecommendations(productId: string, fetchImpl: typeof fetch = fetch) {
  const payload = await storefrontGraphql<RecommendationPayload>(
    `query ProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
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
    }`,
    { productId },
    fetchImpl,
  );
  return mapProductRecommendations(payload);
}

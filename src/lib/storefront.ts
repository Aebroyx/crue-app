import {
  type CatalogProduct,
  type SelectedOption,
} from "@/lib/catalog";

const apiVersion = "2026-10";

const productQuery = `
  query StorefrontProducts($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        handle
        title
        description
        productType
        options {
          name
          values
        }
        variants(first: 100) {
          nodes {
            id
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
            }
          }
        }
        images(first: 20) {
          nodes {
            url
            altText
          }
        }
      }
    }
  }
`;

type StorefrontNode = {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
  productType?: string | null;
  options?: { name: string; values: string[] }[];
  variants?: {
    nodes?: {
      id: string;
      availableForSale: boolean;
      selectedOptions: SelectedOption[];
      price?: { amount?: string | null } | null;
    }[];
  };
  images?: { nodes?: { url?: string | null; altText?: string | null }[] };
};

type ProductConnection = {
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
  nodes?: StorefrontNode[];
};

type StorefrontPayload = {
  data?: {
    products?: ProductConnection;
  } | null;
};

export function optionName(name: string) {
  return name === "Color" ? "Colour" : name;
}

export function mapStorefrontProduct(node: StorefrontNode): CatalogProduct {
  const options = (node.options ?? []).map((option) => ({
    name: optionName(option.name),
    values: option.values ?? [],
  }));
  const colours = options.find((option) => option.name === "Colour")?.values ?? [];
  const sizes = options.find((option) => option.name === "Size")?.values ?? [];

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? "",
    options,
    variants: (node.variants?.nodes ?? []).map((variant) => ({
      id: variant.id,
      availableForSale: variant.availableForSale,
      selectedOptions: (variant.selectedOptions ?? []).map((option) => ({
        name: optionName(option.name),
        value: option.value,
      })),
      price: { amount: variant.price?.amount ?? "" },
    })),
    images: (node.images?.nodes ?? []).flatMap((image) => {
      const alt = image.altText ?? "";
      if (!image.url && !alt) return [];
      return [{ url: image.url || undefined, alt, altText: alt }];
    }),
    accordions: [],
    category: node.productType ?? "",
    listingColours: colours,
    listingSizes: sizes,
  };
}

export async function storefrontGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
  fetchImpl: typeof fetch,
  env: { domain?: string; token?: string } = {
    domain: process.env.SHOPIFY_STORE_DOMAIN,
    token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
): Promise<T | null> {
  const domain = env.domain?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const token = env.token?.trim();
  if (!domain || !token) return null;

  try {
    const response = await fetchImpl(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function requestStorefrontProducts(
  env: { domain?: string; token?: string },
  fetchImpl: typeof fetch,
): Promise<CatalogProduct[]> {
  const products: CatalogProduct[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < 4; page += 1) {
    const payload: StorefrontPayload | null = await storefrontGraphql<StorefrontPayload>(
      productQuery,
      { cursor },
      fetchImpl,
      env,
    );
    const connection: ProductConnection | undefined = payload?.data?.products;
    if (!connection?.nodes) return [];
    products.push(...connection.nodes.map(mapStorefrontProduct));
    if (!connection.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) break;
    cursor = connection.pageInfo.endCursor;
  }

  return products;
}

export async function storefrontProducts() {
  if (process.env.NODE_ENV === "test") return [];
  return requestStorefrontProducts(
    {
      domain: process.env.SHOPIFY_STORE_DOMAIN,
      token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    fetch,
  );
}

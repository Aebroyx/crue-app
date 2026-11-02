"use server";

import { requestPredictiveSearch } from "@/lib/search";

export async function predictiveSearch(query: string) {
  return requestPredictiveSearch(query);
}

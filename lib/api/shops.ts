import { http } from "./http";

export interface ShopItem {
  id?: number | string;
  name?: string;
  [key: string]: unknown;
}

export interface FindShopResponse {
  data: ShopItem[];
  [key: string]: unknown;
}

export async function findShop(shopName?: string): Promise<FindShopResponse> {
  const normalizedShopName = shopName?.trim();

  return http.get<FindShopResponse>("/shops", {
    query: {
      fields: "name",
      "filters[name][$contains]": normalizedShopName || undefined,
    },
  });
}

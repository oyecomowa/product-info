import { http } from "./http";

export interface WarrantyInfo {
  snOrImei: string;
  model: string;
  customerName: string;
  customerPhone: string;
  shopName: string;
  purchaseDate: string;
}

export interface WarrantyDocument {
  documentId?: string;
  id?: number | string;
  sn?: string;
  imei?: string;
  model?: string;
  customerName?: string;
  customerPhone?: string;
  shopName?: string;
  purchaseDate?: string;
  expiresDate?: string;
  [key: string]: unknown;
}

export interface SearchWarrantyData {
  model?: string;
  sn?: string;
  imei?: string;
  purchaseDate?: string;
  expiresDate?: string;
  [key: string]: unknown;
}

export interface SearchWarrantyResponse {
  data: SearchWarrantyData;
  [key: string]: unknown;
}

export interface ActivateWarrantyResponse {
  data: WarrantyDocument;
  [key: string]: unknown;
}

export async function activateWarranty(
  warrantyInfo: WarrantyInfo,
): Promise<ActivateWarrantyResponse> {
  return http.post<ActivateWarrantyResponse>("/warranties/activate", {
    snOrImei: warrantyInfo.snOrImei,
    model: warrantyInfo.model,
    customerName: warrantyInfo.customerName,
    customerPhone: warrantyInfo.customerPhone,
    shopName: warrantyInfo.shopName,
    purchaseDate: warrantyInfo.purchaseDate,
  });
}

export async function searchWarranty(snOrImei: string): Promise<SearchWarrantyResponse> {
  const normalizedSnOrImei = snOrImei.trim();

  return http.get<SearchWarrantyResponse>("/warranties/search", {
    query: {
      snOrImei: normalizedSnOrImei || undefined,
    },
  });
}

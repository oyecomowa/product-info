import { http } from "./http";

export interface WarrantyInfo {
  sn: string;
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
  model?: string;
  customerName?: string;
  customerPhone?: string;
  shopName?: string;
  purchaseDate?: string;
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
    sn: warrantyInfo.sn,
    model: warrantyInfo.model,
    customerName: warrantyInfo.customerName,
    customerPhone: warrantyInfo.customerPhone,
    shopName: warrantyInfo.shopName,
    purchaseDate: warrantyInfo.purchaseDate,
  });
}

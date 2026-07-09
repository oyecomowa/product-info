"use client";

import PageHeroHeader from "@/components/PageHeroHeader";
import type { WarrantyDocument } from "@/lib/api";
import { useState } from "react";

function formatDateForDisplay(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "N/A";
  }

  const normalizedValue = value.trim();
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return normalizedValue;
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parsedDate);
}

export default function ProductRegistrationResultPage() {
  const [warrantyData] = useState<WarrantyDocument | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const serialized = sessionStorage.getItem("warranty-registration-result");
    if (!serialized) {
      return null;
    }

    try {
      return JSON.parse(serialized) as WarrantyDocument;
    } catch {
      return null;
    }
  });

  return (
    <main className="min-h-screen w-full bg-[#f5f5f6]">
      <PageHeroHeader title="Registration Successful" />

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="rounded-xl border border-[#d8dee4] bg-white p-5 shadow-sm sm:p-7">
            <p className="mt-2 text-base text-[#4b5563]">Your warranty has been registered successfully.</p>

            {warrantyData ? (
              <div className="mt-6 overflow-hidden rounded-lg border border-[#d8dee4] bg-white">
                <table className="min-w-full border-collapse text-sm text-[#1f2937] sm:text-base">
                  <tbody>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        Serial Number
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{warrantyData.sn || "N/A"}</td>
                    </tr>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        IMEI
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{warrantyData.imei || "N/A"}</td>
                    </tr>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        Model
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{warrantyData.model || "N/A"}</td>
                    </tr>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        Customer
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{warrantyData.customerName || "N/A"}</td>
                    </tr>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        Customer Phone
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{warrantyData.customerPhone || "N/A"}</td>
                    </tr>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        Shop Name
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{warrantyData.shopName || "N/A"}</td>
                    </tr>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        Purchase Date
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{formatDateForDisplay(warrantyData.purchaseDate)}</td>
                    </tr>
                    <tr className="border-t border-[#e5e7eb] odd:bg-white even:bg-[#fafbfc]">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-[#374151]">
                        Expiration Date
                      </th>
                      <td className="px-4 py-3 text-left text-[#111827]">{formatDateForDisplay(warrantyData.expiresDate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-6 rounded-md border border-[#f5d0d0] bg-[#fff6f6] px-4 py-3 text-sm text-[#991b1b] sm:text-base">
                No registration result found. Please submit the form again.
              </p>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}

"use client";

import Alert from "@/components/Alert";
import PageHeroHeader from "@/components/PageHeroHeader";
import { ApiError, searchWarranty } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductInformationPage() {
  const router = useRouter();
  const [serialNumber, setSerialNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCheck(): Promise<void> {
    if (!serialNumber.trim()) {
      setErrorMessage("Serial Number is required.");
      return;
    }

    setIsChecking(true);

    try {
      const response = await searchWarranty(serialNumber);
      sessionStorage.setItem("warranty-search-result", JSON.stringify(response.data));
      router.push("/product-information/result");
    } catch (err) {
      let nextErrorMessage = "Failed to check warranty information. Please try again.";

      if (err instanceof ApiError) {
        const details = err.details as Record<string, unknown>;
        if (details && typeof details === "object" && "error" in details) {
          const error = details.error as Record<string, unknown>;
          if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
            nextErrorMessage = error.message;
          }
        }
      } else if (err instanceof Error) {
        nextErrorMessage = err.message;
      }

      setErrorMessage(nextErrorMessage);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f5f5f6]">
      {errorMessage && (
        <Alert
          type="error"
          title="Something went wrong?"
          message={errorMessage}
          primaryButton={{
            label: "Close",
            onClick: () => setErrorMessage(""),
          }}
          onClose={() => setErrorMessage("")}
          autoClose={false}
        />
      )}

      <PageHeroHeader title="Product Information" />

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-[760px] space-y-4">
          <input
            type="text"
            name="serialNumber"
            value={serialNumber}
            placeholder="Serial Number"
            onChange={(event) => setSerialNumber(event.target.value)}
            className="h-12 w-full rounded-md border border-[#b3b3b6] bg-transparent px-3 text-lg text-[#1f1f1f] outline-none transition focus:border-[#7f7f83]"
          />

          <button
            type="button"
            onClick={handleCheck}
            disabled={isChecking}
            className="h-12 w-full rounded-md border border-[#b3b3b6] bg-transparent text-lg font-semibold text-[#191919] transition hover:bg-white"
          >
            {isChecking ? "Checking..." : "Check"}
          </button>
        </div>
      </section>
    </main>
  );
}

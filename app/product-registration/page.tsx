"use client";

import Alert from "@/components/Alert";
import PageHeroHeader from "@/components/PageHeroHeader";
import { activateWarranty, ApiError, findShop, type ShopItem } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function extractShopName(shop: ShopItem): string | null {
  if (typeof shop.name === "string" && shop.name.trim()) {
    return shop.name.trim();
  }

  const shopWithAttributes = shop as ShopItem & {
    attributes?: {
      name?: unknown;
    };
  };

  if (typeof shopWithAttributes.attributes?.name === "string") {
    const normalizedName = shopWithAttributes.attributes.name.trim();
    return normalizedName || null;
  }

  return null;
}

function toUniqueShopNames(shops: ShopItem[]): string[] {
  return [...new Set(shops.map(extractShopName).filter((name): name is string => Boolean(name)))];
}

export default function ProductRegistrationPage() {
  const router = useRouter();
  const [snOrImei, setSnOrImei] = useState("");
  const [model, setModel] = useState("");
  const [snModelError, setSnModelError] = useState("");

  const [purchaseDate, setPurchaseDate] = useState(() => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
  });
  const [customerName, setCustomerName] = useState("");
  const [customerNameError, setCustomerNameError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopNameError, setShopNameError] = useState("");
  const [shopOptions, setShopOptions] = useState<string[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [showShopOptions, setShowShopOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeRequestIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadShops(keyword?: string): Promise<void> {
    const requestId = ++activeRequestIdRef.current;
    setIsLoadingShops(true);

    try {
      const response = await findShop(keyword);

      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      const nextOptions = toUniqueShopNames(response.data ?? []);
      setShopOptions(nextOptions);
      setShowShopOptions(true);
    } catch {
      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      setShopOptions([]);
      setShowShopOptions(true);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoadingShops(false);
      }
    }
  }

  function handleShopFocus(): void {
    void loadShops();
  }

  function handleShopNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setShopName(value);
    if (shopNameError) setShopNameError("");
    setShowShopOptions(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      void loadShops(value);
    }, 250);
  }

  function handleSelectShop(nextShopName: string): void {
    setShopName(nextShopName);
    setShopNameError("");
    setShowShopOptions(false);
  }

  function handleShopBlur(): void {
    setTimeout(() => {
      setShowShopOptions(false);
    }, 120);
  }

  async function handleSave(): Promise<void> {
    let hasError = false;

    if (!snOrImei.trim() || !model.trim()) {
      setSnModelError("Serial Number/IMEI and Model are required.");
      hasError = true;
    } else {
      setSnModelError("");
    }

    if (!customerName.trim()) {
      setCustomerNameError("Customer Name is required.");
      hasError = true;
    } else {
      setCustomerNameError("");
    }

    if (!phoneNumber.trim()) {
      setPhoneNumberError("Phone Number is required.");
      hasError = true;
    } else {
      setPhoneNumberError("");
    }

    if (!shopName.trim()) {
      setShopNameError("Shop Name is required.");
      hasError = true;
    } else {
      setShopNameError("");
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const response = await activateWarranty({
        snOrImei: snOrImei.trim(),
        model: model.trim(),
        customerName: customerName.trim(),
        customerPhone: phoneNumber.trim(),
        shopName: shopName.trim(),
        purchaseDate,
      });

      sessionStorage.setItem("warranty-registration-result", JSON.stringify(response.data));
      router.push("/product-registration/result");
    } catch (err) {
      let errorMessage = "Failed to submit warranty registration. Please try again.";

      if (err instanceof ApiError) {
        // Extract error message from API response: { data: null, error: { message: "..." } }
        const details = err.details as Record<string, unknown>;
        if (details && typeof details === "object" && "error" in details) {
          const error = details.error as Record<string, unknown>;
          if (error && typeof error === "object" && "message" in error) {
            errorMessage = error.message as string;
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

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

      <PageHeroHeader title="Product Registration" />

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-[760px]">
          <form className="space-y-4" action="#" method="post">
            <input
              type="text"
              name="snOrImei"
              value={snOrImei}
              placeholder="Serial Number/IMEI"
              onChange={(e) => {
                setSnOrImei(e.target.value);
                if (snModelError) setSnModelError("");
              }}
              className={`h-12 w-full rounded-md border bg-transparent px-3 text-lg text-[#1f1f1f] outline-none transition ${
                snModelError ? "border-red-400 focus:border-red-400" : "border-[#b3b3b6] focus:border-[#7f7f83]"
              }`}
            />
            <input
              type="text"
              name="model"
              value={model}
              placeholder="Model"
              onChange={(e) => {
                setModel(e.target.value);
                if (snModelError) setSnModelError("");
              }}
              className={`h-12 w-full rounded-md border bg-transparent px-3 text-lg text-[#1f1f1f] outline-none transition ${
                snModelError ? "border-red-400 focus:border-red-400" : "border-[#b3b3b6] focus:border-[#7f7f83]"
              }`}
            />
            {snModelError ? (
              <p className="-mt-2 text-sm text-red-500">{snModelError}</p>
            ) : null}
            <input
              type="text"
              name="customerName"
              value={customerName}
              placeholder="Customer Name"
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (customerNameError) setCustomerNameError("");
              }}
              className={`h-12 w-full rounded-md border bg-transparent px-3 text-lg text-[#1f1f1f] outline-none transition ${
                customerNameError ? "border-red-400 focus:border-red-400" : "border-[#b3b3b6] focus:border-[#7f7f83]"
              }`}
            />
            {customerNameError ? (
              <p className="-mt-2 text-sm text-red-500">{customerNameError}</p>
            ) : null}
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Phone Number"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (phoneNumberError) setPhoneNumberError("");
              }}
              className={`h-12 w-full rounded-md border bg-transparent px-3 text-lg text-[#1f1f1f] outline-none transition ${
                phoneNumberError ? "border-red-400 focus:border-red-400" : "border-[#b3b3b6] focus:border-[#7f7f83]"
              }`}
            />
            {phoneNumberError ? (
              <p className="-mt-2 text-sm text-red-500">{phoneNumberError}</p>
            ) : null}
            <input
              type="date"
              name="purchaseDate"
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
              className="h-12 w-full rounded-md border border-[#b3b3b6] bg-transparent px-3 text-lg text-[#1f1f1f] outline-none transition focus:border-[#7f7f83]"
            />
            <div className="relative">
              <input
                type="text"
                name="shopName"
                value={shopName}
                placeholder="Shop Name"
                autoComplete="off"
                onFocus={handleShopFocus}
                onClick={handleShopFocus}
                onChange={handleShopNameChange}
                onBlur={handleShopBlur}
                className={`h-12 w-full rounded-md border bg-transparent px-3 text-lg text-[#1f1f1f] outline-none transition ${
                  shopNameError ? "border-red-400 focus:border-red-400" : "border-[#b3b3b6] focus:border-[#7f7f83]"
                }`}
              />
              {shopNameError ? (
                <p className="mt-1 text-sm text-red-500">{shopNameError}</p>
              ) : null}

              {showShopOptions ? (
                <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-[#b3b3b6] bg-[#f5f5f6] shadow-sm">
                  {isLoadingShops ? (
                    <li className="px-3 py-2 text-base text-[#666]">Loading shops...</li>
                  ) : null}

                  {!isLoadingShops && shopOptions.length === 0 ? (
                    <li className="px-3 py-2 text-base text-[#666]">No shops found</li>
                  ) : null}

                  {!isLoadingShops
                    ? shopOptions.map((option) => (
                        <li key={option}>
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-left text-base text-[#1f1f1f] transition hover:bg-[#ececef]"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              handleSelectShop(option);
                            }}
                          >
                            {option}
                          </button>
                        </li>
                      ))
                    : null}
                </ul>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="h-12 w-full rounded-md border border-[#b3b3b6] bg-transparent text-lg font-semibold text-[#191919] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Save"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

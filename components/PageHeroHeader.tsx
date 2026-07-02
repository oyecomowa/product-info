"use client";

import { useRouter } from "next/navigation";

interface PageHeroHeaderProps {
  title: string;
}

export default function PageHeroHeader({ title }: PageHeroHeaderProps) {
  const router = useRouter();

  function handleBack(): void {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <section className="flex h-[28vh] min-h-[150px] items-end bg-[#d7d7dc] px-4 pb-5 sm:pb-6">
      <div className="mx-auto w-full max-w-[760px]">
        <button
          type="button"
          onClick={handleBack}
          className="mb-3 inline-flex items-center gap-2 text-base font-medium text-[#444] transition hover:text-[#111]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 2048 2048"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M0 0h2048v2048H0z" fill="none" />
            <path fill="currentColor" d="M2048 1088H250l787 787l-90 90L6 1024L947 83l90 90l-787 787h1798z" />
          </svg>
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-[#101010] sm:text-4xl">{title}</h1>
      </div>
    </section>
  );
}

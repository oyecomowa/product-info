import Image from "next/image";
import Link from "next/link";

function RegistrationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 sm:h-7 sm:w-7"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="currentColor"
        d="m21.7 13.6l-1.3-1.3c-.1-.1-.2-.2-.4-.2c-.1 0-.3.1-.4.2l-1 1l2 2l1-1c.3-.2.3-.5.1-.7M12 19.9V22h2.1l6.1-6.1l-2-2.1zm-2 2.4c-4.1-2-7-6.5-7-11.3V5l9-4l9 4v3.1l-2 2V6.3l-7-3.1l-7 3.1v4.9c0 3.5 2.2 7.1 5 8.9z"
      />
    </svg>
  );
}

function InformationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 sm:h-7 sm:w-7"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="m21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-hidden bg-[#f4f4f5]">
      <section className="w-full overflow-hidden bg-[#d7d7dc]">
        <Image
          src="/img/banner.png"
          alt="Product banner"
          width={1920}
          height={1080}
          sizes="100vw"
          priority
          style={{ height: "auto" }}
          className="relative left-1/2 block h-auto w-[200%] max-w-none -translate-x-1/2 sm:left-0 sm:w-full sm:max-w-full sm:translate-x-0"
        />
      </section>

      <section className="flex flex-1 items-center justify-center bg-[#f5f5f6] px-4 py-10 sm:items-start sm:px-6 sm:py-16">
        <div className="flex w-full max-w-[760px] flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <Link
            href="/product-registration"
            className="flex w-full max-w-[320px] items-center justify-center gap-2 rounded-2xl border border-[#a9a9ac] bg-[#f7f7f7] px-6 py-3 text-lg font-medium text-[#151515] shadow-[0_1px_0_rgba(0,0,0,0.05)] transition hover:bg-white sm:w-auto sm:min-w-[230px] sm:gap-3 sm:text-[1.5rem]"
          >
            <RegistrationIcon />
            <span>Product Registration</span>
          </Link>
          <Link
            href="/product-information"
            className="flex w-full max-w-[320px] items-center justify-center gap-2 rounded-2xl border border-[#a9a9ac] bg-[#f7f7f7] px-6 py-3 text-lg font-medium text-[#151515] shadow-[0_1px_0_rgba(0,0,0,0.05)] transition hover:bg-white sm:w-auto sm:min-w-[230px] sm:gap-3 sm:text-[1.5rem]"
          >
            <InformationIcon />
            <span>Product Information</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

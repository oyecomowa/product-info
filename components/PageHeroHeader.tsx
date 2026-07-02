interface PageHeroHeaderProps {
  title: string;
}

export default function PageHeroHeader({ title }: PageHeroHeaderProps) {
  return (
    <section className="flex h-[28vh] min-h-[150px] items-end bg-[#d7d7dc] px-4 pb-5 sm:pb-6">
      <div className="mx-auto w-full max-w-[760px]">
        <h1 className="text-2xl font-semibold tracking-tight text-[#101010] sm:text-4xl">{title}</h1>
      </div>
    </section>
  );
}

type Props = Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  inverse?: boolean;
}>;

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  inverse = false,
}: Props) {
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#3163a2] dark:text-[#9dbf14]">
        {eyebrow}
      </p>

      <h2
        className={`text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${
          inverse ? "text-white" : "text-[#22264b] dark:text-white"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 text-base leading-7 ${
            inverse ? "text-slate-300" : "text-slate-600 dark:text-slate-300"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

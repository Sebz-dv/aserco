import { motion, useReducedMotion } from "motion/react";

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
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`w-full ${centered ? "mx-auto text-center" : "text-left"}`}
    >
      <div
        className={`mb-4 flex items-center gap-3 ${
          centered ? "justify-center" : "justify-start"
        }`}
      >
        <span className="h-[2px] w-8 rounded-full bg-[#9dbf14]" />

        <span
          className={`text-xs font-bold uppercase tracking-[0.22em] ${
            inverse ? "text-[#b5d83d]" : "text-[#829f12] dark:text-[#b5d83d]"
          }`}
        >
          {eyebrow}
        </span>
      </div>

      <h2
        className={`max-w-4xl text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl ${
          inverse ? "text-white" : "text-[#22264b] dark:text-white"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 max-w-3xl text-sm leading-7 sm:text-base ${
            centered ? "mx-auto" : ""
          } ${
            inverse ? "text-white/75" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

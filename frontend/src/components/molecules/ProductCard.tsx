import type { LucideIcon } from "lucide-react";

type Props = Readonly<{
  title: string;
  description: string;
  icon: LucideIcon;
  tag: string;
}>;

export function ProductCard({ title, description, icon: Icon, tag }: Props) {
  return (
    <article className="rounded-[26px] border border-slate-200/90 bg-white/90 p-6 shadow-[0_14px_35px_rgba(34,38,75,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9dbf14]/50 hover:shadow-[0_22px_45px_rgba(34,38,75,0.09)] dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#eaf3ff] text-[#3163a2] shadow-sm shadow-[#3163a2]/10 dark:bg-[#3163a2]/10 dark:text-[#9dbf14]">
          <Icon size={21} />
        </span>

        <span className="rounded-full bg-[#edf5c5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#22264b] dark:bg-white/10 dark:text-slate-300">
          {tag}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-[#22264b] dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </article>
  );
}

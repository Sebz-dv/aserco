import type { LucideIcon } from "lucide-react";

type Props = Readonly<{
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}>;

export function ServiceCard({ number, title, description, icon: Icon }: Props) {
  return (
    <article className="group rounded-[28px] border border-slate-200/90 bg-white/90 p-7 shadow-[0_18px_45px_rgba(34,38,75,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#9dbf14]/60 hover:shadow-[0_24px_60px_rgba(34,38,75,0.12)] dark:border-white/10 dark:bg-[#111d35]/90 dark:hover:border-[#9dbf14]/40">
      <div className="mb-9 flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#edf5c5] text-[#3163a2] shadow-sm shadow-[#9dbf14]/10 dark:bg-[#9dbf14]/10 dark:text-[#9dbf14]">
          <Icon size={23} />
        </span>

        <span className="text-xs font-semibold tracking-[0.2em] text-slate-400">
          {number}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-[#22264b] dark:text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </article>
  );
}

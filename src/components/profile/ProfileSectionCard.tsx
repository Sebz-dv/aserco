import { ChevronRight, type LucideIcon } from "lucide-react";

type Props = Readonly<{
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}>;

export function ProfileSectionCard({ icon: Icon, title, description, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3163a2]/40 hover:shadow-md dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/40"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf5c5] text-[#3163a2] dark:bg-[#9dbf14]/15 dark:text-[#c7e66b]">
        <Icon size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-[#22264b] dark:text-white">{title}</span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{description}</span>
      </span>

      <ChevronRight size={18} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

import { ArrowLeft } from "lucide-react";

type Props = Readonly<{
  title: string;
  description: string;
  onBack?: () => void;
}>;

export function ProfilePageHeader({ title, description, onBack }: Props) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#22264b] dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#22264b] transition hover:border-[#3163a2]/40 hover:text-[#3163a2] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-[#9dbf14]/40 dark:hover:text-[#9dbf14]"
          >
            <ArrowLeft size={14} />
            Volver a Mi perfil
          </button>
        )}
      </div>
    </div>
  );
}

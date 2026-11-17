import type { ReactNode } from "react";

type Props = Readonly<{
  title: string;
  subtitle: string;
  breadcrumb: string;
  onBackHome: () => void;
  children: ReactNode;
}>;

export function ProfileLayout({
  title,
  subtitle,
  breadcrumb,
  onBackHome,
  children,
}: Props) {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 pb-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3163a2] dark:text-[#9dbf14]">
              {breadcrumb}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#22264b] dark:text-white">{title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onBackHome}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#22264b] transition hover:border-[#3163a2]/40 hover:text-[#3163a2] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-[#9dbf14]/40 dark:hover:text-[#9dbf14]"
          >
            Volver a Mi perfil
          </button>
        </div>
      </div>

      {children}
    </section>
  );
}

import { LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';

type DashboardNavbarProps = Readonly<{
  dark: boolean;
  onBackHome: () => void;
  onToggleTheme: () => void;
}>;

export function DashboardNavbar({ dark, onBackHome, onToggleTheme }: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#111d35]/90">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">
          Panel
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-[#22264b] dark:border-white/10 dark:bg-white/5 dark:text-white sm:flex">
          <LayoutDashboard size={15} />
          <span>Administrador</span>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Cambiar tema"
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white/80 text-[#3163a2] shadow-sm transition hover:-translate-y-0.5 hover:text-[#9dbf14] dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#22264b] dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>
    </header>
  );
}

import type { SidebarSectionHeaderProps } from "./sidebar.types";
export function SidebarSectionHeader({
  icon: Icon,
  label,
  sidebarOpen,
  dark,
}: SidebarSectionHeaderProps) {
  return (
    <div
      className={`
        mb-3 overflow-hidden px-3
        transition-all duration-150
        ${sidebarOpen ? "max-h-7 opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <p
        className={`
          inline-flex items-center gap-1.5 whitespace-nowrap
          rounded-full px-2 py-1 text-[10px] font-bold uppercase
          tracking-[0.2em]
          ${
            dark
              ? "bg-white/4 text-slate-400"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >
        <Icon size={11} strokeWidth={2.1} />
        {label}
      </p>
    </div>
  );
}

import { BookOpenText, LayoutDashboard } from "lucide-react";
import { SidebarAction } from "./SidebarAction";
import { SidebarSectionHeader } from "./SidebarSectionHeader";

type SidebarNavigationProps = {
  readonly dark: boolean;
  readonly sidebarOpen: boolean;
  readonly activeSection: string;
  readonly showKnowledge: boolean;
  readonly onOpenOverview?: () => void;
  readonly onOpenKnowledge?: () => void;
};

export function SidebarNavigation({
  dark,
  sidebarOpen,
  activeSection,
  showKnowledge,
  onOpenOverview,
  onOpenKnowledge,
}: SidebarNavigationProps) {
  return (
    <nav
      aria-label="Navegación"
      className={`
        min-h-0 flex-1 overflow-y-auto overscroll-contain
        py-6 transition-all duration-200
        ${sidebarOpen ? "px-3" : "px-2"}
      `}
    >
      <SidebarSectionHeader
        icon={LayoutDashboard}
        label="Principal"
        sidebarOpen={sidebarOpen}
        dark={dark}
      />

      <div className="flex flex-col gap-2">
        <SidebarAction
          icon={LayoutDashboard}
          label="Inicio"
          sidebarOpen={sidebarOpen}
          dark={dark}
          active={activeSection === "overview"}
          onClick={() => onOpenOverview?.()}
        />

        {showKnowledge && (
          <SidebarAction
            icon={BookOpenText}
            label="Conocimiento"
            sidebarOpen={sidebarOpen}
            dark={dark}
            active={activeSection === "knowledge"}
            onClick={() => onOpenKnowledge?.()}
          />
        )}
      </div>

      <div className="my-5 px-3">
        <div
          className={`
            h-px rounded-full
            ${
              dark
                ? "bg-linear-to-r from-transparent via-white/[0.14] to-transparent"
                : "bg-linear-to-r from-transparent via-slate-300 to-transparent"
            }
          `}
        />
      </div>
    </nav>
  );
}

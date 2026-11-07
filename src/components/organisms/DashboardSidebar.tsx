import {
  Home,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  ChevronRight,
  LayoutDashboard,
  BookOpenText,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { AuthUser } from "../../lib/api";

const logoAserco = new URL(
  "../../assets/logos/LogoAserco1.png",
  import.meta.url,
).href;

const logoColor = new URL("../../assets/logos/logoColor.png", import.meta.url).href;

const logoAsercoDark = new URL(
  "../../assets/logos/logoAsercoDark.png",
  import.meta.url,
).href;

export type DashboardSection = "overview" | "users" | "roles" | "knowledge";

type DashboardSidebarProps = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  sidebarOpen: boolean;
  activeSection?: DashboardSection;
  onToggleSidebar: () => void;
  onBackHome: () => void;
  onLogout: () => void;
  onConfirmLogout?: () => void;
  showKnowledge?: boolean;
  onOpenOverview?: () => void;
  onOpenUsers?: () => void;
  onOpenRoles?: () => void;
  onOpenKnowledge?: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}>;

type SidebarActionProps = Readonly<{
  icon: LucideIcon;
  label: string;
  sidebarOpen: boolean;
  dark: boolean;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}>;

function SidebarAction({
  icon: Icon,
  label,
  sidebarOpen,
  dark,
  active = false,
  danger = false,
  onClick,
}: SidebarActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={!sidebarOpen ? label : undefined}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`
        group relative flex w-full min-w-0 items-center
        overflow-hidden rounded-xl py-2.5
        transition-all duration-200
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-[#9dbf14]

        ${sidebarOpen ? "justify-start gap-3 px-3" : "justify-center px-0"}

        ${
          active
            ? dark
              ? "bg-[#9dbf14]/[0.12] text-[#dff090] ring-1 ring-inset ring-[#9dbf14]/[0.18]"
              : "bg-[#edf5c5] text-[#22264b] ring-1 ring-inset ring-[#9dbf14]/30"
            : danger
              ? dark
                ? "text-slate-400 hover:bg-red-500/[0.10] hover:text-red-300"
                : "text-slate-600 hover:bg-red-50 hover:text-red-600"
              : dark
                ? "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                : "text-slate-600 hover:bg-slate-200/70 hover:text-[#22264b]"
        }
      `}
    >
      {active && (
        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#b5d83d]" />
      )}

      <span
        className={`
          grid size-10 shrink-0 place-items-center
          rounded-xl transition-colors duration-200

          ${
            active
              ? dark
                ? "bg-[#9dbf14]/15 group-hover:bg-[#9dbf14]/25"
                : "bg-white shadow-sm"
              : danger
                ? dark
                  ? "bg-white/[0.04] group-hover:bg-red-500/10"
                  : "bg-slate-100 group-hover:bg-red-100"
                : dark
                  ? "bg-white/[0.04] group-hover:bg-white/[0.09]"
                  : "bg-white ring-1 ring-slate-200/70 group-hover:bg-slate-50"
          }
        `}
      >
        <Icon size={19} strokeWidth={1.8} className="shrink-0" />
      </span>

      <span
        className={`
          min-w-0 flex-1 overflow-hidden whitespace-nowrap
          text-left text-[13px]
          transition-all duration-200
          ${sidebarOpen ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0"}
          ${active ? "font-semibold" : "font-medium"}
        `}
      >
        {label}
      </span>

      {active && sidebarOpen && (
        <ChevronRight size={16} strokeWidth={1.8} className="shrink-0 text-[#b5d83d]" />
      )}
    </button>
  );
}

export function DashboardSidebar({
  dark,
  user,
  sidebarOpen,
  activeSection = "overview",
  onToggleSidebar,
  onBackHome,
  onLogout,
  onConfirmLogout,
  showKnowledge = false,
  onOpenOverview,
  onOpenUsers,
  onOpenRoles,
  onOpenKnowledge,
  onMouseEnter,
  onMouseLeave,
}: DashboardSidebarProps) {
  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "A";

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Menú principal"
      className={`
        sticky top-0 hidden h-[100dvh] shrink-0 flex-col
        overflow-hidden border-r
        transition-[width] duration-300 ease-in-out
        lg:flex
        ${sidebarOpen ? "w-72" : "w-[76px]"}
        ${
          dark
            ? "border-white/[0.06] bg-[#171d3d] text-white"
            : "border-slate-200 bg-[#f7f9fc] text-[#22264b]"
        }
      `}
    >
      <div
        className={`
          pointer-events-none absolute -right-28 top-24
          size-72 rounded-full blur-3xl
          ${dark ? "bg-[#3163a2]/10" : "bg-[#dfeafc]/80"}
        `}
      />

      <div
        className={`
          pointer-events-none absolute -bottom-32 -left-24
          size-64 rounded-full blur-3xl
          ${dark ? "bg-[#9dbf14]/[0.06]" : "bg-[#edf5c5]/80"}
        `}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <header
          className={`
            flex h-[88px] shrink-0 items-center border-b
            transition-all duration-300
            ${sidebarOpen ? "justify-between px-5" : "justify-center px-2"}
            ${dark ? "border-white/[0.07]" : "border-slate-200"}
          `}
        >
          <div
            className={`
              flex shrink-0 items-center justify-center
              overflow-hidden transition-all duration-300
              ${
                sidebarOpen
                  ? "h-10 w-[135px] bg-transparent"
                  : `size-10 rounded-xl shadow-lg ${
                      dark
                        ? "bg-white shadow-black/10"
                        : "bg-white ring-1 ring-slate-200 shadow-slate-200/60"
                    }`
              }
            `}
          >
            {sidebarOpen ? (
              <>
                <img src={logoAserco} alt="Aserco Smart Finance" className="hero-logo-light h-full w-full" />
                <img src={logoAsercoDark} alt="" aria-hidden="true" className="hero-logo-dark" />
              </>
            ) : (
              <img src={logoColor} alt="Aserco" className="h-full w-full object-contain p-2" />
            )}
          </div>

          {sidebarOpen && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Contraer menú"
              aria-expanded={sidebarOpen}
              title="Contraer menú"
              className={`
                grid size-10 shrink-0 place-items-center
                rounded-xl transition
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#9dbf14]
                ${
                  dark
                    ? "text-slate-400 hover:bg-white/[0.08] hover:text-white"
                    : "text-slate-500 hover:bg-slate-200 hover:text-[#22264b]"
                }
              `}
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
          )}
        </header>

        {!sidebarOpen && (
          <div className="flex shrink-0 justify-center py-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Expandir menú"
              aria-expanded={sidebarOpen}
              title="Expandir menú"
              className={`
                grid size-10 place-items-center rounded-xl
                transition focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#9dbf14]
                ${
                  dark
                    ? "text-slate-400 hover:bg-white/[0.08] hover:text-white"
                    : "text-slate-500 hover:bg-slate-200 hover:text-[#22264b]"
                }
              `}
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
          </div>
        )}

        <nav aria-label="Navegación" className={`min-h-0 flex-1 overflow-y-auto overscroll-contain py-6 ${sidebarOpen ? "px-3" : "px-2"}`}>
          {sidebarOpen && (
            <div className="mb-4 px-3">
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                Administración
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <SidebarAction
              icon={LayoutDashboard}
              label="Inicio"
              sidebarOpen={sidebarOpen}
              dark={dark}
              active={activeSection === "overview"}
              onClick={() => onOpenOverview?.()}
            />

            <SidebarAction
              icon={Users}
              label="Usuarios"
              sidebarOpen={sidebarOpen}
              dark={dark}
              active={activeSection === "users"}
              onClick={() => onOpenUsers?.()}
            />

            <SidebarAction
              icon={ShieldCheck}
              label="Roles & permisos"
              sidebarOpen={sidebarOpen}
              dark={dark}
              active={activeSection === "roles"}
              onClick={() => onOpenRoles?.()}
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

          <div className={`my-5 border-t ${dark ? "border-white/[0.07]" : "border-slate-200"}`} />

          <div className="flex flex-col gap-2">
            <SidebarAction
              icon={Home}
              label="Volver al inicio"
              sidebarOpen={sidebarOpen}
              dark={dark}
              onClick={onBackHome}
            />
          </div>
        </nav>

        <div className={`shrink-0 pb-3 ${sidebarOpen ? "px-3" : "px-2"}`}>
          {sidebarOpen ? (
            <div className={`mb-3 rounded-xl border p-3 ${dark ? "border-white/[0.07] bg-white/[0.035]" : "border-slate-200 bg-white"}`}>
              <div className="flex min-w-0 items-center gap-3">
                <div className={`grid size-10 shrink-0 place-items-center rounded-xl text-xs font-bold ring-1 ring-inset ${dark ? "bg-[#3163a2]/20 text-[#a9c9f5] ring-[#3163a2]/20" : "bg-[#edf5c5] text-[#22264b] ring-[#9dbf14]/30"}`}>
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-xs font-semibold ${dark ? "text-white" : "text-[#22264b]"}`}>
                    {user?.name || "Administrador"}
                  </p>

                  <p className={`mt-1 truncate text-[10px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {user?.email || "Cuenta administrativa"}
                  </p>
                </div>
              </div>

              <div className={`mt-3 flex items-center gap-2 border-t pt-3 ${dark ? "border-white/[0.07]" : "border-slate-200"}`}>
                <ShieldCheck size={14} className="shrink-0 text-[#b5d83d]" />

                <span className={`text-[10px] font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Cuenta activa
                </span>

                <span className="ml-auto size-1.5 rounded-full bg-[#9dbf14] shadow-[0_0_8px_#9dbf14]" />
              </div>
            </div>
          ) : (
            <div title={user?.name || "Administrador"} className="mb-3 flex justify-center">
              <div className={`grid size-10 place-items-center rounded-xl text-xs font-bold ${dark ? "border border-white/10 bg-[#3163a2]/20 text-[#a9c9f5]" : "border border-slate-200 bg-[#edf5c5] text-[#22264b]"}`}>
                {initials}
              </div>
            </div>
          )}

          <SidebarAction
            icon={LogOut}
            label="Cerrar sesión"
            sidebarOpen={sidebarOpen}
            dark={dark}
            danger
            onClick={() => {
              if (onConfirmLogout) {
                onConfirmLogout();
                return;
              }
              onLogout();
            }}
          />
        </div>

        {sidebarOpen && (
          <footer className={`shrink-0 border-t px-5 py-4 ${dark ? "border-white/[0.07]" : "border-slate-200"}`}>
            <p className={`whitespace-nowrap text-[9px] font-medium tracking-[0.12em] ${dark ? "text-slate-600" : "text-slate-500"}`}>
              ASERCO SMART FINANCE · 2026
            </p>
          </footer>
        )}
      </div>
    </aside>
  );
}

export function DashboardSidebarBadge() {
  return <ShieldCheck className="text-[#3163a2] dark:text-[#9dbf14]" size={18} />;
}

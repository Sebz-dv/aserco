import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserCircle,
  X,
} from "lucide-react";
import { Brand } from "../atoms/Brand";
import { Button } from "../atoms/Button";

import type { AuthUser } from "../../lib/api";

type Props = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  onToggleTheme: () => void;
  onConfirmLogout?: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: (path?: string) => void;
  onOpenKnowledge: () => void;
}>;

const links = [
  { label: "Servicios", href: "#servicios" },
  { label: "Línea empresarial", href: "#linea-empresarial" },
  { label: "Línea personas", href: "#linea-personas" },
  { label: "Cómo trabajamos", href: "#nosotros" },
];

export function Header({
  dark,
  user,
  onToggleTheme,
  onConfirmLogout,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
  onOpenKnowledge,
}: Props) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const dashboards = user?.dashboards ?? [];
  const canAccessDashboard = dashboards.length > 0;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(34,38,75,0.05)] dark:border-white/10 dark:bg-[#22264b]/85 dark:shadow-[0_12px_30px_rgba(2,6,23,0.28)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#3163a2] transition-colors duration-200 hover:text-[#9dbf14] dark:text-slate-300 dark:hover:text-[#9dbf14]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onOpenKnowledge}
            className="rounded-full border border-[#3163a2]/30 bg-white/80 px-4 py-2 text-sm font-semibold text-[#3163a2] transition hover:-translate-y-0.5 hover:border-[#9dbf14] hover:text-[#9dbf14] dark:border-white/20 dark:bg-white/5 dark:text-slate-200"
          >
            Conocimiento
          </button>

          <Button href="#contacto">Hablemos</Button>

          <button
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white/80 text-[#3163a2] shadow-sm transition hover:-translate-y-0.5 hover:text-[#9dbf14] dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-[#3163a2]/30 bg-[#edf5c5] px-3 py-2 text-sm font-semibold text-[#22264b] transition-all duration-200 hover:border-[#9dbf14] hover:text-[#9dbf14] dark:border-[#9dbf14]/30 dark:bg-[#9dbf14]/10 dark:text-[#dff090]"
              >
                <UserCircle size={18} />
                <span>{user.name}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(34,38,75,0.12)] transition-all duration-300 ease-out dark:border-white/10 dark:bg-[#111d35] ${
                  userMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">
                    Usuario
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#22264b] dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {user.email}
                  </p>
                </div>

                {canAccessDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenAdmin(dashboards[0]?.path ?? "/dashboard/admin");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#22264b] transition hover:bg-[#f5f7f2] dark:text-white dark:hover:bg-white/5"
                  >
                    <LayoutDashboard
                      size={16}
                      className="text-[#3163a2] dark:text-[#9dbf14]"
                    />
                    Ir al dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onConfirmLogout?.();
                  }}
                  className="flex w-full items-center gap-3 border-t border-slate-200 px-4 py-3 text-left text-sm font-medium text-[#22264b] transition hover:bg-[#f5f7f2] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  <LogOut
                    size={16}
                    className="text-[#3163a2] dark:text-[#9dbf14]"
                  />
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-full border border-[#3163a2]/30 bg-white/80 px-4 py-2 text-sm font-semibold text-[#3163a2] transition hover:-translate-y-0.5 hover:border-[#9dbf14] hover:text-[#9dbf14] dark:border-white/20 dark:bg-white/5 dark:text-slate-200"
            >
              Acceso usuarios
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-[#3163a2] dark:border-white/15"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-[#3163a2] dark:border-white/15"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 px-5 py-4 dark:border-white/10 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-[#22264b] dark:text-white"
            >
              {link.label}
            </a>
          ))}

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onOpenKnowledge()
            }}
            className="mt-3 block w-full rounded-full border border-[#3163a2]/30 px-5 py-3 text-center text-sm font-semibold text-[#3163a2] dark:text-slate-200"
          >
            Conocimiento
          </button>

          {user ? (
            <>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">
                  Sesión
                </p>
                <p className="mt-1 text-sm font-semibold text-[#22264b] dark:text-white">
                  {user.name}
                </p>
              </div>

              {canAccessDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenAdmin(dashboards[0]?.path ?? "/dashboard/admin");
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-[#3163a2]/30 bg-[#edf5c5] px-5 py-3 text-center text-sm font-semibold text-[#22264b] dark:border-[#9dbf14]/30 dark:bg-[#9dbf14]/10 dark:text-[#dff090]"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onConfirmLogout?.();
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-[#22264b] dark:border-white/10 dark:text-white"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenLogin();
                }}
                className="mt-2 block w-full rounded-full border border-[#3163a2]/30 px-5 py-3 text-center text-sm font-semibold text-[#3163a2] dark:text-slate-200"
              >
                Acceso usuarios
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenRegister();
                }}
                className="mt-2 block w-full rounded-full bg-[#9dbf14] px-5 py-3 text-center text-sm font-semibold text-[#22264b]"
              >
                Registrarse
              </button>
            </>
          )}

          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-[#9dbf14] px-5 py-3 text-center text-sm font-semibold text-[#22264b]"
          >
            Hablemos
          </a>
        </nav>
      )}
    </header>
  );
}

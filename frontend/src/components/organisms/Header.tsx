import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Brand } from "../atoms/Brand";
import { Button } from "../atoms/Button";

import type { AuthUser } from "../../lib/api";

type Props = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  onToggleTheme: () => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}>;

const links = [
  { label: "Servicios", href: "#servicios" },
  { label: "Línea empresarial", href: "#linea-empresarial" },
  { label: "Línea personas", href: "#linea-personas" },
  { label: "Cómo trabajamos", href: "#nosotros" },
];

export function Header({ dark, user, onToggleTheme, onLogout, onOpenLogin, onOpenRegister }: Props) {
  const [open, setOpen] = useState(false);

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
          {user ? (
            <>
              <span className="rounded-full bg-[#edf5c5] px-3 py-2 text-xs font-semibold text-[#22264b] shadow-sm dark:bg-[#9dbf14]/10 dark:text-[#dff090]">
                {user.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#22264b] transition hover:border-[#9dbf14] hover:text-[#9dbf14] dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <span></span>
            // <button
            //   type="button"
            //   onClick={onOpenLogin}
            //   className="rounded-full border border-[#3163a2]/30 bg-white/80 px-4 py-2 text-sm font-semibold text-[#3163a2] transition hover:-translate-y-0.5 hover:border-[#9dbf14] hover:text-[#9dbf14] dark:border-white/20 dark:bg-white/5 dark:text-slate-200"
            // >
            //   Acceso usuarios
            // </button>
          )}

          <button
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white/80 text-[#3163a2] shadow-sm transition hover:-translate-y-0.5 hover:text-[#9dbf14] dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Button href="#contacto">Hablemos</Button>
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

          {user ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
              className="mt-2 block w-full rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-[#22264b] dark:border-white/10 dark:text-white"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onOpenLogin()
                }}
                className="mt-2 block w-full rounded-full border border-[#3163a2]/30 px-5 py-3 text-center text-sm font-semibold text-[#3163a2] dark:text-slate-200"
              >
                Acceso usuarios
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onOpenRegister()
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

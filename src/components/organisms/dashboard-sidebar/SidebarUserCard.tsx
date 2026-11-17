import { ShieldCheck } from "lucide-react";
type SidebarUserCardProps = { dark: boolean; userName?: string | null; userEmail?: string | null };
export function SidebarUserCard({ dark, userName, userEmail }: SidebarUserCardProps) {
  const initials = userName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";
  return (
            <div
              className={`
                mb-3 rounded-2xl border p-3
                shadow-[0_12px_26px_rgba(15,23,42,0.08)]
                animate-in fade-in duration-200
                ${
                  dark
                    ? "border-white/7 bg-white/4"
                    : "border-slate-200 bg-white/90"
                }
              `}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`
                    grid size-10 shrink-0 place-items-center
                    rounded-xl text-xs font-bold ring-1 ring-inset
                    ${
                      dark
                        ? "bg-[#3163a2]/20 text-[#75a9e8] ring-[#3163a2]/20"
                        : "bg-[#edf5c5] text-[#22264b] ring-[#9dbf14]/30"
                    }
                  `}
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      truncate text-xs font-semibold
                      ${dark ? "text-white" : "text-[#22264b]"}
                    `}
                  >
                    {userName || "Administrador"}
                  </p>
                  <p
                    className={`
                      mt-1 truncate text-[10px]
                      ${dark ? "text-slate-400" : "text-slate-500"}
                    `}
                  >
                    {userEmail || "Cuenta administrativa"}
                  </p>
                </div>
              </div>
              <div
                className={`
                  mt-3 flex items-center gap-2 border-t pt-3
                  ${dark ? "border-white/7" : "border-slate-200"}
                `}
              >
                <ShieldCheck size={14} className="shrink-0 text-[#9dbf14]" />
                <span
                  className={`
                    text-[10px] font-medium
                    ${dark ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  Cuenta activa
                </span>
                <span className="ml-auto size-1.5 rounded-full bg-[#9dbf14]" />
              </div>
            </div>
  );
}

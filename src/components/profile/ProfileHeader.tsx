import { BriefcaseBusiness, Mail, ShieldCheck } from "lucide-react";
import type { UserProfile } from "../../lib/api";

type Props = Readonly<{
  profile: UserProfile;
}>;

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase() || "AS";

export function ProfileHeader({ profile }: Props) {
  const status = profile.accountStatus ?? (profile.isActive ? "Activa" : "Pendiente");

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {profile.avatarUrl || profile.defaultAvatarUrl ? (
            <img
              src={profile.avatarUrl ?? profile.defaultAvatarUrl ?? ""}
              alt={`Foto de ${profile.name}`}
              className="size-20 rounded-2xl border border-slate-200 object-cover dark:border-white/10"
            />
          ) : (
            <div className="grid size-20 place-items-center rounded-2xl bg-[#edf5c5] text-2xl font-bold text-[#22264b] dark:bg-[#9dbf14]/15 dark:text-[#dff090]">
              {getInitials(profile.name)}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">Mi perfil</p>
            <h1 className="mt-2 truncate text-2xl font-bold text-[#22264b] dark:text-white">{profile.name}</h1>
            <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Mail size={14} />
              <span className="truncate">{profile.email}</span>
            </p>
            {profile.roleTitle && (
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <BriefcaseBusiness size={14} />
                {profile.roleTitle}
              </p>
            )}
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <ShieldCheck size={14} />
          Cuenta {status}
        </div>
      </div>
    </section>
  );
}

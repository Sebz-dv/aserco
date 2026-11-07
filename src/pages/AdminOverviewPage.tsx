import { BarChart3, BriefcaseBusiness, Plus, ShieldCheck, Users } from 'lucide-react';

import type { AdminUser } from '../lib/api';

type AdminOverviewPageProps = Readonly<{
  users: AdminUser[];
  isSuperAdmin: boolean;
  onOpenUsers: () => void;
  userName: string;
}>;

export function AdminOverviewPage({ users, isSuperAdmin, onOpenUsers, userName }: AdminOverviewPageProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3163a2] dark:text-[#9dbf14]">Panel de administración</p>
            <h1 className="mt-2 text-3xl font-semibold">Bienvenido, {userName}</h1>
          </div>

          <button
            type="button"
            onClick={onOpenUsers}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3163a2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#254d83] dark:bg-[#9dbf14] dark:text-[#111827]"
          >
            <Users size={16} />
            Gestionar usuarios
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-300">Usuarios</p>
            <Users className="text-[#3163a2] dark:text-[#9dbf14]" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold">{users.length}</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-300">Activos</p>
            <ShieldCheck className="text-[#3163a2] dark:text-[#9dbf14]" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold">{users.filter((item) => item.isActive).length}</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-300">Roles</p>
            <BarChart3 className="text-[#3163a2] dark:text-[#9dbf14]" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold">{new Set(users.flatMap((item) => item.roles)).size}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#3163a2]/10 text-[#3163a2] dark:bg-[#9dbf14]/10 dark:text-[#9dbf14]">
              <BriefcaseBusiness size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Acción rápida</p>
              <h2 className="text-xl font-semibold">Gestionar accesos</h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
            Administra usuarios, activa o desactiva perfiles y asigna roles desde el panel de usuarios.
          </p>

          <button
            type="button"
            onClick={onOpenUsers}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-[#22264b] transition hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            <Plus size={16} />
            Ir a usuarios
          </button>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#9dbf14]/10 text-[#9dbf14]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Seguridad</p>
              <h2 className="text-xl font-semibold">Permisos activos</h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
            {isSuperAdmin
              ? 'Tienes permisos completos para gestionar usuarios y asignar roles de administración.'
              : 'Tienes permisos para visualizar administración y crear usuarios con rol de administrador.'}
          </p>
        </div>
      </div>
    </div>
  );
}

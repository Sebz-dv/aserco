import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';

import type { AdminUser } from '../lib/api';

type AdminUsersPageProps = Readonly<{
  users: AdminUser[];
  availableRoles: string[];
  isSuperAdmin: boolean;
  loading: boolean;
  error: string;
  saving: boolean;
  onToggleStatus: (user: AdminUser) => void;
  onRoleChange: (user: AdminUser, role: string, checked: boolean) => void;
  onCreateUser: (payload: { name: string; email: string; password: string; role: string }) => Promise<void> | void;
  onCreateRole: (roleName: string) => Promise<string | void> | string | void;
}>;

const passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const passwordPolicyHint = 'Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y un carácter especial.';

const validatePasswordStrength = (password: string) => {
  if (!passwordPolicyRegex.test(password)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.');
  }
};

const generateStrongPassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specials = '!@#$%^&*()-_=+[]{};:,.<>?/';
  const all = `${upper}${lower}${digits}${specials}`;

  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
  const password = [pick(upper), pick(lower), pick(digits), pick(specials)];

  while (password.length < 12) {
    password.push(pick(all));
  }

  return password
    .map((char) => char)
    .sort(() => Math.random() - 0.5)
    .join('');
};

export function AdminUsersPage({
  users,
  availableRoles,
  isSuperAdmin,
  loading,
  error,
  saving,
  onToggleStatus,
  onRoleChange,
  onCreateUser,
  onCreateRole,
}: AdminUsersPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [clientError, setClientError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: availableRoles.includes('admin') ? 'admin' : availableRoles[0] ?? 'admin',
  });
  const passwordIsValid = form.password.length >= 8 && passwordPolicyRegex.test(form.password);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError('');

    try {
      validatePasswordStrength(form.password);

      setCreating(true);

      await onCreateUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setForm({
        name: '',
        email: '',
        password: '',
        role: availableRoles.includes('admin') ? 'admin' : availableRoles[0] ?? 'admin',
      });
      setShowPassword(false);
      setShowCreateModal(false);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'No se pudo crear el usuario.';
      setClientError(message);
    } finally {
      setCreating(false);
    }
  };

  const rolesForDisplay = isSuperAdmin ? availableRoles : ['admin'];

  const handleCreateRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreatingRole(true);

    try {
      const createdRole = await onCreateRole(newRoleName);
      if (createdRole) {
        setForm((current) => ({
          ...current,
          role: createdRole,
        }));
      }
      setNewRoleName('');
      setShowRoleModal(false);
    } finally {
      setCreatingRole(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3163a2] dark:text-[#9dbf14]">Usuarios</p>
            <h2 className="mt-2 text-2xl font-semibold">Administración de accesos</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setShowRoleModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#3163a2]/20 bg-[#3163a2]/5 px-4 py-3 text-sm font-semibold text-[#1f3357] transition hover:bg-[#3163a2]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <Plus size={16} />
                Nuevo rol
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9dbf14] px-5 py-3 text-sm font-semibold text-[#1d2433] transition hover:bg-[#b9d531]"
            >
              <Plus size={16} />
              Nuevo usuario
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-white/10 dark:bg-[#111d35] dark:text-slate-300">
          Cargando usuarios...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(34,38,75,0.08)] dark:border-white/10 dark:bg-[#111d35]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-[#22264b] dark:bg-[#17213d] dark:text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Nombre</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Roles</th>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200 dark:border-white/10">
                    <td className="px-5 py-4 font-medium">{item.name}</td>
                    <td className="px-5 py-4">{item.email}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {rolesForDisplay.map((role) => {
                          const checked = item.roles.includes(role);

                          return (
                            <label key={role} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-2.5 py-1.5 text-xs dark:border-white/10">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(event) => onRoleChange(item, role, event.target.checked)}
                                className="h-3.5 w-3.5 accent-[#9dbf14]"
                                disabled={!isSuperAdmin && role === 'super_admin'}
                              />
                              {role}
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(item)}
                        disabled={saving}
                        className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                          item.isActive
                            ? 'bg-[#edf5c5] text-[#22264b] dark:bg-[#9dbf14]/20 dark:text-[#dff090]'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showRoleModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#101a2c]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3163a2] dark:text-[#9dbf14]">Crear rol</p>
                <h3 className="mt-2 text-2xl font-semibold">Nuevo acceso</h3>
              </div>

              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="rounded-full px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Nombre del rol</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(event) => setNewRoleName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#0e1729] dark:text-white dark:placeholder:text-slate-400"
                  placeholder="Ej. gestor, soporte"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={creatingRole}
                  className="rounded-full bg-[#3163a2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#254d83] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#9dbf14] dark:text-[#111827] dark:hover:bg-[#b9d531]"
                >
                  {creatingRole ? 'Creando...' : 'Guardar rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#101a2c]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3163a2] dark:text-[#9dbf14]">Crear usuario</p>
                <h3 className="mt-2 text-2xl font-semibold">Nuevo acceso</h3>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-full px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#0e1729] dark:text-white dark:placeholder:text-slate-400"
                  placeholder="Ej. Ana Gómez"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Correo electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#0e1729] dark:text-white dark:placeholder:text-slate-400"
                  placeholder="usuario@aserco.com.co"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#0e1729] dark:text-white dark:placeholder:text-slate-400"
                    placeholder="********"
                    required
                    minLength={8}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, password: generateStrongPassword() }))}
                      className="rounded-full border border-[#3163a2]/20 bg-[#3163a2]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1f3357] transition hover:bg-[#3163a2]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      Generar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="flex items-center text-slate-500 transition hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">{passwordPolicyHint}</span>
                  <span className={`rounded-full px-2 py-1 font-semibold ${passwordIsValid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'}`}>
                    {passwordIsValid ? 'Válida' : 'Revisa'}
                  </span>
                </div>
                {clientError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">{clientError}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Rol</label>
                <select
                  value={form.role}
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#0e1729] dark:text-white"
                >
                  {rolesForDisplay.map((role) => (
                    <option key={role} value={role} className="text-slate-900 dark:text-white">{role === 'super_admin' ? 'Super admin' : role === 'admin' ? 'Admin' : role}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-full bg-[#3163a2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#254d83] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#9dbf14] dark:text-[#111827] dark:hover:bg-[#b9d531]"
                >
                  {creating ? 'Creando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { Fragment, useState } from 'react';

type ModuleOption = {
  id: number;
  name: string;
  code: string;
  description?: string | null;
};

type PermissionOption = {
  id: number;
  name: string;
  description?: string | null;
  moduleId?: number | null;
  moduleName?: string | null;
  moduleCode?: string | null;
};

type Props = Readonly<{
  roles: string[];
  rolePermissions: Record<string, string[]>;
  availableModules: ModuleOption[];
  availablePermissions: PermissionOption[];
  onTogglePermission: (role: string, permission: string) => void;
  onCreateModule: (payload: { name: string; code: string; description?: string }) => Promise<unknown> | unknown;
  onCreatePermission: (payload: { moduleId: number | string; name: string; description?: string }) => Promise<unknown> | unknown;
}>;

export function AdminRolesPage({
  roles,
  rolePermissions,
  availableModules,
  availablePermissions,
  onTogglePermission,
  onCreateModule,
  onCreatePermission,
}: Props) {
  const [moduleForm, setModuleForm] = useState({ name: '', code: '', description: '' });
  const [permissionForm, setPermissionForm] = useState({ moduleId: '', name: '', description: '' });
  const [creating, setCreating] = useState(false);

  const groupedPermissions = availableModules.length
    ? availableModules.map((module) => ({
        title: module.name,
        permissions: availablePermissions
          .filter((permission) => permission.moduleId === module.id || permission.moduleName === module.name)
          .map((permission) => ({
            key: permission.name,
            label: permission.description || permission.name,
          })),
      }))
    : [
        {
          title: 'Sin módulo',
          permissions: availablePermissions
            .filter((permission) => !permission.moduleId && !permission.moduleName)
            .map((permission) => ({
              key: permission.name,
              label: permission.description || permission.name,
            })),
        },
      ];

  const hasGroupedPermissions = groupedPermissions.some((group) => group.permissions.length > 0);

  const handleCreateModuleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!moduleForm.name.trim() || !moduleForm.code.trim()) {
      return;
    }

    setCreating(true);
    try {
      await onCreateModule({
        name: moduleForm.name.trim(),
        code: moduleForm.code.trim(),
        description: moduleForm.description.trim(),
      });
      setModuleForm({ name: '', code: '', description: '' });
    } finally {
      setCreating(false);
    }
  };

  const handleCreatePermissionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!permissionForm.moduleId || !permissionForm.name.trim()) {
      return;
    }

    setCreating(true);
    try {
      await onCreatePermission({
        moduleId: Number(permissionForm.moduleId),
        name: permissionForm.name.trim(),
        description: permissionForm.description.trim(),
      });
      setPermissionForm({ moduleId: '', name: '', description: '' });
    } finally {
      setCreating(false);
    }
  };

  if (roles.length === 0) {
    return (
      <section className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-white/10 dark:bg-[#111d35] dark:text-slate-300">
        Aún no hay roles creados.
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3163a2] dark:text-[#9dbf14]">Roles y permisos</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#22264b] dark:text-white">Matriz de acceso</h2>
          </div>
          <div className="rounded-full border border-[#9dbf14]/30 bg-[#edf5c5] px-3 py-1.5 text-xs font-semibold text-[#22264b] dark:bg-[#9dbf14]/10 dark:text-[#dff090]">
            RBAC dinámico
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <form onSubmit={handleCreateModuleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
          <h3 className="text-lg font-semibold text-[#22264b] dark:text-white">Crear módulo</h3>
          <div className="mt-4 grid gap-3">
            <input
              value={moduleForm.name}
              onChange={(event) => setModuleForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Nombre del módulo"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3163a2] dark:border-white/10 dark:bg-[#0f1c32] dark:text-white"
            />
            <input
              value={moduleForm.code}
              onChange={(event) => setModuleForm((current) => ({ ...current, code: event.target.value }))}
              placeholder="Código (ej. proveedores)"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3163a2] dark:border-white/10 dark:bg-[#0f1c32] dark:text-white"
            />
            <textarea
              value={moduleForm.description}
              onChange={(event) => setModuleForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Descripción del módulo"
              className="min-h-[88px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3163a2] dark:border-white/10 dark:bg-[#0f1c32] dark:text-white"
            />
            <button type="submit" disabled={creating} className="rounded-xl bg-[#9dbf14] px-4 py-2.5 text-sm font-bold text-[#22264b] disabled:opacity-60">
              {creating ? 'Guardando...' : 'Crear módulo'}
            </button>
          </div>
        </form>

        <form onSubmit={handleCreatePermissionSubmit} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
          <h3 className="text-lg font-semibold text-[#22264b] dark:text-white">Crear permiso</h3>
          <div className="mt-4 grid gap-3">
            <select
              value={permissionForm.moduleId}
              onChange={(event) => setPermissionForm((current) => ({ ...current, moduleId: event.target.value }))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3163a2] dark:border-white/10 dark:bg-[#0f1c32] dark:text-white"
            >
              <option value="">Selecciona un módulo</option>
              {availableModules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
            <input
              value={permissionForm.name}
              onChange={(event) => setPermissionForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Código del permiso (ej. providers.view)"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3163a2] dark:border-white/10 dark:bg-[#0f1c32] dark:text-white"
            />
            <textarea
              value={permissionForm.description}
              onChange={(event) => setPermissionForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Descripción del permiso"
              className="min-h-[88px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3163a2] dark:border-white/10 dark:bg-[#0f1c32] dark:text-white"
            />
            <button type="submit" disabled={creating} className="rounded-xl bg-[#3163a2] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {creating ? 'Guardando...' : 'Crear permiso'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Permisos creados</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {availablePermissions.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {availablePermissions.map((permission) => (
            <span key={permission.id} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 dark:border-white/10 dark:bg-[#0f1c32] dark:text-slate-200">
              {permission.name}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-[#22264b] dark:border-white/10 dark:bg-[#17213b] dark:text-white">
                Permiso
              </th>
              {roles.map((role) => (
                <th
                  key={role}
                  className="border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold capitalize text-[#22264b] dark:border-white/10 dark:bg-[#17213b] dark:text-white"
                >
                  {role.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {hasGroupedPermissions ? (
              groupedPermissions.map((group) => (
                <Fragment key={group.title}>
                  <tr>
                    <td colSpan={roles.length + 1} className="border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-[#16233e] dark:text-slate-300">
                      {group.title}
                    </td>
                  </tr>
                  {group.permissions.length === 0 ? (
                    <tr>
                      <td colSpan={roles.length + 1} className="border-b border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-[#111d35] dark:text-slate-300">
                        No hay permisos asociados a este módulo.
                      </td>
                    </tr>
                  ) : (
                    group.permissions.map((permission) => (
                      <tr key={permission.key} className="group">
                        <td className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 py-3 text-sm text-[#22264b] dark:border-white/10 dark:bg-[#111d35] dark:text-slate-200">
                          {permission.label}
                        </td>
                        {roles.map((role) => {
                          const selected = (rolePermissions[role] ?? []).includes(permission.key);

                          return (
                            <td
                              key={`${role}-${permission.key}`}
                              className="border-b border-slate-200 px-4 py-3 text-center dark:border-white/10"
                            >
                              <button
                                type="button"
                                aria-label={`Toggle ${permission.label} para ${role}`}
                                onClick={() => onTogglePermission(role, permission.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  selected
                                    ? 'bg-[#9dbf14] shadow-[0_0_0_1px_rgba(157,191,20,0.18)]'
                                    : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    selected ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={roles.length + 1} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-300">
                  Aún no hay permisos creados para ningún módulo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

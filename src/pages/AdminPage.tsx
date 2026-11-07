import { useEffect, useState } from 'react';

import { DashboardNavbar } from '../components/organisms/DashboardNavbar';
import { DashboardSidebar, type DashboardSection } from '../components/organisms/DashboardSidebar';
import {
  createAdminModule,
  createAdminPermission,
  createAdminRole,
  createAdminUser,
  getAdminModules,
  getAdminPermissions,
  getAdminRoles,
  getAdminUsers,
  getRolePermissions,
  updateRolePermissions,
  updateUserRoles,
  updateUserStatus,
  type AdminModule,
  type AdminUser,
  type PermissionItem,
} from '../lib/api';
import type { AuthUser } from '../lib/api';
import { AdminOverviewPage } from './AdminOverviewPage';
import { AdminRolesPage } from './AdminRolesPage';
import { AdminUsersPage } from './AdminUsersPage';
import { KnowledgeAdminPage } from './KnowledgeAdminPage';

type Props = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  onBackHome: () => void;
  onLogout: () => void;
  onConfirmLogout?: () => void;
  onToggleTheme: () => void;
  onToast?: (message: string, kind?: 'success' | 'error' | 'info' | 'confirm', title?: string) => void;
}>;

export function AdminPage({ dark, user, onBackHome, onLogout, onConfirmLogout, onToggleTheme, onToast }: Props) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<string[]>(['admin', 'super_admin']);
  const [availableModules, setAvailableModules] = useState<AdminModule[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState<DashboardSection>('overview');
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    super_admin: [
      'dashboard.view',
      'dashboard.metrics',
      'users.read',
      'users.create',
      'users.edit',
      'users.delete',
      'roles.view',
      'roles.manage',
      'permissions.manage',
      'marketing.view',
      'marketing.create',
      'marketing.edit',
      'customers.view',
      'customers.create',
      'customers.edit',
      'finance.view',
      'finance.edit',
    ],
    admin: [
      'dashboard.view',
      'dashboard.metrics',
      'users.read',
      'users.create',
      'users.edit',
      'users.delete',
      'roles.view',
      'roles.manage',
      'permissions.manage',
      'marketing.view',
      'marketing.create',
      'marketing.edit',
      'customers.view',
      'customers.create',
      'customers.edit',
      'finance.view',
      'finance.edit',
    ],
    marketing: ['dashboard.view', 'dashboard.metrics', 'marketing.view', 'marketing.create', 'marketing.edit'],
    comercial: ['dashboard.view', 'customers.view', 'customers.create', 'customers.edit'],
    contabilidad: ['dashboard.view', 'finance.view', 'finance.edit'],
  });

  const isSuperAdmin = !!user && (user.roles?.includes('super_admin') || user.permissions?.includes('dashboard.view') || user.permissions?.includes('dashboard.metrics'));
  const canManageKnowledge = !!user && (user.roles?.includes('editor') || (user.permissions ?? []).some((permission) => permission.startsWith('knowledge.')));
  const hasPermission = (permission: string) =>
    !!user && ((user.permissions ?? []).includes(permission) || (user.roles ?? []).some((role) => (rolePermissions[role] ?? []).includes(permission)));
  const canAccessDashboard = hasPermission('dashboard.view') || hasPermission('dashboard.metrics') || isSuperAdmin;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#admin/conocimiento') {
      setSection('knowledge');
    }
  }, []);

  useEffect(() => {
    if (!canAccessDashboard) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, rolesResponse, modulesResponse, permissionsResponse] = await Promise.all([
          getAdminUsers(),
          getAdminRoles(),
          getAdminModules(),
          getAdminPermissions(),
        ]);

        setUsers(usersResponse.users);
        setAvailableModules(modulesResponse.modules);
        setAvailablePermissions(permissionsResponse.permissions);
        setRoles([
          ...new Set([
            'admin',
            'super_admin',
            ...rolesResponse.roles.map((role) => role.name),
          ]),
        ]);

        const resolvedRoles = [
          ...new Set([
            'admin',
            'super_admin',
            ...rolesResponse.roles.map((role) => role.name),
          ]),
        ];

        const rolePermissionResults = await Promise.all(
          resolvedRoles.map(async (roleName) => ({
            roleName,
            permissions: (await getRolePermissions(undefined, roleName)).permissions ?? [],
          })),
        );

        const nextPermissions: Record<string, string[]> = {};
        for (const { roleName, permissions } of rolePermissionResults) {
          nextPermissions[roleName] = permissions;
        }

        setRolePermissions(nextPermissions);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'No se pudieron cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canAccessDashboard]);

  const handleToggleStatus = async (targetUser: AdminUser) => {
    setSaving(true);
    try {
      await updateUserStatus(undefined, targetUser.id, !targetUser.isActive);
      setUsers((current) =>
        current.map((item) =>
          item.id === targetUser.id ? { ...item, isActive: !item.isActive } : item,
        ),
      );
      onToast?.(`Usuario ${targetUser.name} actualizado correctamente.`, 'success', 'Estado actualizado');
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'No se pudo cambiar el estado del usuario.';
      setError(message);
      onToast?.(message, 'error', 'Error al actualizar estado');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (targetUser: AdminUser, role: string, checked: boolean) => {
    const nextRoles = checked
      ? [...new Set([...targetUser.roles, role])]
      : targetUser.roles.filter((item) => item !== role);

    setSaving(true);
    try {
      await updateUserRoles(undefined, targetUser.id, nextRoles);
      setUsers((current) =>
        current.map((item) =>
          item.id === targetUser.id ? { ...item, roles: nextRoles } : item,
        ),
      );
      onToast?.(`Roles de ${targetUser.name} actualizados correctamente.`, 'success', 'Roles modificados');
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'No se pudo actualizar el rol del usuario.';
      setError(message);
      onToast?.(message, 'error', 'Error al actualizar roles');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (payload: { name: string; email: string; password: string; role: string }) => {
    setError('');

    try {
      const response = await createAdminUser(undefined, {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        roles: [payload.role],
      });

      setUsers((current) => [response.user, ...current]);
      onToast?.(`Usuario ${response.user.name} creado correctamente.`, 'success', 'Usuario registrado');
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'No se pudo crear el usuario.';
      setError(message);
      onToast?.(message, 'error', 'Error al crear usuario');
      throw createError;
    }
  };

  const handleCreateRole = async (roleName: string) => {
    const normalizedName = roleName.trim().toLowerCase();
    if (!normalizedName) {
      throw new Error('El nombre del rol es obligatorio.');
    }

    try {
      const response = await createAdminRole(undefined, normalizedName);
      setRoles((current) => [...new Set([...current, response.role.name])]);
      setRolePermissions((current) => ({
        ...current,
        [response.role.name]: [],
      }));
      onToast?.(`Rol ${response.role.name} creado correctamente.`, 'success', 'Rol registrado');
      return response.role.name;
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'No se pudo crear el rol.';
      setError(message);
      onToast?.(message, 'error', 'Error al crear rol');
      throw createError;
    }
  };

  const handleCreateModule = async (payload: { name: string; code: string; description?: string }) => {
    try {
      const response = await createAdminModule(undefined, payload);
      setAvailableModules((current) => [response.module, ...current.filter((module) => module.id !== response.module.id)]);
      onToast?.(`Módulo ${response.module.name} creado correctamente.`, 'success', 'Módulo registrado');
      return response.module;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el módulo.';
      setError(message);
      onToast?.(message, 'error', 'Error al crear módulo');
      throw error;
    }
  };

  const handleCreatePermission = async (payload: { moduleId: number | string; name: string; description?: string }) => {
    try {
      const response = await createAdminPermission(undefined, payload);
      setAvailablePermissions((current) => [response.permission, ...current.filter((item) => item.id !== response.permission.id)]);
      onToast?.(`Permiso ${response.permission.name} creado correctamente.`, 'success', 'Permiso registrado');
      return response.permission;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el permiso.';
      setError(message);
      onToast?.(message, 'error', 'Error al crear permiso');
      throw error;
    }
  };

  const handleToggleRolePermission = async (role: string, permission: string) => {
    setSaving(true);
    try {
      const currentPermissions = rolePermissions[role] ?? [];
      const nextPermissions = currentPermissions.includes(permission)
        ? currentPermissions.filter((item) => item !== permission)
        : [...currentPermissions, permission];

      await updateRolePermissions(undefined, role, nextPermissions);

      setRolePermissions((current) => ({
        ...current,
        [role]: nextPermissions,
      }));

      onToast?.(`Permisos del rol ${role} actualizados.`, 'success', 'Permisos actualizados');
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'No se pudieron actualizar los permisos del rol.';
      setError(message);
      onToast?.(message, 'error', 'Error al actualizar permisos');
    } finally {
      setSaving(false);
    }
  };

  if (!canAccessDashboard) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6 py-10 text-[#22264b] dark:bg-[#0b1225] dark:text-white">
        <div className="max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-[#111d35]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3163a2] dark:text-[#9dbf14]">Acceso restringido</p>
          <h1 className="mt-4 text-3xl font-semibold">No tienes permisos de administrador</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-300">Solo los usuarios con rol de administrador pueden acceder a esta sección.</p>
          <button
            type="button"
            onClick={onBackHome}
            className="mt-6 rounded-full bg-[#9dbf14] px-5 py-3 text-sm font-bold text-[#22264b]"
          >
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f4f7fb] text-[#22264b] dark:bg-[#0b1225] dark:text-white">
      <div className="flex h-full w-full min-w-0 overflow-hidden">
        <DashboardSidebar
          dark={dark}
          user={user}
          sidebarOpen={sidebarOpen}
          activeSection={section}
          showKnowledge={canManageKnowledge}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          onBackHome={onBackHome}
          onLogout={onLogout}
          onConfirmLogout={onConfirmLogout}
          onOpenOverview={() => setSection('overview')}
          onOpenUsers={() => setSection('users')}
          onOpenRoles={() => setSection('roles')}
          onOpenKnowledge={() => setSection('knowledge')}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DashboardNavbar dark={dark} onBackHome={onBackHome} onToggleTheme={onToggleTheme} />

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-6">
            {section === 'overview' ? (
              <AdminOverviewPage
                users={users}
                isSuperAdmin={Boolean(isSuperAdmin)}
                userName={user?.name || 'Administrador'}
                onOpenUsers={() => setSection('users')}
              />
            ) : section === 'roles' ? (
              <AdminRolesPage
                roles={roles}
                rolePermissions={rolePermissions}
                availableModules={availableModules}
                availablePermissions={availablePermissions}
                onTogglePermission={handleToggleRolePermission}
                onCreateModule={handleCreateModule}
                onCreatePermission={handleCreatePermission}
              />
            ) : section === 'knowledge' ? (
              canManageKnowledge ? (
                <KnowledgeAdminPage
                  onBackHome={onBackHome}
                  onBackKnowledge={() => setSection('overview')}
                />
              ) : (
                <section className="flex min-h-[400px] items-center justify-center rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#111d35]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">Acceso restringido</p>
                    <h2 className="mt-3 text-2xl font-semibold">Solo el rol editor puede gestionar contenido editorial</h2>
                  </div>
                </section>
              )
            ) : (
              <AdminUsersPage
                users={users}
                availableRoles={roles}
                isSuperAdmin={Boolean(isSuperAdmin)}
                loading={loading}
                error={error}
                saving={saving}
                onToggleStatus={handleToggleStatus}
                onRoleChange={handleRoleChange}
                onCreateUser={handleCreateUser}
                onCreateRole={handleCreateRole}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

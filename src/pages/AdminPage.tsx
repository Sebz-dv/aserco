import { useEffect, useMemo, useState } from 'react';

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
import { ProfileModuleRouter } from './profile/ProfileModuleRouter';

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
  const [roles, setRoles] = useState<string[]>([]);
  const [availableModules, setAvailableModules] = useState<AdminModule[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState<DashboardSection>('overview');
  const [selectedProfileUser, setSelectedProfileUser] = useState<AdminUser | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});

  const isSuperAdmin = Boolean(user?.roles?.includes('super_admin'));
  const isSuperAdminAccount = (account: AdminUser) =>
    (account.roles ?? []).some((role) => role.trim().toLowerCase() === 'super_admin');
  const accessManagedUsers = users.filter((account) => !isSuperAdminAccount(account));

  const effectivePermissions = useMemo(() => {
    const permissions = new Set<string>();

    for (const permission of user?.permissions ?? []) {
      permissions.add(permission);
    }

    for (const role of user?.roles ?? []) {
      for (const permission of rolePermissions[role] ?? []) {
        permissions.add(permission);
      }
    }

    return permissions;
  }, [user?.permissions, user?.roles, rolePermissions]);

  const hasPermissionPrefix = (prefixes: string[]) => {
    for (const permission of effectivePermissions) {
      const normalizedPermission = permission.toLowerCase();
      if (
        prefixes.some(
          (prefix) =>
            normalizedPermission === prefix
            || normalizedPermission.startsWith(`${prefix}.`),
        )
      ) {
        return true;
      }
    }

    return false;
  };

  const canManageUsers = hasPermissionPrefix(['users', 'admin.users']);
  const canManageRoles = hasPermissionPrefix([
    'roles',
    'admin.roles',
    'permissions',
    'admin.permissions',
    'modules',
    'admin.modules',
  ]);
  const canManageKnowledge = hasPermissionPrefix([
    'knowledge',
    'admin.knowledge',
    'editorial',
  ]);

  const canAccessDashboard =
    hasPermissionPrefix(['dashboard'])
    || canManageKnowledge
    || canManageUsers
    || canManageRoles
    || isSuperAdmin;

  const getProfileUserIdFromHash = (hash: string) => {
    const [path, query] = hash.split('?');
    if (!path.toLowerCase().startsWith('#admin/perfil')) {
      return null;
    }

    const params = new URLSearchParams(query ?? '');
    const rawValue = params.get('userId');
    if (!rawValue) {
      return null;
    }

    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const withProfileUserId = (baseHash: string, profileUserId: number | null) => {
    const [path] = baseHash.split('?');

    if (!profileUserId) {
      return path;
    }

    return `${path}?userId=${profileUserId}`;
  };

  const getSectionFromHash = (hash: string): DashboardSection => {
    const normalizedHash = hash.toLowerCase();

    if (normalizedHash.startsWith('#admin/usuarios')) {
      return 'users';
    }

    if (normalizedHash.startsWith('#admin/roles')) {
      return 'roles';
    }

    if (normalizedHash.startsWith('#admin/conocimiento')) {
      return 'knowledge';
    }

    if (normalizedHash === '#admin/perfil' || normalizedHash.startsWith('#admin/perfil/') || normalizedHash.startsWith('#perfil')) {
      return 'profile';
    }

    return 'overview';
  };

  const setHashIfNeeded = (nextHash: string) => {
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  };

  const navigateToSection = (
    nextSection: DashboardSection,
    options?: { preserveSelectedProfileUser?: boolean; profileHash?: string },
  ) => {
    if (nextSection !== 'profile' && selectedProfileUser) {
      setSelectedProfileUser(null);
    }

    if (nextSection === 'profile') {
      if (!options?.preserveSelectedProfileUser) {
        setSelectedProfileUser(null);
      }

      setSection('profile');

      const baseProfileHash = options?.profileHash
        ?? (window.location.hash.startsWith('#admin/perfil') ? window.location.hash : '#admin/perfil');

      const targetProfileUserId = options?.preserveSelectedProfileUser
        ? selectedProfileUser?.id ?? getProfileUserIdFromHash(window.location.hash)
        : null;

      const nextHash = withProfileUserId(baseProfileHash, targetProfileUserId ?? null);

      setHashIfNeeded(nextHash);
      return;
    }

    setSection(nextSection);

    if (nextSection === 'users') {
      setHashIfNeeded('#admin/usuarios');
      return;
    }

    if (nextSection === 'roles') {
      setHashIfNeeded('#admin/roles');
      return;
    }

    if (nextSection === 'knowledge') {
      setHashIfNeeded('#admin/conocimiento');
      return;
    }

    setHashIfNeeded('#admin');
  };

  useEffect(() => {
    const syncSectionWithHash = () => {
      setSection(getSectionFromHash(window.location.hash));
    };

    syncSectionWithHash();

    window.addEventListener('hashchange', syncSectionWithHash);
    return () => window.removeEventListener('hashchange', syncSectionWithHash);
  }, []);

  useEffect(() => {
    if (section !== 'profile') {
      return;
    }

    const profileUserId = getProfileUserIdFromHash(window.location.hash);

    if (!profileUserId) {
      return;
    }

    const resolvedUser = accessManagedUsers.find((item) => item.id === profileUserId) ?? null;

    if (!resolvedUser) {
      return;
    }

    setSelectedProfileUser((current) => {
      if (current?.id === resolvedUser.id) {
        return current;
      }
      return resolvedUser;
    });
  }, [section, accessManagedUsers]);

  useEffect(() => {
    if (!canAccessDashboard) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        if (canManageUsers) {
          const usersResponse = await getAdminUsers();
          setUsers(usersResponse.users);
        } else {
          setUsers([]);
        }

        if (canManageRoles) {
          const [rolesResponse, modulesResponse, permissionsResponse] = await Promise.all([
            getAdminRoles(),
            getAdminModules(),
            getAdminPermissions(),
          ]);

          setAvailableModules(modulesResponse.modules);
          setAvailablePermissions(permissionsResponse.permissions);

          const resolvedRoles = [
            ...new Set([
              'admin',
              'super_admin',
              ...rolesResponse.roles.map((role) => role.name),
            ]),
          ];

          setRoles(resolvedRoles);

          const rolePermissionResults = await Promise.all(
            resolvedRoles.map(async (roleName) => {
              try {
                const response = await getRolePermissions(undefined, roleName);
                return {
                  roleName,
                  permissions: response.permissions ?? [],
                };
              } catch {
                return {
                  roleName,
                  permissions: [],
                };
              }
            }),
          );

          const nextPermissions: Record<string, string[]> = {};
          for (const { roleName, permissions } of rolePermissionResults) {
            nextPermissions[roleName] = permissions;
          }

          setRolePermissions(nextPermissions);
        } else {
          setRoles([]);
          setAvailableModules([]);
          setAvailablePermissions([]);
          setRolePermissions({});
        }
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'No se pudieron cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canAccessDashboard, canManageUsers, canManageRoles]);

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
          showUsersOption={canManageUsers}
          showRolesOption={canManageRoles}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          onBackHome={onBackHome}
          onLogout={onLogout}
          onConfirmLogout={onConfirmLogout}
          onOpenOverview={() => navigateToSection('overview')}
          onOpenUsers={() => navigateToSection('users')}
          onOpenRoles={() => navigateToSection('roles')}
          onOpenKnowledge={() => navigateToSection('knowledge')}
          onOpenProfile={() => {
            navigateToSection('profile', {
              preserveSelectedProfileUser: false,
              profileHash: '#admin/perfil',
            });
          }}
          onOpenProfileSection={() => {
            navigateToSection('profile', { preserveSelectedProfileUser: false });
          }}
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DashboardNavbar dark={dark} onBackHome={onBackHome} onToggleTheme={onToggleTheme} />

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-6">
            {section === 'overview' ? (
              <AdminOverviewPage
                users={accessManagedUsers}
                isSuperAdmin={Boolean(isSuperAdmin)}
                userName={user?.name || 'Administrador'}
                canManageUsers={canManageUsers}
                canManageRoles={canManageRoles}
                canManageKnowledge={canManageKnowledge}
                onOpenUsers={() => {
                  if (canManageUsers) {
                    navigateToSection('users');
                  }
                }}
              />
            ) : section === 'roles' ? (
              canManageRoles ? (
                <AdminRolesPage
                  roles={roles}
                  rolePermissions={rolePermissions}
                  availableModules={availableModules}
                  availablePermissions={availablePermissions}
                  onTogglePermission={handleToggleRolePermission}
                  onCreateModule={handleCreateModule}
                  onCreatePermission={handleCreatePermission}
                />
              ) : (
                <section className="flex min-h-[400px] items-center justify-center rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#111d35]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">Acceso restringido</p>
                    <h2 className="mt-3 text-2xl font-semibold">No tienes permisos para Roles y permisos</h2>
                  </div>
                </section>
              )
            ) : section === 'knowledge' ? (
              canManageKnowledge ? (
                <KnowledgeAdminPage
                  onBackHome={onBackHome}
                  onBackKnowledge={() => navigateToSection('overview')}
                />
              ) : (
                <section className="flex min-h-[400px] items-center justify-center rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#111d35]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">Acceso restringido</p>
                    <h2 className="mt-3 text-2xl font-semibold">Solo el rol editor puede gestionar contenido editorial</h2>
                  </div>
                </section>
              )
            ) : section === 'profile' ? (
              <ProfileModuleRouter
                mode={selectedProfileUser ? 'admin' : 'self'}
                userId={selectedProfileUser?.id}
                onToast={onToast}
              />
            ) : (
              canManageUsers ? (
                <AdminUsersPage
                  users={accessManagedUsers}
                  availableRoles={roles}
                  isSuperAdmin={Boolean(isSuperAdmin)}
                  loading={loading}
                  error={error}
                  saving={saving}
                  onToggleStatus={handleToggleStatus}
                  onRoleChange={handleRoleChange}
                  onEditProfile={(targetUser) => {
                    setSelectedProfileUser(targetUser);
                    navigateToSection('profile', {
                      preserveSelectedProfileUser: true,
                      profileHash: withProfileUserId('#admin/perfil/personal', targetUser.id),
                    });
                  }}
                  onCreateUser={handleCreateUser}
                  onCreateRole={handleCreateRole}
                />
              ) : (
                <section className="flex min-h-[400px] items-center justify-center rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#111d35]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">Acceso restringido</p>
                    <h2 className="mt-3 text-2xl font-semibold">No tienes permisos para Usuarios</h2>
                  </div>
                </section>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

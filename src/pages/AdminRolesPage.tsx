import { Fragment, useEffect, useMemo, useState, type FormEvent } from "react";

import {
  Layers3,
  ShieldCheck,
  ShieldPlus,
  Users,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  LockKeyhole,
  Search,
  Settings2,
  Info,
  X,
} from "lucide-react";

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
  onCreateModule: (payload: {
    name: string;
    code: string;
    description?: string;
  }) => Promise<unknown> | unknown;
  onCreatePermission: (payload: {
    moduleId: number | string;
    name: string;
    description?: string;
  }) => Promise<unknown> | unknown;
}>;

type PermissionGroup = {
  title: string;
  permissions: {
    key: string;
    label: string;
    description?: string | null;
  }[];
};

type ModalType = "module" | "permission" | null;

const INITIAL_MODULE_FORM = {
  name: "",
  code: "",
  description: "",
};

const INITIAL_PERMISSION_FORM = {
  moduleId: "",
  name: "",
  description: "",
};

export function AdminRolesPage({
  roles,
  rolePermissions,
  availableModules,
  availablePermissions,
  onTogglePermission,
  onCreateModule,
  onCreatePermission,
}: Props) {
  // FORMS
  const [moduleForm, setModuleForm] = useState(INITIAL_MODULE_FORM);
  const [permissionForm, setPermissionForm] = useState(INITIAL_PERMISSION_FORM);

  // MODALS
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // LOADING
  const [creatingModule, setCreatingModule] = useState(false);
  const [creatingPermission, setCreatingPermission] = useState(false);

  // ERRORS
  const [moduleError, setModuleError] = useState("");
  const [permissionError, setPermissionError] = useState("");

  // SEARCH
  const [search, setSearch] = useState("");

  const isCreating = creatingModule || creatingPermission;
  const visibleRoles = roles.filter((role) => role !== "super_admin");

  // =========================================================
  // MODAL MANAGEMENT
  // =========================================================

  const openModal = (modal: Exclude<ModalType, null>) => {
    setModuleError("");
    setPermissionError("");

    if (modal === "module") {
      setModuleForm(INITIAL_MODULE_FORM);
    }

    if (modal === "permission") {
      setPermissionForm(INITIAL_PERMISSION_FORM);
    }

    setActiveModal(modal);
  };

  const closeModal = () => {
    if (isCreating) return;

    setActiveModal(null);
    setModuleError("");
    setPermissionError("");
  };

  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isCreating) {
        setActiveModal(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal, isCreating]);

  // =========================================================
  // GROUP PERMISSIONS
  // =========================================================

  const groupedPermissions = useMemo<PermissionGroup[]>(() => {
    const assignedIds = new Set<number>();

    const groups: PermissionGroup[] = availableModules.map((module) => {
      const permissions = availablePermissions
        .filter((permission) => {
          const matches =
            permission.moduleId === module.id ||
            (!permission.moduleId && permission.moduleName === module.name);

          if (matches) {
            assignedIds.add(permission.id);
          }

          return matches;
        })
        .map((permission) => ({
          key: permission.name,
          label: permission.name,
          description: permission.description,
        }));

      return {
        title: module.name,
        permissions,
      };
    });

    const unassigned = availablePermissions.filter(
      (permission) => !assignedIds.has(permission.id),
    );

    const unknownGroups = new Map<string, PermissionGroup["permissions"]>();

    unassigned.forEach((permission) => {
      const title = permission.moduleName || "Sin módulo";
      const current = unknownGroups.get(title) ?? [];

      current.push({
        key: permission.name,
        label: permission.name,
        description: permission.description,
      });

      unknownGroups.set(title, current);
    });

    unknownGroups.forEach((permissions, title) => {
      groups.push({ title, permissions });
    });

    return groups;
  }, [availableModules, availablePermissions]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groupedPermissions;

    const query = search.toLowerCase();

    return groupedPermissions
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(
          (permission) =>
            permission.label.toLowerCase().includes(query) ||
            permission.description?.toLowerCase().includes(query) ||
            group.title.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [groupedPermissions, search]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const assignedPermissions = useMemo(
    () =>
      visibleRoles.reduce(
        (total, role) => total + (rolePermissions[role] ?? []).length,
        0,
      ),
    [visibleRoles, rolePermissions],
  );

  // =========================================================
  // CREATE MODULE
  // =========================================================

  const handleCreateModuleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!moduleForm.name.trim() || !moduleForm.code.trim()) return;

    setCreatingModule(true);
    setModuleError("");

    try {
      await onCreateModule({
        name: moduleForm.name.trim(),
        code: moduleForm.code.trim(),
        description: moduleForm.description.trim(),
      });

      setModuleForm(INITIAL_MODULE_FORM);
      setActiveModal(null);
    } catch (error) {
      setModuleError(
        error instanceof Error
          ? error.message
          : "No fue posible crear el módulo.",
      );
    } finally {
      setCreatingModule(false);
    }
  };

  // =========================================================
  // CREATE PERMISSION
  // =========================================================

  const handleCreatePermissionSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!permissionForm.moduleId || !permissionForm.name.trim()) return;

    setCreatingPermission(true);
    setPermissionError("");

    try {
      await onCreatePermission({
        moduleId: Number(permissionForm.moduleId),
        name: permissionForm.name.trim(),
        description: permissionForm.description.trim(),
      });

      setPermissionForm(INITIAL_PERMISSION_FORM);
      setActiveModal(null);
    } catch (error) {
      setPermissionError(
        error instanceof Error
          ? error.message
          : "No fue posible crear el permiso.",
      );
    } finally {
      setCreatingPermission(false);
    }
  };

  // =========================================================
  // STYLES
  // =========================================================

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-[#22264b] placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-[#3163a2] focus:bg-white focus:ring-4 focus:ring-[#3163a2]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0c172b] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-[#9dbf14] dark:focus:bg-[#101e35] dark:focus:ring-[#9dbf14]/10";

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-5 py-3 text-sm font-bold text-[#22264b] shadow-sm transition-all duration-200 hover:bg-[#aecf25] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9dbf14]/25 disabled:cursor-not-allowed disabled:opacity-50";

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5";

  const errorClass =
    "flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="space-y-6">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <header className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#9dbf14]/10 blur-3xl" />

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-7 rounded-full bg-[#9dbf14]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3163a2] dark:text-[#b5d44a]">
                  Administración del sistema
                </p>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#22264b] dark:text-white sm:text-3xl">
                Roles y permisos
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Administra los niveles de acceso y controla las funcionalidades
                disponibles para cada perfil.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-[#9dbf14]/30 bg-[#9dbf14]/10 px-4 py-2">
              <ShieldCheck size={16} className="text-[#789510]" />

              <span className="text-xs font-bold text-[#526d0b] dark:text-[#d5ec83]">
                RBAC dinámico activo
              </span>
            </div>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: "Roles registrados",
                value: visibleRoles.length,
                icon: Users,
                color: "text-[#3163a2]",
                bg: "bg-[#3163a2]/10",
              },
              {
                label: "Módulos disponibles",
                value: availableModules.length,
                icon: Layers3,
                color: "text-[#9dbf14]",
                bg: "bg-[#9dbf14]/15",
              },
              {
                label: "Permisos registrados",
                value: availablePermissions.length,
                icon: ShieldCheck,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-[#0d192e]"
              >
                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <stat.icon size={21} className={stat.color} />
                </div>

                <div>
                  <p className="text-2xl font-bold tabular-nums text-[#22264b] dark:text-white">
                    {stat.value}
                  </p>

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ===================================================== */}
      {/* QUICK ACTIONS */}
      {/* ===================================================== */}

      <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="text-sm font-bold text-[#22264b] dark:text-white">
            Configuración de accesos
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Administra los módulos y permisos del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openModal("module")}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#22264b] shadow-sm transition hover:border-[#3163a2] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3163a2]/15 dark:border-white/10 dark:bg-[#0c172b] dark:text-white dark:hover:bg-white/5"
          >
            <Layers3 size={17} className="text-[#3163a2] dark:text-blue-300" />
            Crear módulo
          </button>

          <button
            type="button"
            onClick={() => openModal("permission")}
            disabled={availableModules.length === 0}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 text-sm font-bold text-[#22264b] shadow-sm transition hover:bg-[#aecf25] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9dbf14]/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShieldPlus size={17} />
            Crear permiso
          </button>
        </div>
      </div>

      {/* ===================================================== */}
      {/* PERMISSION CATALOG */}
      {/* ===================================================== */}

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111d35] sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5 text-[#3163a2] dark:bg-white/5 dark:text-blue-300">
              <LockKeyhole size={19} />
            </div>

            <div>
              <h3 className="font-bold text-[#22264b] dark:text-white">
                Catálogo de permisos
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Permisos disponibles en el sistema
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#3163a2]/10 px-3 py-1.5 text-xs font-bold text-[#3163a2] dark:text-blue-300">
            {availablePermissions.length} registrados
          </span>
        </div>

        {availablePermissions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
            <ShieldPlus size={25} className="mx-auto mb-2 text-slate-400" />

            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No hay permisos registrados.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Crea un permiso para comenzar.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groupedPermissions.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/5 dark:bg-[#0c172b]"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[#22264b] dark:text-white">
                    {group.title}
                  </p>

                  <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-300">
                    {group.permissions.length}
                  </span>
                </div>

                {group.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {group.permissions.map((permission) => (
                      <span
                        key={permission.key}
                        title={permission.description || permission.key}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-mono text-[10px] text-slate-600 dark:border-white/10 dark:bg-[#111d35] dark:text-slate-300"
                      >
                        {permission.key}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Sin permisos asociados.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* RBAC MATRIX */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        {/* MATRIX HEADER */}

        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#9dbf14]/15 p-2.5 text-[#819d10] dark:text-[#c0df54]">
              <Settings2 size={20} />
            </div>

            <div>
              <h3 className="font-bold text-[#22264b] dark:text-white">
                Matriz de acceso
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Configura los permisos de cada rol.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9dbf14]" />
              Activo
              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              Inactivo
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
              {assignedPermissions} asignaciones
            </span>
          </div>
        </div>

        {/* SEARCH */}

        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar permisos o módulos..."
              aria-label="Buscar permisos o módulos"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-[#22264b] outline-none transition-all placeholder:text-slate-400 focus:border-[#3163a2] focus:ring-4 focus:ring-[#3163a2]/10 dark:border-white/10 dark:bg-[#0c172b] dark:text-white dark:focus:border-[#9dbf14]"
            />
          </div>

          <p className="text-xs text-slate-400">
            {filteredGroups.reduce(
              (total, group) => total + group.permissions.length,
              0,
            )}{" "}
            permisos encontrados
          </p>
        </div>

        {/* EMPTY STATES */}

        {visibleRoles.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Users
              size={35}
              className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
            />

            <h4 className="font-semibold text-[#22264b] dark:text-white">
              No hay roles registrados
            </h4>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Crea roles para comenzar a configurar los accesos.
            </p>
          </div>
        ) : availablePermissions.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <ShieldCheck
              size={35}
              className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
            />

            <h4 className="font-semibold text-[#22264b] dark:text-white">
              No hay permisos disponibles
            </h4>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Crea permisos y asígnalos a los diferentes roles.
            </p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Search
              size={30}
              className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
            />

            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No se encontraron resultados.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-2 text-xs font-semibold text-[#3163a2] hover:underline dark:text-[#b5d44a]"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          /* TABLE */

          <div className="max-h-[680px] overflow-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="sticky top-0 z-30">
                <tr>
                  <th className="sticky left-0 z-40 min-w-[260px] border-b border-r border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-[#17213b] dark:text-slate-300">
                    Permiso / Funcionalidad
                  </th>

                  {visibleRoles.map((role) => (
                    <th
                      key={role}
                      className="min-w-[125px] border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#22264b] dark:border-white/10 dark:bg-[#17213b] dark:text-white"
                    >
                      {role.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredGroups.map((group) => (
                  <Fragment key={group.title}>
                    {/* MODULE GROUP */}

                    <tr>
                      <td
                        colSpan={visibleRoles.length + 1}
                        className="border-b border-slate-200 bg-slate-100/80 px-5 py-3 dark:border-white/10 dark:bg-[#16233e]"
                      >
                        <div className="flex items-center gap-2">
                          <Layers3
                            size={14}
                            className="text-[#3163a2] dark:text-[#b5d44a]"
                          />

                          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
                            {group.title}
                          </span>

                          <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                            {group.permissions.length}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* PERMISSIONS */}

                    {group.permissions.map((permission) => (
                      <tr
                        key={permission.key}
                        className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.025]"
                      >
                        <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-5 py-3.5 transition-colors group-hover:bg-slate-50 dark:border-white/5 dark:bg-[#111d35] dark:group-hover:bg-[#15233c]">
                          <div className="flex items-center gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#22264b] dark:text-slate-200">
                                {permission.label}
                              </p>

                              {permission.description && (
                                <p className="mt-0.5 max-w-[230px] truncate text-[11px] text-slate-400">
                                  {permission.description}
                                </p>
                              )}
                            </div>

                            {permission.description && (
                              <span title={permission.description}>
                                <Info
                                  size={13}
                                  className="shrink-0 text-slate-300 dark:text-slate-600"
                                />
                              </span>
                            )}
                          </div>
                        </td>

                        {visibleRoles.map((role) => {
                          const selected = (
                            rolePermissions[role] ?? []
                          ).includes(permission.key);

                          return (
                            <td
                              key={`${role}-${permission.key}`}
                              className="border-b border-slate-100 px-4 py-3.5 text-center dark:border-white/5"
                            >
                              <button
                                type="button"
                                role="switch"
                                aria-checked={selected}
                                aria-label={`${selected ? "Desactivar" : "Activar"} ${permission.label} para ${role}`}
                                title={`${selected ? "Desactivar" : "Activar"} permiso`}
                                onClick={() =>
                                  onTogglePermission(role, permission.key)
                                }
                                className={`relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9dbf14]/25 ${
                                  selected
                                    ? "bg-[#9dbf14] shadow-[0_2px_6px_rgba(157,191,20,0.25)]"
                                    : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                                }`}
                              >
                                <span
                                  className={`flex h-[16px] w-[16px] items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                    selected
                                      ? "translate-x-[21px]"
                                      : "translate-x-[3px]"
                                  }`}
                                >
                                  {selected && (
                                    <Check
                                      size={10}
                                      className="text-[#718d0d]"
                                      strokeWidth={3}
                                    />
                                  )}
                                </span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER */}

        {visibleRoles.length > 0 && availablePermissions.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3 dark:border-white/10 dark:bg-[#0d192e] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck size={14} className="text-[#9dbf14]" />
              Los cambios se gestionan mediante el sistema RBAC.
            </div>

            <span className="text-[11px] font-medium text-slate-400">
              {visibleRoles.length} roles · {availablePermissions.length} permisos
            </span>
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* MODAL: CREATE MODULE */}
      {/* ===================================================== */}

      {activeModal === "module" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#050b17]/65 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="module-modal-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 dark:border-white/10 dark:bg-[#111d35]"
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-100 p-6 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#3163a2]/10 p-3 text-[#3163a2] dark:bg-[#3163a2]/20 dark:text-blue-300">
                  <Layers3 size={22} />
                </div>

                <div>
                  <h3
                    id="module-modal-title"
                    className="font-bold text-[#22264b] dark:text-white"
                  >
                    Crear módulo
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Registra una nueva sección del sistema.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={creatingModule}
                aria-label="Cerrar modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL FORM */}

            <form onSubmit={handleCreateModuleSubmit} className="space-y-5 p-6">
              <div>
                <label htmlFor="module-name" className={labelClass}>
                  Nombre del módulo *
                </label>

                <input
                  id="module-name"
                  required
                  maxLength={100}
                  autoFocus
                  value={moduleForm.name}
                  onChange={(event) =>
                    setModuleForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ej. Gestión de proveedores"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="module-code" className={labelClass}>
                  Código identificador *
                </label>

                <input
                  id="module-code"
                  required
                  maxLength={100}
                  value={moduleForm.code}
                  onChange={(event) =>
                    setModuleForm((current) => ({
                      ...current,
                      code: event.target.value,
                    }))
                  }
                  placeholder="Ej. proveedores"
                  className={`${inputClass} font-mono`}
                />

                <p className="mt-1.5 text-[11px] text-slate-400">
                  Identificador único utilizado internamente por el sistema.
                </p>
              </div>

              <div>
                <label htmlFor="module-description" className={labelClass}>
                  Descripción
                </label>

                <textarea
                  id="module-description"
                  rows={3}
                  maxLength={500}
                  value={moduleForm.description}
                  onChange={(event) =>
                    setModuleForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe brevemente la funcionalidad del módulo..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {moduleError && (
                <div role="alert" className={errorClass}>
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{moduleError}</span>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creatingModule}
                  className={secondaryButton}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    creatingModule ||
                    !moduleForm.name.trim() ||
                    !moduleForm.code.trim()
                  }
                  className={primaryButton}
                >
                  {creatingModule ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}

                  {creatingModule ? "Creando módulo..." : "Crear módulo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* MODAL: CREATE PERMISSION */}
      {/* ===================================================== */}

      {activeModal === "permission" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#050b17]/65 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="permission-modal-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 dark:border-white/10 dark:bg-[#111d35]"
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-100 p-6 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#9dbf14]/15 p-3 text-[#819d10] dark:bg-[#9dbf14]/15 dark:text-[#c0df54]">
                  <ShieldPlus size={22} />
                </div>

                <div>
                  <h3
                    id="permission-modal-title"
                    className="font-bold text-[#22264b] dark:text-white"
                  >
                    Crear permiso
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Define una acción disponible en el sistema.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={creatingPermission}
                aria-label="Cerrar modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleCreatePermissionSubmit}
              className="space-y-5 p-6"
            >
              <div>
                <label htmlFor="permission-module" className={labelClass}>
                  Módulo asociado *
                </label>

                <select
                  id="permission-module"
                  required
                  autoFocus
                  value={permissionForm.moduleId}
                  onChange={(event) =>
                    setPermissionForm((current) => ({
                      ...current,
                      moduleId: event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Selecciona un módulo</option>

                  {availableModules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="permission-name" className={labelClass}>
                  Código del permiso *
                </label>

                <input
                  id="permission-name"
                  required
                  maxLength={150}
                  value={permissionForm.name}
                  onChange={(event) =>
                    setPermissionForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ej. providers.view"
                  className={`${inputClass} font-mono`}
                />

                <p className="mt-1.5 text-[11px] text-slate-400">
                  Utiliza una nomenclatura consistente: módulo.acción
                </p>
              </div>

              <div>
                <label htmlFor="permission-description" className={labelClass}>
                  Descripción
                </label>

                <textarea
                  id="permission-description"
                  rows={3}
                  maxLength={500}
                  value={permissionForm.description}
                  onChange={(event) =>
                    setPermissionForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe qué permite realizar esta acción..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {permissionError && (
                <div role="alert" className={errorClass}>
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{permissionError}</span>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creatingPermission}
                  className={secondaryButton}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    creatingPermission ||
                    !permissionForm.moduleId ||
                    !permissionForm.name.trim()
                  }
                  className={primaryButton}
                >
                  {creatingPermission ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}

                  {creatingPermission ? "Creando permiso..." : "Crear permiso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

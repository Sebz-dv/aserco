import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  Camera,
  ChevronDown,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  Settings2,
  Users,
  UserCircle2,
} from "lucide-react";

import { getMyUserProfile } from "../../lib/api";

import type { DashboardSidebarProps } from "./dashboard-sidebar/sidebar.types";

export type { DashboardSection } from "./dashboard-sidebar/sidebar.types";

import { SidebarAction } from "./dashboard-sidebar/SidebarAction";

import { SidebarHeader } from "./dashboard-sidebar/SidebarHeader";

import { SidebarNavigation } from "./dashboard-sidebar/SidebarNavigation";

import { SidebarUserCard } from "./dashboard-sidebar/SidebarUserCard";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

function resolveAvatarUrl(value: string | null | undefined): string | null {
  const next = value?.trim();
  if (!next) return null;

  const useProxy =
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  if (/^(https?:\/\/|data:|blob:)/.test(next)) return next;

  if (next.startsWith("//")) {
    const protocol =
      typeof window !== "undefined" ? window.location.protocol : "https:";
    return `${protocol}${next}`;
  }

  if (next.startsWith("/")) {
    return useProxy
      ? `${window.location.origin}${next}`
      : `${API_ORIGIN}${next}`;
  }

  return useProxy
    ? `${window.location.origin}/${next}`
    : `${API_ORIGIN}/${next}`;
}

function calculateMenuPosition(
  trigger: HTMLElement,
  menu: HTMLElement,
  fallbackHeight: number,
  fallbackWidth: number,
) {
  const margin = 8;
  const triggerRect = trigger.getBoundingClientRect();
  const menuHeight = menu.offsetHeight || fallbackHeight;
  const menuWidth = menu.offsetWidth || fallbackWidth;
  const overflowBottom =
    triggerRect.top + menuHeight - (window.innerHeight - margin);
  const minTop = margin - triggerRect.top;

  const adjustedTop = overflowBottom > 0 ? -overflowBottom : 0;

  return {
    top: Math.max(adjustedTop, minTop),
    openLeft: triggerRect.right + 8 + menuWidth > window.innerWidth - margin,
  };
}

export function DashboardSidebar({
  dark,
  user,
  sidebarOpen,
  activeSection = "overview",
  onToggleSidebar: _onToggleSidebar,
  onBackHome: _onBackHome,
  onLogout,
  onConfirmLogout,
  showKnowledge = false,
  showUsersOption = true,
  showRolesOption = true,
  onOpenOverview,
  onOpenUsers,
  onOpenRoles,
  onOpenKnowledge,
  onOpenProfile,
  onOpenProfileSection,
}: DashboardSidebarProps) {
  const profileCloseTimeoutRef = useRef<number | null>(null);

  const settingsCloseTimeoutRef = useRef<number | null>(null);

  const profileTriggerRef = useRef<HTMLDivElement | null>(null);

  const collapsedProfileMenuRef = useRef<HTMLDivElement | null>(null);

  const settingsTriggerRef = useRef<HTMLButtonElement | null>(null);

  const collapsedSettingsMenuRef = useRef<HTMLDivElement | null>(null);

  const [profileMenuOpen, setProfileMenuOpen] = useState(
    activeSection === "profile",
  );

  const [profileAvatarLoadError, setProfileAvatarLoadError] = useState(false);

  const [resolvedProfileAvatarUrl, setResolvedProfileAvatarUrl] = useState<
    string | null
  >(null);

  const hasSettingsOptions = showUsersOption || showRolesOption;

  const isSettingsActive =
    (showUsersOption && activeSection === "users") ||
    (showRolesOption && activeSection === "roles");

  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);

  const [collapsedProfileOffsetTop, setCollapsedProfileOffsetTop] = useState(0);

  const [collapsedProfileToLeft, setCollapsedProfileToLeft] = useState(false);

  const [collapsedSettingsOffsetTop, setCollapsedSettingsOffsetTop] =
    useState(0);

  const [collapsedSettingsToLeft, setCollapsedSettingsToLeft] = useState(false);

  const profileRoutes = [
    { label: "Inicio de perfil", hash: "#admin/perfil", icon: UserCircle2 },

    { label: "Fotografía", hash: "#admin/perfil/fotografia", icon: Camera },

    {
      label: "Información personal",

      hash: "#admin/perfil/personal",

      icon: UserCircle2,
    },

    {
      label: "Información empresarial",

      hash: "#admin/perfil/empresarial",

      icon: Building2,
    },

    {
      label: "Información comercial",

      hash: "#admin/perfil/comercial",

      icon: BriefcaseBusiness,
    },

    { label: "Seguridad", hash: "#admin/perfil/seguridad", icon: LockKeyhole },

    { label: "Actividad", hash: "#admin/perfil/actividad", icon: Activity },
  ] as const;

  const profileAvatarUrl = resolveAvatarUrl(
    user?.avatarUrl ?? user?.defaultAvatarUrl ?? null,
  );

  const showProfileAvatar =
    Boolean(resolvedProfileAvatarUrl) && !profileAvatarLoadError;

  const handleLogout = () => {
    if (onConfirmLogout) {
      onConfirmLogout();

      return;
    }

    onLogout();
  };

  useEffect(() => {
    if (!sidebarOpen && !isSettingsActive) {
      setSettingsOpen(false);
    }
  }, [sidebarOpen, isSettingsActive]);

  useEffect(() => {
    if (!hasSettingsOptions) {
      setSettingsOpen(false);
    }
  }, [hasSettingsOptions]);

  useEffect(() => {
    if (sidebarOpen && activeSection !== "profile") {
      setProfileMenuOpen(false);
    }
  }, [sidebarOpen, activeSection]);

  useEffect(() => {
    let active = true;

    const hydrateAvatar = async () => {
      if (!user) {
        if (active) setResolvedProfileAvatarUrl(null);

        return;
      }

      if (profileAvatarUrl) {
        if (active) setResolvedProfileAvatarUrl(profileAvatarUrl);

        return;
      }

      try {
        const response = await getMyUserProfile();

        const fromProfile = resolveAvatarUrl(
          response.profile.avatarUrl ??
            response.profile.defaultAvatarUrl ??
            null,
        );

        if (active) {
          setResolvedProfileAvatarUrl(fromProfile);
        }
      } catch {
        if (active) {
          setResolvedProfileAvatarUrl(null);
        }
      }
    };

    void hydrateAvatar();

    return () => {
      active = false;
    };
  }, [user?.id, profileAvatarUrl]);

  useEffect(() => {
    setProfileAvatarLoadError(false);
  }, [resolvedProfileAvatarUrl]);

  const updateCollapsedSettingsPosition = useCallback(() => {
    if (sidebarOpen || !settingsOpen) return;

    const trigger = settingsTriggerRef.current;
    const menu = collapsedSettingsMenuRef.current;
    if (!trigger || !menu || typeof window === "undefined") return;

    const position = calculateMenuPosition(trigger, menu, 200, 208);
    setCollapsedSettingsOffsetTop(position.top);
    setCollapsedSettingsToLeft(position.openLeft);
  }, [sidebarOpen, settingsOpen]);
  const clearProfileCloseTimeout = useCallback(() => {
    if (profileCloseTimeoutRef.current !== null) {
      window.clearTimeout(profileCloseTimeoutRef.current);

      profileCloseTimeoutRef.current = null;
    }
  }, []);

  const clearSettingsCloseTimeout = useCallback(() => {
    if (settingsCloseTimeoutRef.current !== null) {
      window.clearTimeout(settingsCloseTimeoutRef.current);

      settingsCloseTimeoutRef.current = null;
    }
  }, []);

  const scheduleProfileMenuClose = useCallback(() => {
    if (sidebarOpen) {
      return;
    }

    clearProfileCloseTimeout();

    profileCloseTimeoutRef.current = window.setTimeout(() => {
      setProfileMenuOpen(false);

      profileCloseTimeoutRef.current = null;
    }, 180);
  }, [sidebarOpen, clearProfileCloseTimeout]);

  const scheduleSettingsMenuClose = useCallback(() => {
    if (sidebarOpen) {
      return;
    }

    clearSettingsCloseTimeout();

    settingsCloseTimeoutRef.current = window.setTimeout(() => {
      setSettingsOpen(false);

      settingsCloseTimeoutRef.current = null;
    }, 180);
  }, [sidebarOpen, clearSettingsCloseTimeout]);

  const updateCollapsedProfilePosition = useCallback(() => {
    if (sidebarOpen || !profileMenuOpen) return;

    const trigger = profileTriggerRef.current;
    const menu = collapsedProfileMenuRef.current;
    if (!trigger || !menu || typeof window === "undefined") return;

    const position = calculateMenuPosition(trigger, menu, 280, 248);
    setCollapsedProfileOffsetTop(position.top);
    setCollapsedProfileToLeft(position.openLeft);
  }, [sidebarOpen, profileMenuOpen]);
  useEffect(() => {
    if (sidebarOpen || !settingsOpen) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      updateCollapsedSettingsPosition();
    });

    const handleReposition = () => {
      updateCollapsedSettingsPosition();
    };

    window.addEventListener("resize", handleReposition);

    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.cancelAnimationFrame(rafId);

      window.removeEventListener("resize", handleReposition);

      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [sidebarOpen, settingsOpen, updateCollapsedSettingsPosition]);

  useEffect(() => {
    if (sidebarOpen || !profileMenuOpen) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      updateCollapsedProfilePosition();
    });

    const handleReposition = () => {
      updateCollapsedProfilePosition();
    };

    window.addEventListener("resize", handleReposition);

    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.cancelAnimationFrame(rafId);

      window.removeEventListener("resize", handleReposition);

      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [sidebarOpen, profileMenuOpen, updateCollapsedProfilePosition]);

  useEffect(() => {
    return () => {
      clearProfileCloseTimeout();

      clearSettingsCloseTimeout();
    };
  }, [clearProfileCloseTimeout, clearSettingsCloseTimeout]);

  let settingsLayoutClass = "justify-center px-0";
  if (sidebarOpen) settingsLayoutClass = "justify-start gap-3 px-3";

  let settingsButtonStateClass =
    "text-slate-600 hover:bg-[#eef3ff] hover:text-[#22264b]";
  if (dark)
    settingsButtonStateClass =
      "text-slate-400 hover:bg-white/6 hover:text-white";
  if (isSettingsActive && dark)
    settingsButtonStateClass = "bg-[#9dbf14]/10 text-[#dff090]";
  if (isSettingsActive && !dark)
    settingsButtonStateClass = "bg-[#edf5c5] text-[#22264b]";

  let settingsIconClass = "text-slate-500 group-hover:text-[#789900]";
  if (dark) settingsIconClass = "text-slate-400 group-hover:text-[#dff090]";
  if (isSettingsActive) settingsIconClass = "text-[#9dbf14]";

  return (
    <aside
      aria-label="Menú principal"
      className={`

        aserco-dashboard-sidebar

        sticky top-0 z-40 hidden h-dvh shrink-0 flex-col

        overflow-visible border-r

        transition-[width] duration-200 ease-in-out

        will-change-[width]

        lg:flex

        ${sidebarOpen ? "w-72" : "w-19"}

      `}
    >
      {/* DECORACIÓN DE FONDO */}

      <div
        className={`

          pointer-events-none absolute -right-28 top-24

          size-72 rounded-full blur-3xl

          ${dark ? "bg-[#3163a2]/10" : "bg-[#eef3ff]/80"}

        `}
      />

      <div
        className={`

          pointer-events-none absolute -bottom-32 -left-24

          size-64 rounded-full blur-3xl

          ${dark ? "bg-[#9dbf14]/6" : "bg-[#edf5c5]/80"}

        `}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <SidebarHeader dark={dark} sidebarOpen={sidebarOpen} />

        <SidebarNavigation
          dark={dark}
          sidebarOpen={sidebarOpen}
          activeSection={activeSection}
          showKnowledge={showKnowledge}
          onOpenOverview={onOpenOverview}
          onOpenKnowledge={onOpenKnowledge}
        />

        {/* PERFIL Y CONFIGURACIÓN */}

        <div
          className={`

            relative z-20 shrink-0 pb-3

            transition-all duration-200

            ${sidebarOpen ? "px-3" : "px-2"}

          `}
        >
          <div
            ref={profileTriggerRef}
            className="relative"
            onMouseEnter={() => {
              if (!sidebarOpen) {
                clearProfileCloseTimeout();

                setProfileMenuOpen(true);
              }
            }}
            onMouseLeave={() => {
              scheduleProfileMenuClose();
            }}
          >
            <SidebarAction
              icon={UserCircle2}
              label="Mi perfil"
              sidebarOpen={sidebarOpen}
              dark={dark}
              active={activeSection === "profile"}
              avatarSrc={showProfileAvatar ? resolvedProfileAvatarUrl : null}
              avatarAlt={`Foto de ${user?.name ?? "Usuario"}`}
              onAvatarError={() => setProfileAvatarLoadError(true)}
              onClick={() => {
                onOpenProfile?.();

                setProfileMenuOpen((value) => !value);

                window.location.hash = "#admin/perfil";
              }}
            />

            {sidebarOpen && profileMenuOpen && (
              <div
                className={`

                  mb-3 mt-2 ml-5 border-l pl-3

                  animate-in fade-in slide-in-from-top-1 duration-150

                  ${dark ? "border-white/12" : "border-slate-300"}

                `}
              >
                <div className="flex flex-col gap-1">
                  {profileRoutes.map((item) => {
                    const isActiveRoute =
                      typeof window !== "undefined" &&
                      window.location.hash === item.hash;

                    return (
                      <SidebarAction
                        key={item.hash}
                        icon={item.icon}
                        label={item.label}
                        sidebarOpen={sidebarOpen}
                        dark={dark}
                        active={isActiveRoute}
                        nested
                        onClick={() => {
                          onOpenProfileSection?.();

                          setProfileMenuOpen(false);

                          window.location.hash = item.hash;
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {profileMenuOpen && !sidebarOpen && (
              <div
                ref={collapsedProfileMenuRef}
                onMouseEnter={clearProfileCloseTimeout}
                onMouseLeave={scheduleProfileMenuClose}
                className={`

                  absolute top-0 z-110 w-62

                  rounded-xl border p-2 shadow-xl

                  overflow-y-auto

                  animate-in fade-in slide-in-from-left-1 duration-150

                  ${collapsedProfileToLeft ? "right-full mr-2" : "left-full ml-2"}

                  ${
                    dark
                      ? "border-white/10 bg-[#111d35] shadow-black/30"
                      : "border-slate-200 bg-white shadow-slate-900/15"
                  }

                `}
                style={{
                  top: collapsedProfileOffsetTop,

                  maxHeight: "calc(100vh - 16px)",
                }}
              >
                <p
                  className={`

                    px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em]

                    ${dark ? "text-slate-500" : "text-slate-400"}

                  `}
                >
                  Mi perfil
                </p>

                <div className="flex flex-col gap-1">
                  {profileRoutes.map((item) => {
                    const isActiveRoute =
                      typeof window !== "undefined" &&
                      window.location.hash === item.hash;

                    return (
                      <SidebarAction
                        key={item.hash}
                        icon={item.icon}
                        label={item.label}
                        sidebarOpen={true}
                        dark={dark}
                        active={isActiveRoute}
                        onClick={() => {
                          onOpenProfileSection?.();

                          setProfileMenuOpen(false);

                          window.location.hash = item.hash;
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* MENÚ CONFIGURACIÓN */}

          {hasSettingsOptions && (
            <div
              className="relative mb-3 mt-2"
              onMouseEnter={() => {
                clearSettingsCloseTimeout();

                setSettingsOpen(true);
              }}
              onMouseLeave={scheduleSettingsMenuClose}
            >
              <button
                ref={settingsTriggerRef}
                type="button"
                onClick={() => setSettingsOpen((value) => !value)}
                onFocus={() => setSettingsOpen(true)}
                aria-expanded={settingsOpen}
                aria-haspopup="true"
                aria-label="Configuración"
                title={!sidebarOpen ? "Configuración" : undefined}
                className={`

                aserco-sidebar-action group flex w-full items-center rounded-xl py-2.5

                transition-all duration-200

                focus-visible:outline-none

                focus-visible:ring-2 focus-visible:ring-[#9dbf14]/50

                ${settingsLayoutClass}
                ${settingsButtonStateClass}
              `}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg">
                  <Settings2
                    size={19}
                    strokeWidth={1.9}
                    className={settingsIconClass}
                  />
                </span>

                {sidebarOpen && (
                  <>
                    <span className="min-w-0 flex-1 text-left text-[13px] font-medium">
                      Configuración
                    </span>

                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${
                        settingsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {/* SUBMENÚ SIDEBAR EXPANDIDO */}

              {settingsOpen && sidebarOpen && (
                <div
                  className={`

                  ml-5 mt-2 border-l pl-3

                  animate-in fade-in slide-in-from-top-1 duration-150

                  ${dark ? "border-white/12" : "border-slate-300"}

                `}
                >
                  <div className="flex flex-col gap-1">
                    {showUsersOption && (
                      <SidebarAction
                        icon={Users}
                        label="Usuarios"
                        sidebarOpen={sidebarOpen}
                        dark={dark}
                        active={activeSection === "users"}
                        nested
                        onClick={() => {
                          setSettingsOpen(false);

                          onOpenUsers?.();
                        }}
                      />
                    )}

                    {showRolesOption && (
                      <SidebarAction
                        icon={ShieldCheck}
                        label="Roles & permisos"
                        sidebarOpen={sidebarOpen}
                        dark={dark}
                        active={activeSection === "roles"}
                        nested
                        onClick={() => {
                          setSettingsOpen(false);

                          onOpenRoles?.();
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* SUBMENÚ SIDEBAR CONTRAÍDO */}

              {settingsOpen && !sidebarOpen && (
                <div
                  ref={collapsedSettingsMenuRef}
                  onMouseEnter={clearSettingsCloseTimeout}
                  onMouseLeave={scheduleSettingsMenuClose}
                  className={`

                  absolute top-0 z-100 w-52

                  rounded-xl border p-2 shadow-xl

                  overflow-y-auto

                  animate-in fade-in slide-in-from-left-1 duration-150

                  ${collapsedSettingsToLeft ? "right-full mr-2" : "left-full ml-2"}

                  ${
                    dark
                      ? "border-white/10 bg-[#111d35] shadow-black/30"
                      : "border-slate-200 bg-white shadow-slate-900/15"
                  }

                `}
                  style={{
                    top: collapsedSettingsOffsetTop,

                    maxHeight: "calc(100vh - 16px)",
                  }}
                >
                  <p
                    className={`

                    px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em]

                    ${dark ? "text-slate-500" : "text-slate-400"}

                  `}
                  >
                    Configuración
                  </p>

                  <div className="flex flex-col gap-1">
                    {showUsersOption && (
                      <SidebarAction
                        icon={Users}
                        label="Usuarios"
                        sidebarOpen={true}
                        dark={dark}
                        active={activeSection === "users"}
                        onClick={() => {
                          setSettingsOpen(false);

                          onOpenUsers?.();
                        }}
                      />
                    )}

                    {showRolesOption && (
                      <SidebarAction
                        icon={ShieldCheck}
                        label="Roles & permisos"
                        sidebarOpen={true}
                        dark={dark}
                        active={activeSection === "roles"}
                        onClick={() => {
                          setSettingsOpen(false);

                          onOpenRoles?.();
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {sidebarOpen && (
            <SidebarUserCard
              dark={dark}
              userName={user?.name}
              userEmail={user?.email}
            />
          )}

          {/* CERRAR SESIÓN */}

          <SidebarAction
            icon={LogOut}
            label="Cerrar sesión"
            sidebarOpen={sidebarOpen}
            dark={dark}
            danger
            onClick={handleLogout}
          />
        </div>
      </div>
    </aside>
  );
}

export function DashboardSidebarBadge() {
  return (
    <ShieldCheck className="text-[#3163a2] dark:text-[#9dbf14]" size={18} />
  );
}

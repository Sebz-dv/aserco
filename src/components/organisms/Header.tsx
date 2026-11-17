import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AuthActions } from "../atoms/AuthActions";
import {
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  X
} from "lucide-react";

import { Brand } from "../atoms/Brand";
import { UserAvatar } from "../atoms/UserAvatar";
import { getMyUserProfile, type AuthUser } from "../../lib/api";

type Props = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  onToggleTheme: () => void;
  onConfirmLogout?: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: (path?: string) => void;
  onOpenKnowledge: () => void;
}>;

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Línea empresarial", href: "#servicios" },
  { label: "Línea personas", href: "#linea-personas" },
  { label: "Cómo trabajamos", href: "#nosotros" },
];

const navContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const navItem = {
  hidden: { opacity: 0, y: -7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

export function Header({
  dark,
  user,
  onToggleTheme,
  onConfirmLogout,
  onOpenProfile,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
  onOpenKnowledge,
}: Props) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [resolvedAvatarUrl, setResolvedAvatarUrl] = useState<string | null>(
    null,
  );

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const dashboards = user?.dashboards ?? [];

  const permissions = (user?.permissions ?? []).map((permission) =>
    permission.toLowerCase(),
  );

  const hasPermissionPrefix = (prefixes: string[]) =>
    permissions.some((permission) =>
      prefixes.some(
        (prefix) =>
          permission === prefix || permission.startsWith(`${prefix}.`),
      ),
    );

  const canAccessDashboard = Boolean(
    dashboards.length > 0 ||
    user?.roles?.includes("super_admin") ||
    hasPermissionPrefix([
      "dashboard",
      "users",
      "admin.users",
      "roles",
      "admin.roles",
      "permissions",
      "admin.permissions",
      "modules",
      "admin.modules",
      "knowledge",
      "admin.knowledge",
      "editorial",
    ]),
  );

  // --------------------------------------------------
  // AVATAR
  // --------------------------------------------------

  const apiBaseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

  const shouldUseLocalSameOriginProxy = () => {
    if (!import.meta.env.DEV || typeof window === "undefined") {
      return false;
    }

    const frontendHost = window.location.hostname;

    const isLocalFrontend =
      frontendHost === "localhost" || frontendHost === "127.0.0.1";

    if (!isLocalFrontend) {
      return false;
    }

    try {
      const backendUrl = new URL(apiOrigin);
      const backendHost = backendUrl.hostname;

      return backendHost === "localhost" || backendHost === "127.0.0.1";
    } catch {
      return false;
    }
  };

  const resolveAvatarUrl = (value: string | null | undefined) => {
    const next = value?.trim();

    if (!next) return null;

    const useProxy = shouldUseLocalSameOriginProxy();

    if (
      next.startsWith("http://") ||
      next.startsWith("https://") ||
      next.startsWith("data:") ||
      next.startsWith("blob:")
    ) {
      return next;
    }

    if (next.startsWith("//")) {
      const protocol =
        typeof window !== "undefined" ? window.location.protocol : "https:";

      return `${protocol}${next}`;
    }

    if (next.startsWith("/")) {
      if (useProxy && typeof window !== "undefined") {
        return `${window.location.origin}${next}`;
      }

      return `${apiOrigin}${next}`;
    }

    if (useProxy && typeof window !== "undefined") {
      return `${window.location.origin}/${next}`;
    }

    return `${apiOrigin}/${next}`;
  };

  useEffect(() => {
    let active = true;

    const hydrateAvatar = async () => {
      if (!user) {
        if (active) setResolvedAvatarUrl(null);
        return;
      }

      const directAvatar = resolveAvatarUrl(
        user.avatarUrl ?? user.defaultAvatarUrl ?? null,
      );

      if (directAvatar) {
        if (active) setResolvedAvatarUrl(directAvatar);
        return;
      }

      try {
        const response = await getMyUserProfile();

        const profileAvatar = resolveAvatarUrl(
          response.profile.avatarUrl ??
            response.profile.defaultAvatarUrl ??
            null,
        );

        if (active) {
          setResolvedAvatarUrl(profileAvatar);
        }
      } catch {
        if (active) {
          setResolvedAvatarUrl(null);
        }
      }
    };

    void hydrateAvatar();

    return () => {
      active = false;
    };
  }, [user?.id, user?.avatarUrl, user?.defaultAvatarUrl]);

  const showAvatar = Boolean(resolvedAvatarUrl) && !avatarLoadError;

  useEffect(() => {
    setAvatarLoadError(false);
  }, [resolvedAvatarUrl]);

  // --------------------------------------------------
  // CERRAR MENÚ AL HACER CLIC FUERA
  // --------------------------------------------------

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current) return;

      if (!userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  // --------------------------------------------------
  // ACCIONES
  // --------------------------------------------------

  const closeMenu = () => setOpen(false);
  const closeUserMenu = () => setUserMenuOpen(false);

  const handleOpenKnowledge = () => {
    closeMenu();
    closeUserMenu();
    onOpenKnowledge();
  };

  const handleOpenProfile = () => {
    closeMenu();
    closeUserMenu();
    onOpenProfile();
  };

  const handleOpenDashboard = () => {
    closeMenu();
    closeUserMenu();
    onOpenAdmin(dashboards[0]?.path ?? "/dashboard/admin");
  };

  const handleLogout = () => {
    closeMenu();
    closeUserMenu();
    onConfirmLogout?.();
  };

  const handleOpenLogin = () => {
    closeMenu();
    onOpenLogin();
  };

  const handleOpenRegister = () => {
    closeMenu();
    onOpenRegister();
  };

  // --------------------------------------------------
  // BOTÓN DE TEMA
  // --------------------------------------------------

  const themeButton = (
    <motion.button
      type="button"
      onClick={onToggleTheme}
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      title={dark ? "Activar modo claro" : "Activar modo oscuro"}
      whileHover={reduceMotion ? undefined : { scale: 1.07, rotate: 5 }}
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      transition={{ duration: 0.2 }}
      className="
        grid size-9 shrink-0 place-items-center rounded-full
        border border-slate-200/70
        bg-white/50 text-[#3163a2]
        shadow-sm backdrop-blur-md
        transition-colors duration-300
        hover:border-[#9dbf14]
        hover:bg-white/80 hover:text-[#9dbf14]
        dark:border-white/10
        dark:bg-white/5 dark:text-slate-300
        dark:hover:bg-white/10 dark:hover:text-[#b8d94b]
      "
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          initial={
            reduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.6 }
          }
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={
            reduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.6 }
          }
          transition={{ duration: 0.2 }}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );

  // --------------------------------------------------
  // MENÚ DE USUARIO
  // --------------------------------------------------

  const userDropdown = (
    <div ref={userMenuRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setUserMenuOpen((value) => !value)}
        aria-expanded={userMenuOpen}
        aria-haspopup="menu"
        whileHover={reduceMotion ? undefined : { y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="
          inline-flex h-9 items-center gap-2
          rounded-full border border-slate-200/80
          bg-white/60 px-2.5
          text-xs font-semibold text-[#22264b]
          shadow-sm transition-all duration-200
          hover:border-[#9dbf14]
          dark:border-white/10
          dark:bg-white/5 dark:text-white
        "
      >
        <UserAvatar
          name={user?.name ?? ""}
          src={showAvatar ? resolvedAvatarUrl : null}
          size="sm"
          onError={() => setAvatarLoadError(true)}
        />

        <span className="max-w-26 truncate">{user?.name}</span>

        <motion.span
          animate={{ rotate: userMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            role="menu"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              absolute right-0 top-full z-50 mt-3
              w-60 overflow-hidden rounded-2xl
              border border-slate-200
              bg-white shadow-[0_20px_45px_rgba(34,38,75,0.12)]
              dark:border-white/10 dark:bg-[#111d35]
            "
          >
            <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">
                Usuario
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-[#22264b] dark:text-white">
                {user?.name}
              </p>

              <p className="truncate text-xs text-slate-500 dark:text-slate-300">
                {user?.email}
              </p>
            </div>

            {canAccessDashboard && (
              <button
                type="button"
                role="menuitem"
                onClick={handleOpenDashboard}
                className="
                  flex w-full items-center gap-3
                  px-4 py-3 text-left text-sm font-medium
                  text-[#22264b] transition
                  hover:bg-[#f5f7f2]
                  dark:text-white dark:hover:bg-white/5
                "
              >
                <LayoutDashboard
                  size={16}
                  className="text-[#3163a2] dark:text-[#9dbf14]"
                />
                Ir al dashboard
              </button>
            )}

            <button
              type="button"
              role="menuitem"
              onClick={handleOpenProfile}
              className="
                flex w-full items-center gap-3
                border-t border-slate-200
                px-4 py-3 text-left text-sm font-medium
                text-[#22264b] transition
                hover:bg-[#f5f7f2]
                dark:border-white/10
                dark:text-white dark:hover:bg-white/5
              "
            >
              <UserAvatar
                name={user?.name ?? ""}
                src={showAvatar ? resolvedAvatarUrl : null}
                size="sm"
                onError={() => setAvatarLoadError(true)}
              />
              Mi perfil
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3
                border-t border-slate-200
                px-4 py-3 text-left text-sm font-medium
                text-[#22264b] transition
                hover:bg-red-50
                dark:border-white/10
                dark:text-white dark:hover:bg-red-500/10
              "
            >
              <LogOut
                size={16}
                className="text-[#3163a2] dark:text-[#9dbf14]"
              />
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        fixed inset-x-0 top-0 z-[9999] w-full
        border-b border-slate-200/60
        bg-white/90
        shadow-[0_4px_24px_rgba(34,38,75,0.045)]
        backdrop-blur-xl
        transition-colors duration-300
        dark:border-white/[0.07]
        dark:bg-[#080f1f]/90
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.15)]
      "
    >
      {/* CONTENEDOR PRINCIPAL */}
      <div
        className="
          mx-auto flex max-w-[1440px] items-center
          justify-between gap-5
          px-5 py-3 lg:px-8
        "
      >
        {/* LOGO */}
        <motion.a
          href="#inicio"
          onClick={closeMenu}
          initial={reduceMotion ? false : { opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={reduceMotion ? undefined : { scale: 1.025 }}
          className="shrink-0"
        >
          <Brand />
        </motion.a>

        {/* NAVEGACIÓN DESKTOP */}
        <motion.nav
          aria-label="Navegación principal"
          variants={navContainer}
          initial="hidden"
          animate="visible"
          className="
            hidden items-center gap-4
            xl:flex 2xl:gap-6
          "
        >
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              variants={navItem}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className="
                group relative whitespace-nowrap py-2
                text-[12px] font-semibold
                text-[#3163a2]
                transition-colors duration-200
                hover:text-[#22264b]
                dark:text-slate-300
                dark:hover:text-white
                2xl:text-[13px]
              "
            >
              {link.label}

              <motion.span
                className="
                  absolute bottom-0 left-0 h-[2px]
                  w-full origin-left rounded-full
                  bg-[#9dbf14]
                "
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0 }}
              />
            </motion.a>
          ))}
        </motion.nav>

        {/* ACCIONES DESKTOP */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden shrink-0 items-center gap-2 xl:flex"
        >
          {/* REVISTA */}
          <motion.button
            type="button"
            onClick={handleOpenKnowledge}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="
              whitespace-nowrap rounded-lg
              px-2.5 py-2
              text-[12px] font-semibold
              text-slate-600
              transition-colors duration-200
              hover:bg-slate-100 hover:text-[#3163a2]
              dark:text-slate-300
              dark:hover:bg-white/5 dark:hover:text-white
            "
          >
            Revista
          </motion.button>

          {/* HABLEMOS */}
          <motion.a
            href="#contacto"
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="
              inline-flex h-9 items-center justify-center
              whitespace-nowrap rounded-full
              bg-[#9dbf14] px-4
              text-[12px] font-bold text-[#22264b]
              shadow-sm transition-colors duration-200
              hover:bg-[#accf24]
            "
          >
            Hablemos
            <ArrowUpRight size={13} className="ml-1.5" />
          </motion.a>

          {/* TEMA */}
          {themeButton}

          {/* SEPARADOR */}
          <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/15" />

          {/* SESIÓN */}
          {user ? (
            userDropdown
          ) : (
            <AuthActions
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenRegister}
            />
          )}
        </motion.div>

        {/* ACCIONES MÓVILES */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          {themeButton}

          <motion.button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="
              grid size-9 place-items-center rounded-full
              border border-slate-200/70
              bg-white/50 text-[#3163a2]
              shadow-sm transition-colors duration-200
              hover:border-[#9dbf14]
              hover:bg-white/80
              dark:border-white/10
              dark:bg-white/5 dark:text-slate-300
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "menu"}
                initial={
                  reduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.7 }
                }
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, rotate: 45, scale: 0.7 }
                }
                transition={{ duration: 0.18 }}
              >
                {open ? <X size={19} /> : <Menu size={19} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-navigation"
            key="mobile-navigation"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.35,
              ease: "easeInOut",
            }}
            className="
              overflow-hidden
              border-t border-slate-200/50
              bg-white/95 backdrop-blur-2xl
              dark:border-white/[0.07]
              dark:bg-[#080f1f]/95
              xl:hidden
            "
          >
            <motion.nav
              aria-label="Navegación móvil"
              variants={navContainer}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-[1440px] space-y-1 px-5 py-4 lg:px-8"
            >
              {/* ENLACES */}
              {links.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  variants={navItem}
                  className="
                    flex items-center justify-between
                    rounded-xl px-4 py-3
                    text-sm font-semibold
                    text-[#22264b]
                    transition-colors
                    hover:bg-[#edf5c5]/60
                    dark:text-slate-200
                    dark:hover:bg-white/5
                  "
                >
                  {link.label}
                  <ArrowUpRight size={15} className="text-[#9dbf14]" />
                </motion.a>
              ))}

              <div className="my-3 h-px bg-slate-200 dark:bg-white/10" />

              {/* REVISTA */}
              <motion.button
                type="button"
                onClick={handleOpenKnowledge}
                variants={navItem}
                className="
                  flex w-full items-center justify-between
                  rounded-xl px-4 py-3
                  text-left text-sm font-semibold
                  text-[#3163a2]
                  transition-colors hover:bg-[#edf5c5]/50
                  dark:text-slate-200 dark:hover:bg-white/5
                "
              >
                Revista / Conocimiento
                <ArrowUpRight size={15} className="text-[#9dbf14]" />
              </motion.button>

              {/* USUARIO AUTENTICADO */}
              {user ? (
                <>
                  <motion.div
                    variants={navItem}
                    className="
                      mt-3 flex items-center gap-3
                      rounded-xl border border-slate-200
                      bg-slate-50 p-3
                      dark:border-white/10 dark:bg-white/5
                    "
                  >
                    <UserAvatar
                      name={user.name}
                      src={showAvatar ? resolvedAvatarUrl : null}
                      size="md"
                      onError={() => setAvatarLoadError(true)}
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">
                        Sesión activa
                      </p>

                      <p className="truncate text-sm font-semibold text-[#22264b] dark:text-white">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </motion.div>

                  {canAccessDashboard && (
                    <motion.button
                      type="button"
                      onClick={handleOpenDashboard}
                      variants={navItem}
                      className="
                        mt-2 flex w-full items-center
                        justify-center gap-2 rounded-xl
                        border border-[#3163a2]/30
                        bg-[#edf5c5] px-5 py-3
                        text-sm font-semibold text-[#22264b]
                        dark:border-[#9dbf14]/30
                        dark:bg-[#9dbf14]/10
                        dark:text-[#dff090]
                      "
                    >
                      <LayoutDashboard size={16} />
                      Ir al dashboard
                    </motion.button>
                  )}

                  <motion.button
                    type="button"
                    onClick={handleOpenProfile}
                    variants={navItem}
                    className="
                      mt-2 flex w-full items-center
                      justify-center gap-2 rounded-xl
                      border border-slate-200
                      px-5 py-3 text-sm font-semibold
                      text-[#22264b]
                      dark:border-white/10 dark:text-white
                    "
                  >
                    <UserAvatar
                      name={user.name}
                      src={showAvatar ? resolvedAvatarUrl : null}
                      size="sm"
                      onError={() => setAvatarLoadError(true)}
                    />
                    Mi perfil
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleLogout}
                    variants={navItem}
                    className="
                      mt-2 flex w-full items-center
                      justify-center gap-2 rounded-xl
                      border border-slate-200
                      px-5 py-3 text-sm font-semibold
                      text-[#22264b]
                      transition-colors hover:bg-red-50
                      dark:border-white/10 dark:text-white
                      dark:hover:bg-red-500/10
                    "
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </motion.button>
                </>
              ) : (
                <motion.div variants={navItem} className="mt-3">
                  <AuthActions
                    variant="mobile"
                    className="w-full"
                    onOpenLogin={handleOpenLogin}
                    onOpenRegister={handleOpenRegister}
                  />
                </motion.div>
              )}

              {/* CONTACTO */}
              <motion.a
                href="#contacto"
                onClick={closeMenu}
                variants={navItem}
                className="
                  mt-3 flex w-full items-center
                  justify-center gap-2 rounded-full
                  bg-[#9dbf14] px-4 py-3
                  text-sm font-bold text-[#22264b]
                  shadow-sm transition-colors
                  hover:bg-[#accf24]
                "
              >
                Hablemos
                <ArrowUpRight size={16} />
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

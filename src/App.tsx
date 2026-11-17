import { useEffect, useState, type ReactNode } from "react";

import { HomePage } from "./pages/HomePage";
import { AuthPage, type AuthMode } from "./pages/AuthPage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SplashLoader } from "./components/organisms/SplashLoader";
import { LandingSkeleton } from "./components/organisms/LandingSkeleton";
import {
  ToastContainer,
  type ToastItem,
  type ToastKind,
} from "./components/organisms/ToastContainer";
import { KnowledgeHomePage } from "./pages/KnowledgeHomePage";
import { KnowledgeArticlePage } from "./pages/KnowledgeArticlePage";
import type { AuthUser } from "./lib/api";

type AppView =
  | "home"
  | "auth"
  | "admin"
  | "profile"
  | "knowledge"
  | "knowledge-article"
  | "not-found";

type HashRoute =
  | "home"
  | "auth"
  | "login"
  | "register"
  | "admin"
  | "profile"
  | "knowledge"
  | "knowledge-article"
  | "not-found";

type AppBackgroundProps = Readonly<{
  children: ReactNode;
}>;

function AppBackground({ children }: AppBackgroundProps) {
  return (
    <div className="app-background relative isolate min-h-screen overflow-hidden text-[#22264b] antialiased transition-colors duration-300 dark:text-white">
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="ambient-light ambient-light-one" />
        <div className="ambient-light ambient-light-two" />
        <div className="ambient-light ambient-light-three" />
        <div className="ambient-light ambient-light-four" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function getInitialTheme(): boolean {
  const saved = localStorage.getItem("aserco-theme");

  if (saved === "dark") return true;

  if (saved === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getKnowledgeArticleSlugFromHash(hash: string): string | null {
  let route = hash.startsWith("#") ? hash.slice(1) : hash;

  route = route.trim().toLowerCase();

  while (route.startsWith("/")) {
    route = route.slice(1);
  }

  while (route.endsWith("/")) {
    route = route.slice(0, -1);
  }

  const prefix = "conocimiento/articulo/";

  if (!route.startsWith(prefix)) {
    return null;
  }

  const slug = route.slice(prefix.length);

  if (!slug) {
    return null;
  }

  try {
    return decodeURIComponent(slug);
  } catch {
    return null;
  }
}

const HOME_SECTION_IDS = new Set([
  "inicio",
  "servicios",
  "linea-personas",
  "nosotros",
  "contacto",
]);

function normalizeHashRoute(hash: string): HashRoute {
  let route = hash.startsWith("#") ? hash.slice(1) : hash;

  route = route.trim().toLowerCase();

  while (route.startsWith("/")) {
    route = route.slice(1);
  }

  while (route.endsWith("/")) {
    route = route.slice(0, -1);
  }

  if (!route || route === "home" || HOME_SECTION_IDS.has(route)) {
    return "home";
  }

  if (route === "login" || route === "auth") {
    return "auth";
  }

  if (route === "register") {
    return "register";
  }

  if (
    route === "admin" ||
    route === "admin/usuarios" ||
    route === "admin/roles" ||
    route === "admin/conocimiento" ||
    route === "admin/perfil" ||
    route.startsWith("admin/perfil/")
  ) {
    return "admin";
  }

  if (
    route === "perfil" ||
    route === "profile" ||
    route === "mi-perfil" ||
    route.startsWith("perfil/") ||
    route.startsWith("profile/")
  ) {
    return "profile";
  }

  if (route === "conocimiento") {
    return "knowledge";
  }

  if (route.startsWith("conocimiento/articulo/")) {
    return "knowledge-article";
  }

  return "not-found";
}

export default function App() {
  const [dark, setDark] = useState<boolean>(getInitialTheme);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [view, setView] = useState<AppView>("home");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [knowledgeSlug, setKnowledgeSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [landingReady, setLandingReady] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = (
    message: string,
    kind: ToastKind = "info",
    title?: string,
  ) => {
    const item: ToastItem = {
      id: Date.now() + Math.random(),
      title,
      message,
      kind,
    };

    setToasts((current) => [...current, item]);

    if (kind !== "confirm") {
      window.setTimeout(() => removeToast(item.id), 3800);
    }
  };

  const pushConfirmToast = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title = "Confirmación",
  ) => {
    const item: ToastItem = {
      id: Date.now() + Math.random(),
      title,
      message,
      kind: "confirm",
      onConfirm,
      onCancel,
    };

    setToasts((current) => [...current, item]);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1200);

    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const showSkeleton = window.setTimeout(() => {
      setLandingReady(true);
    }, 200);

    return () => window.clearTimeout(showSkeleton);
  }, [loading]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("aserco-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (loading) return;

    const revealElements =
      document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [loading, landingReady, view]);

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = "";
    }
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    let active = true;

    const syncCurrentUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (active) setUser(null);
          return;
        }

        const data = (await response.json()) as {
          user?: AuthUser | null;
        };

        if (active) setUser(data.user ?? null);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setAuthReady(true);
      }
    };

    void syncCurrentUser();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (loading || !authReady) return;

    const syncRoute = () => {
      const currentHash = window.location.hash;
      const route = normalizeHashRoute(currentHash);
      const articleSlug = getKnowledgeArticleSlugFromHash(currentHash);

      setKnowledgeSlug(articleSlug);

      if (route === "admin") {
        if (!user) {
          setUser(null);
          setAuthMode("login");
          setView("auth");
          window.location.hash = "#login";
          return;
        }

        setView("admin");
        return;
      }

      if (route === "profile") {
        if (!user) {
          setUser(null);
          setAuthMode("login");
          setView("auth");
          window.location.hash = "#login";
          return;
        }

        setView("admin");

        if (!window.location.hash.startsWith("#admin/perfil")) {
          window.location.hash = "#admin/perfil";
        }

        return;
      }

      if (route === "knowledge") {
        setView("knowledge");
        return;
      }

      if (route === "knowledge-article") {
        setView(articleSlug ? "knowledge-article" : "not-found");
        return;
      }

      if (route === "login" || route === "auth") {
        setAuthMode("login");
        setView("auth");
        return;
      }

      if (route === "register") {
        setAuthMode("register");
        setView("auth");
        return;
      }

      if (route === "home") {
        setView("home");
        return;
      }

      setView("not-found");
    };

    syncRoute();

    window.addEventListener("hashchange", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
    };
  }, [loading, authReady, user]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setAuthMode("login");
      setView("auth");

      if (window.location.hash !== "#login") {
        window.location.hash = "#login";
      }

      pushToast(
        "Tu sesión expiró. Inicia sesión nuevamente.",
        "info",
        "Sesión expirada",
      );
    };

    window.addEventListener("aserco:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("aserco:unauthorized", handleUnauthorized);
    };
  }, []);

  const applyView = (
    nextView: AppView,
    nextMode: AuthMode = "login",
    nextSlug?: string,
  ) => {
    setView(nextView);
    setAuthMode(nextMode);

    if (nextView === "home") {
      window.location.hash = "#inicio";
      return;
    }

    if (nextView === "admin") {
      window.location.hash = "#admin";
      return;
    }

    if (nextView === "profile") {
      window.location.hash = "#perfil";
      return;
    }

    if (nextView === "knowledge") {
      window.location.hash = "#conocimiento";
      return;
    }

    if (nextView === "knowledge-article" && nextSlug) {
      window.location.hash = `#conocimiento/articulo/${encodeURIComponent(nextSlug)}`;
      return;
    }

    if (nextView === "auth") {
      window.location.hash = nextMode === "register" ? "#register" : "#login";
      return;
    }

    window.location.hash = "#404";
  };

  const handleAuthSuccess = (authUser: AuthUser) => {
    setUser(authUser);
    pushToast("Sesión iniciada correctamente.", "success", "Bienvenido");
    applyView("home");
  };

  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
    } catch {
      // Sin acción adicional.
    }

    setUser(null);
    pushToast("Sesión cerrada correctamente.", "info", "Cierre de sesión");
    applyView("auth", "login");
  };

  const handleLogoutRequest = () => {
    pushConfirmToast(
      "¿Deseas cerrar sesión?",
      () => handleLogout(),
      () => pushToast("Se mantuvo la sesión abierta.", "info", "Sesión activa"),
      "Cerrar sesión",
    );
  };

  const openAdmin = (path?: string) => {
    if (!user) {
      setUser(null);
      setAuthMode("login");
      setView("auth");
      window.location.hash = "#login";
      return;
    }

    if (path?.startsWith("/dashboard/")) {
      localStorage.setItem("aserco-dashboard-path", path);
    }

    applyView("admin");
  };

  const openKnowledge = () => {
    applyView("knowledge");
  };

  const openProfile = () => {
    if (!user) {
      setAuthMode("login");
      applyView("auth", "login");
      return;
    }

    setView("admin");
    window.location.hash = "#admin/perfil";
  };

  const openKnowledgeArticle = (slug: string) => {
    applyView("knowledge-article", "login", slug);
  };

  let content: ReactNode;

  if (loading || !authReady) {
    content = <SplashLoader visible={loading || !authReady} />;
  } else if (view === "not-found") {
    content = <NotFoundPage onBackHome={() => applyView("home")} />;
  } else if (!landingReady && view === "home") {
    content = (
      <AppBackground>
        <LandingSkeleton />
      </AppBackground>
    );
  } else if (view === "auth") {
    content = (
      <AuthPage
        mode={authMode}
        onSwitchMode={setAuthMode}
        onBackHome={() => applyView("home")}
        onAuthSuccess={handleAuthSuccess}
        onToast={pushToast}
      />
    );
  } else if (view === "admin") {
    content = (
      <AdminPage
        dark={dark}
        user={user}
        onBackHome={() => applyView("home")}
        onLogout={handleLogout}
        onConfirmLogout={handleLogoutRequest}
        onToggleTheme={() => setDark((value) => !value)}
        onToast={pushToast}
      />
    );
  } else if (view === "knowledge-article") {
    content = (
      <KnowledgeArticlePage
        slug={knowledgeSlug ?? ""}
        onBack={() => applyView("knowledge")}
      />
    );
  } else if (view === "knowledge") {
    content = (
      <AppBackground>
        <KnowledgeHomePage
          dark={dark}
          user={user}
          onToggleTheme={() => setDark((value) => !value)}
          onConfirmLogout={handleLogoutRequest}
          onOpenProfile={openProfile}
          onOpenLogin={() => applyView("auth", "login")}
          onOpenRegister={() => applyView("auth", "register")}
          onOpenAdmin={openAdmin}
          onOpenKnowledge={openKnowledge}
          onOpenArticle={openKnowledgeArticle}
        />
      </AppBackground>
    );
  } else {
    content = (
      <AppBackground>
        <HomePage
          dark={dark}
          user={user}
          onToggleTheme={() => setDark((value) => !value)}
          onConfirmLogout={handleLogoutRequest}
          onOpenProfile={openProfile}
          onOpenLogin={() => applyView("auth", "login")}
          onOpenRegister={() => applyView("auth", "register")}
          onOpenAdmin={openAdmin}
          onOpenKnowledge={openKnowledge}
        />
      </AppBackground>
    );
  }

  return (
    <>
      {content}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

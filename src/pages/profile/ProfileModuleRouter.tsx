import { useEffect, useState } from "react";
import { ProfileHomePage } from "./ProfileHomePage";
import { ProfilePhotoPage } from "./ProfilePhotoPage";
import { ProfilePersonalPage } from "./ProfilePersonalPage";
import { ProfileBusinessPage } from "./ProfileBusinessPage";
import { ProfileCommercialPage } from "./ProfileCommercialPage";
import { ProfileSecurityPage } from "./ProfileSecurityPage";
import { ProfileActivityPage } from "./ProfileActivityPage";

type ProfileRoute = "home" | "photo" | "personal" | "business" | "commercial" | "security" | "activity";

type Props = Readonly<{
  mode: "self" | "admin";
  userId?: number;
  onToast?: (message: string, kind?: "success" | "error" | "info" | "confirm", title?: string) => void;
}>;

const parseProfileRoute = () => {
  const route = window.location.hash.replace(/^#/, "").toLowerCase();
  if (route === "perfil" || route === "profile" || route === "mi-perfil" || route === "admin/perfil") return "home" as ProfileRoute;
  if (route.startsWith("perfil/fotografia") || route.startsWith("profile/photo") || route.startsWith("admin/perfil/fotografia")) return "photo" as ProfileRoute;
  if (route.startsWith("perfil/personal") || route.startsWith("admin/perfil/personal")) return "personal" as ProfileRoute;
  if (route.startsWith("perfil/empresarial") || route.startsWith("admin/perfil/empresarial")) return "business" as ProfileRoute;
  if (route.startsWith("perfil/comercial") || route.startsWith("admin/perfil/comercial")) return "commercial" as ProfileRoute;
  if (route.startsWith("perfil/seguridad") || route.startsWith("admin/perfil/seguridad")) return "security" as ProfileRoute;
  if (route.startsWith("perfil/actividad") || route.startsWith("admin/perfil/actividad")) return "activity" as ProfileRoute;
  return "home" as ProfileRoute;
};

export function ProfileModuleRouter({ mode, userId, onToast }: Props) {
  const [route, setRoute] = useState<ProfileRoute>(() => parseProfileRoute());

  useEffect(() => {
    const sync = () => setRoute(parseProfileRoute());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  if (route === "photo") {
    return <ProfilePhotoPage mode={mode} userId={userId} onToast={onToast} />;
  }

  if (route === "personal") {
    return <ProfilePersonalPage mode={mode} userId={userId} onToast={onToast} />;
  }

  if (route === "business") {
    return <ProfileBusinessPage mode={mode} userId={userId} onToast={onToast} />;
  }

  if (route === "commercial") {
    return <ProfileCommercialPage mode={mode} userId={userId} onToast={onToast} />;
  }

  if (route === "security") {
    return <ProfileSecurityPage mode={mode} userId={userId} onToast={onToast} />;
  }

  if (route === "activity") {
    return <ProfileActivityPage mode={mode} userId={userId} onToast={onToast} />;
  }

  return <ProfileHomePage mode={mode} userId={userId} onToast={onToast} />;
}

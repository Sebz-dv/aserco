import type { LucideIcon } from "lucide-react";
import type { AuthUser } from "../../../lib/api";

export type DashboardSection = "overview" | "users" | "roles" | "knowledge" | "profile";

export type DashboardSidebarProps = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  sidebarOpen: boolean;
  activeSection?: DashboardSection;
  onToggleSidebar: () => void;
  onBackHome: () => void;
  onLogout: () => void;
  onConfirmLogout?: () => void;
  showKnowledge?: boolean;
  showUsersOption?: boolean;
  showRolesOption?: boolean;
  onOpenOverview?: () => void;
  onOpenUsers?: () => void;
  onOpenRoles?: () => void;
  onOpenKnowledge?: () => void;
  onOpenProfile?: () => void;
  onOpenProfileSection?: () => void;
}>;

export type SidebarActionProps = Readonly<{
  icon: LucideIcon;
  label: string;
  sidebarOpen: boolean;
  dark: boolean;
  active?: boolean;
  danger?: boolean;
  nested?: boolean;
  avatarSrc?: string | null;
  avatarAlt?: string;
  onAvatarError?: () => void;
  onClick: () => void;
}>;

export type SidebarSectionHeaderProps = Readonly<{
  icon: LucideIcon;
  label: string;
  sidebarOpen: boolean;
  dark: boolean;
}>;

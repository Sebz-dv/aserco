import { UserProfilePage } from "../UserProfilePage";

type Props = Readonly<{
  mode: "self" | "admin";
  userId?: number;
  onToast?: (message: string, kind?: "success" | "error" | "info" | "confirm", title?: string) => void;
}>;

export function ProfileSecurityPage({ mode, userId, onToast }: Props) {
  return (
    <UserProfilePage
      mode={mode}
      userId={userId}
      forcedTab="security"
      hideTabNavigation
      onToast={onToast}
      onBack={() => {
        window.location.hash = "#perfil";
      }}
    />
  );
}

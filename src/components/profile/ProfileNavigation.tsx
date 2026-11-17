import { Camera, BriefcaseBusiness, Building2, LockKeyhole, ShieldCheck, UserCircle2 } from "lucide-react";
import { ProfileSectionCard } from "./ProfileSectionCard";

type Props = Readonly<{
  onNavigate: (path: string) => void;
}>;

export function ProfileNavigation({ onNavigate }: Props) {
  const items = [
    {
      icon: Camera,
      title: "Fotografía de perfil",
      description: "Sube, cambia o elimina tu fotografía.",
      path: "#perfil/fotografia",
    },
    {
      icon: UserCircle2,
      title: "Información personal",
      description: "Datos básicos, contacto y ubicación.",
      path: "#perfil/personal",
    },
    {
      icon: Building2,
      title: "Información empresarial",
      description: "Empresa asociada y vinculación corporativa.",
      path: "#perfil/empresarial",
    },
    {
      icon: BriefcaseBusiness,
      title: "Información comercial",
      description: "Relación comercial y actividad económica.",
      path: "#perfil/comercial",
    },
    {
      icon: LockKeyhole,
      title: "Seguridad y cuenta",
      description: "Cambio de contraseña y control de acceso.",
      path: "#perfil/seguridad",
    },
    {
      icon: ShieldCheck,
      title: "Actividad de la cuenta",
      description: "Estado, creación y actualización del perfil.",
      path: "#perfil/actividad",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <ProfileSectionCard
          key={item.path}
          icon={item.icon}
          title={item.title}
          description={item.description}
          onClick={() => onNavigate(item.path)}
        />
      ))}
    </div>
  );
}

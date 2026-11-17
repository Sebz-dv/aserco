import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode, SyntheticEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";

import {
  ApiError,
  deleteMyAvatar,
  getAdminUserProfile,
  getMyUserProfile,
  resetAdminUserPassword,
  type CompanyRelationshipType,
  type PasswordUpdatePayload,
  type ProfileUpdatePayload,
  type UserProfile,
  updateAdminUserProfile,
  updateMyPassword,
  updateMyUserProfile,
  uploadMyAvatar,
} from "../lib/api";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type ProfileMode = "self" | "admin";
export type ProfileTab = "personal" | "business" | "commercial" | "security";

type UserProfilePageProps = Readonly<{
  mode: ProfileMode;
  userId?: number;
  forcedTab?: ProfileTab;
  hideTabNavigation?: boolean;
  onBack?: () => void;
  onToast?: (
    message: string,
    kind?: "success" | "error" | "info" | "confirm",
    title?: string,
  ) => void;
}>;

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  mobile: string;
  roleTitle: string;
  department: string;
  city: string;
  country: string;
  contactNotes: string;
  relationshipType: CompanyRelationshipType | "";
  companyName: string;
  companyNit: string;
  companyPosition: string;
  companyDepartment: string;
  companyBusinessPhone: string;
  companyCorporateEmail: string;
  companyAddress: string;
  companyCity: string;
  companyCountry: string;
  companyWebsite: string;
  companyPrimaryContact: string;
  companyNotes: string;
  commercialRelationshipType: string;
  economicSector: string;
  economicActivity: string;
  businessDescription: string;
  commercialNotes: string;
  relevantContactData: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileFieldProps = Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  autoComplete?: string;
}>;

type PasswordFieldProps = Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete: string;
}>;

const RELATIONSHIP_OPTIONS: Array<{
  value: CompanyRelationshipType;
  label: string;
}> = [
  { value: "aserco_internal", label: "Aserco interno" },
  { value: "external_user", label: "Usuario externo" },
  { value: "company_representative", label: "Representante de empresa" },
  { value: "business_client", label: "Cliente empresarial" },
  { value: "commercial_contact", label: "Contacto comercial" },
  { value: "other", label: "Otro" },
];

const PASSWORD_RULES = [
  {
    label: "Mínimo 8 caracteres",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Al menos una mayúscula",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Al menos una minúscula",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "Al menos un número",
    test: (value: string) => /\d/.test(value),
  },
  {
    label: "Al menos un carácter especial",
    test: (value: string) => /[^A-Za-z\d]/.test(value),
  },
];

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const shouldUseLocalSameOriginProxy = () => {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return false;
  }

  const frontendHost = window.location.hostname;
  const isLocalFrontend = frontendHost === "localhost" || frontendHost === "127.0.0.1";

  if (!isLocalFrontend) {
    return false;
  }

  try {
    const backendUrl = new URL(API_ORIGIN);
    const backendHost = backendUrl.hostname;
    const isLocalBackend = backendHost === "localhost" || backendHost === "127.0.0.1";
    return isLocalBackend;
  } catch {
    return false;
  }
};

const EMPTY_PASSWORD_FORM: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const EMPTY_PROFILE_FORM: ProfileFormState = {
  name: "",
  email: "",
  phone: "",
  mobile: "",
  roleTitle: "",
  department: "",
  city: "",
  country: "",
  contactNotes: "",
  relationshipType: "",
  companyName: "",
  companyNit: "",
  companyPosition: "",
  companyDepartment: "",
  companyBusinessPhone: "",
  companyCorporateEmail: "",
  companyAddress: "",
  companyCity: "",
  companyCountry: "",
  companyWebsite: "",
  companyPrimaryContact: "",
  companyNotes: "",
  commercialRelationshipType: "",
  economicSector: "",
  economicActivity: "",
  businessDescription: "",
  commercialNotes: "",
  relevantContactData: "",
};

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const toText = (value: string | null | undefined) => value ?? "";

const toNullable = (value: string) => {
  const normalized = value.trim();
  return normalized.length ? normalized : null;
};

const resolveAssetUrl = (value: string | null | undefined) => {
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
    if (useProxy) {
      return `${window.location.origin}${next}`;
    }

    return `${API_ORIGIN}${next}`;
  }

  if (useProxy) {
    return `${window.location.origin}/${next}`;
  }

  return `${API_ORIGIN}/${next}`;
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase() || "AS";

const formatDate = (value: string | null | undefined) => {
  if (!value) return "No disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No disponible";

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getApiErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Tu sesión expiró. Inicia sesión nuevamente.";
    }

    if (error.status === 403) {
      return "No tienes permisos para realizar esta acción.";
    }

    if (error.status === 400) {
      return error.message || "Verifica los datos ingresados.";
    }

    return error.message || "No se pudo completar la solicitud.";
  }

  if (error instanceof Error) return error.message;

  return "No se pudo completar la solicitud.";
};

const mapProfileToForm = (profile: UserProfile): ProfileFormState => ({
  name: profile.name ?? "",
  email: profile.email ?? "",
  phone: toText(profile.phone),
  mobile: toText(profile.mobile),
  roleTitle: toText(profile.roleTitle),
  department: toText(profile.department),
  city: toText(profile.city),
  country: toText(profile.country),
  contactNotes: toText(profile.contactNotes),

  relationshipType: profile.company?.relationshipType ?? "",
  companyName: toText(profile.company?.companyName),
  companyNit: toText(profile.company?.nit),
  companyPosition: toText(profile.company?.position),
  companyDepartment: toText(profile.company?.department),
  companyBusinessPhone: toText(profile.company?.businessPhone),
  companyCorporateEmail: toText(profile.company?.corporateEmail),
  companyAddress: toText(profile.company?.address),
  companyCity: toText(profile.company?.city),
  companyCountry: toText(profile.company?.country),
  companyWebsite: toText(profile.company?.website),
  companyPrimaryContact: toText(profile.company?.primaryContact),
  companyNotes: toText(profile.company?.notes),

  commercialRelationshipType: toText(profile.commercialRelationshipType),
  economicSector: toText(profile.economicSector),
  economicActivity: toText(profile.economicActivity),
  businessDescription: toText(profile.businessDescription),
  commercialNotes: toText(profile.commercialNotes),
  relevantContactData: toText(profile.relevantContactData),
});

/* -------------------------------------------------------------------------- */
/*                          Payload de actualización                          */
/* -------------------------------------------------------------------------- */

function buildProfileUpdatePayload(
  current: UserProfile,
  form: ProfileFormState,
  unlinkCompany: boolean,
): ProfileUpdatePayload {
  const payload: ProfileUpdatePayload = {};

  if (form.name.trim() && form.name.trim() !== (current.name ?? "")) {
    payload.name = form.name.trim();
  }

  if (form.email.trim() && form.email.trim() !== (current.email ?? "")) {
    payload.email = form.email.trim();
  }

  const compareField = (
    nextValue: string,
    currentValue: string | null | undefined,
    assign: (value: string | null) => void,
  ) => {
    const next = toNullable(nextValue);
    const previous = currentValue ?? null;

    if (next !== previous) assign(next);
  };

  compareField(form.phone, current.phone, (value) => {
    payload.phone = value;
  });

  compareField(form.mobile, current.mobile, (value) => {
    payload.mobile = value;
  });

  compareField(form.roleTitle, current.roleTitle, (value) => {
    payload.roleTitle = value;
  });

  compareField(form.department, current.department, (value) => {
    payload.department = value;
  });

  compareField(form.city, current.city, (value) => {
    payload.city = value;
  });

  compareField(form.country, current.country, (value) => {
    payload.country = value;
  });

  compareField(form.contactNotes, current.contactNotes, (value) => {
    payload.contactNotes = value;
  });

  compareField(
    form.commercialRelationshipType,
    current.commercialRelationshipType,
    (value) => {
      payload.commercialRelationshipType = value;
    },
  );

  compareField(form.economicSector, current.economicSector, (value) => {
    payload.economicSector = value;
  });

  compareField(form.economicActivity, current.economicActivity, (value) => {
    payload.economicActivity = value;
  });

  compareField(
    form.businessDescription,
    current.businessDescription,
    (value) => {
      payload.businessDescription = value;
    },
  );

  compareField(form.commercialNotes, current.commercialNotes, (value) => {
    payload.commercialNotes = value;
  });

  compareField(
    form.relevantContactData,
    current.relevantContactData,
    (value) => {
      payload.relevantContactData = value;
    },
  );

  /*
   * La desvinculación de empresa no debe interrumpir la comparación
   * de los campos personales y comerciales.
   */
  if (unlinkCompany) {
    payload.company = null;
    return payload;
  }

  const currentCompany = current.company ?? null;
  const nextCompany: NonNullable<ProfileUpdatePayload["company"]> = {};

  const nextRelationship = form.relationshipType || null;
  const previousRelationship = currentCompany?.relationshipType ?? null;

  if (nextRelationship !== previousRelationship) {
    nextCompany.relationshipType = nextRelationship;
  }

  const compareCompanyField = (
    nextValue: string,
    currentValue: string | null | undefined,
    assign: (value: string | null) => void,
  ) => {
    const next = toNullable(nextValue);
    const previous = currentValue ?? null;

    if (next !== previous) assign(next);
  };

  compareCompanyField(
    form.companyName,
    currentCompany?.companyName,
    (value) => {
      nextCompany.companyName = value;
    },
  );

  compareCompanyField(form.companyNit, currentCompany?.nit, (value) => {
    nextCompany.nit = value;
  });

  compareCompanyField(
    form.companyPosition,
    currentCompany?.position,
    (value) => {
      nextCompany.position = value;
    },
  );

  compareCompanyField(
    form.companyDepartment,
    currentCompany?.department,
    (value) => {
      nextCompany.department = value;
    },
  );

  compareCompanyField(
    form.companyBusinessPhone,
    currentCompany?.businessPhone,
    (value) => {
      nextCompany.businessPhone = value;
    },
  );

  compareCompanyField(
    form.companyCorporateEmail,
    currentCompany?.corporateEmail,
    (value) => {
      nextCompany.corporateEmail = value;
    },
  );

  compareCompanyField(form.companyAddress, currentCompany?.address, (value) => {
    nextCompany.address = value;
  });

  compareCompanyField(form.companyCity, currentCompany?.city, (value) => {
    nextCompany.city = value;
  });

  compareCompanyField(form.companyCountry, currentCompany?.country, (value) => {
    nextCompany.country = value;
  });

  compareCompanyField(form.companyWebsite, currentCompany?.website, (value) => {
    nextCompany.website = value;
  });

  compareCompanyField(
    form.companyPrimaryContact,
    currentCompany?.primaryContact,
    (value) => {
      nextCompany.primaryContact = value;
    },
  );

  compareCompanyField(form.companyNotes, currentCompany?.notes, (value) => {
    nextCompany.notes = value;
  });

  if (Object.keys(nextCompany).length > 0) {
    payload.company = nextCompany;
  }

  return payload;
}

/* -------------------------------------------------------------------------- */
/*                              Reusable components                           */
/* -------------------------------------------------------------------------- */

function FieldGroup({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3 dark:border-white/[0.07]">
        <h4 className="text-sm font-bold text-[#22264b] dark:text-white">
          {title}
        </h4>

        {description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder,
  autoComplete,
}: ProfileFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue =
      type === "tel"
        ? event.target.value.replace(/\D+/g, "")
        : event.target.value;

    onChange(nextValue);
  };

  return (
    <label className="block min-w-0 space-y-2">
      <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={handleChange}
        inputMode={type === "tel" ? "numeric" : undefined}
        pattern={type === "tel" ? "[0-9]*" : undefined}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-[#22264b] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#3163a2] focus:bg-white focus:ring-4 focus:ring-[#3163a2]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:hover:border-slate-200 dark:border-white/10 dark:bg-[#0b162b] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-[#9dbf14] dark:focus:bg-[#101e36] dark:focus:ring-[#9dbf14]/10 dark:disabled:bg-white/[0.03]"
      />
    </label>
  );
}

function ProfileTextarea({
  label,
  value,
  onChange,
  disabled,
  rows = 4,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  rows?: number;
}>) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-6 text-[#22264b] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#3163a2] focus:bg-white focus:ring-4 focus:ring-[#3163a2]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-white/10 dark:bg-[#0b162b] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-[#9dbf14] dark:focus:bg-[#101e36] dark:focus:ring-[#9dbf14]/10 dark:disabled:bg-white/[0.03]"
      />
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 pr-12 text-sm text-[#22264b] outline-none transition focus:border-[#3163a2] focus:bg-white focus:ring-4 focus:ring-[#3163a2]/10 dark:border-white/10 dark:bg-[#0b162b] dark:text-white dark:focus:border-[#9dbf14] dark:focus:bg-[#101e36] dark:focus:ring-[#9dbf14]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-white/[0.07] dark:bg-white/[0.03]">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#3163a2] shadow-sm dark:bg-white/[0.06] dark:text-[#b5d64b]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-[#22264b] dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main component                               */
/* -------------------------------------------------------------------------- */

export function UserProfilePage({
  mode,
  userId,
  forcedTab,
  hideTabNavigation = false,
  onBack,
  onToast,
}: UserProfilePageProps) {
  const [tab, setTab] = useState<ProfileTab>(forcedTab ?? "personal");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarLowQuality, setAvatarLowQuality] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarCandidateIndex, setAvatarCandidateIndex] = useState(0);
  const avatarCandidates = useMemo(() => {
    if (!profile) return [] as string[];

    const candidates = [
      profile.hasCustomAvatar ? profile.avatarUrl : null,
      profile.defaultAvatarUrl,
    ]
      .map((item) => resolveAssetUrl(item))
      .filter((item): item is string => Boolean(item));

    return [...new Set(candidates)];
  }, [profile]);

  const avatarUrl = avatarCandidates[avatarCandidateIndex] ?? null;

  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(false);
  const [unlinkCompany, setUnlinkCompany] = useState(false);

  const [passwordForm, setPasswordForm] =
    useState<PasswordFormState>(EMPTY_PASSWORD_FORM);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isSelf = mode === "self";

  /* -------------------------------- Loading -------------------------------- */

  const loadProfile = useCallback(async () => {
    if (mode === "admin" && typeof userId !== "number") {
      setLoading(false);
      setLoadError("No se ha especificado un usuario válido.");
      return;
    }

    setLoading(true);
    setLoadError("");

    try {
      const response = isSelf
        ? await getMyUserProfile()
        : await getAdminUserProfile(undefined, userId as number);

      setProfile(response.profile);
      setForm(mapProfileToForm(response.profile));
      setUnlinkCompany(false);
      setEditing(false);
    } catch (error) {
      const message = getApiErrorMessage(error);

      setLoadError(message);
      onToast?.(message, "error", "Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  }, [mode, userId, isSelf, onToast]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (forcedTab) {
      setTab(forcedTab);
    }
  }, [forcedTab]);

  /* -------------------------------- Derived -------------------------------- */

  const accountStatus =
    profile?.accountStatus ?? (profile?.isActive ? "Activa" : "Pendiente");

  const companyFieldsVisible =
    !form.relationshipType || form.relationshipType !== "aserco_internal";

  const passwordRules = useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        ...rule,
        valid: rule.test(passwordForm.newPassword),
      })),
    [passwordForm.newPassword],
  );

  useEffect(() => {
    setAvatarCandidateIndex(0);
  }, [avatarCandidates]);

  useEffect(() => {
    setAvatarLowQuality(false);
  }, [avatarUrl]);

  const passwordIsValid = passwordRules.every((rule) => rule.valid);

  /* -------------------------------- Handlers -------------------------------- */

  const updateForm = (field: keyof ProfileFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetFormToSource = () => {
    if (!profile) return;

    setForm(mapProfileToForm(profile));
    setEditing(false);
    setUnlinkCompany(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    if (!form.name.trim()) {
      onToast?.("El nombre completo es obligatorio.", "error", "Validación");
      setTab("personal");
      return;
    }

    if (!form.email.trim()) {
      onToast?.("El correo electrónico es obligatorio.", "error", "Validación");
      setTab("personal");
      return;
    }

    setSaving(true);

    try {
      const payload = buildProfileUpdatePayload(profile, form, unlinkCompany);

      if (Object.keys(payload).length === 0) {
        onToast?.("No hay cambios para guardar.", "info", "Perfil");
        setEditing(false);
        return;
      }

      const response = isSelf
        ? await updateMyUserProfile(payload)
        : await updateAdminUserProfile(undefined, userId as number, payload);

      setProfile(response.profile);
      setForm(mapProfileToForm(response.profile));
      setEditing(false);
      setUnlinkCompany(false);

      onToast?.("Los cambios se guardaron correctamente.", "success", "Perfil");
    } catch (error) {
      onToast?.(getApiErrorMessage(error), "error", "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Permite seleccionar nuevamente el mismo archivo.
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onToast?.("Selecciona un archivo de imagen válido.", "error", "Avatar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onToast?.("La imagen no puede superar los 5 MB.", "error", "Avatar");
      return;
    }

    setAvatarLoading(true);

    try {
      const response = await uploadMyAvatar(file);

      if (response.profile) {
        setProfile(response.profile);
        setForm(mapProfileToForm(response.profile));
      } else {
        await loadProfile();
      }

      onToast?.(
        "La fotografía se actualizó correctamente.",
        "success",
        "Avatar",
      );
    } catch (error) {
      onToast?.(getApiErrorMessage(error), "error", "Error al subir imagen");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const shortestSide = Math.min(image.naturalWidth || 0, image.naturalHeight || 0);

    // Menos de ~220px en su lado más corto suele pixelarse al mostrarse en 96-112px + pantallas HiDPI.
    setAvatarLowQuality(shortestSide > 0 && shortestSide < 220);
  };

  const handleDeleteAvatar = async () => {
    if (!isSelf || !profile?.hasCustomAvatar) return;

    setAvatarLoading(true);

    try {
      const response = await deleteMyAvatar();

      if (response.profile) {
        setProfile(response.profile);
        setForm(mapProfileToForm(response.profile));
      } else {
        await loadProfile();
      }

      onToast?.(
        "Se restauró la fotografía predeterminada.",
        "success",
        "Avatar",
      );
    } catch (error) {
      onToast?.(getApiErrorMessage(error), "error", "Error al eliminar imagen");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!PASSWORD_REGEX.test(passwordForm.newPassword)) {
      onToast?.(
        "La contraseña no cumple todos los requisitos de seguridad.",
        "error",
        "Contraseña no válida",
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      onToast?.(
        "La confirmación no coincide con la nueva contraseña.",
        "error",
        "Validación",
      );
      return;
    }

    if (isSelf && !passwordForm.currentPassword) {
      onToast?.("Ingresa tu contraseña actual.", "error", "Validación");
      return;
    }

    setPasswordSaving(true);

    try {
      if (isSelf) {
        const payload: PasswordUpdatePayload = {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        };

        await updateMyPassword(payload);
      } else {
        await resetAdminUserPassword(undefined, userId as number, {
          newPassword: passwordForm.newPassword,
        });
      }

      setPasswordForm(EMPTY_PASSWORD_FORM);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      onToast?.(
        isSelf
          ? "Tu contraseña se actualizó correctamente."
          : "La contraseña del usuario fue restablecida.",
        "success",
        "Seguridad",
      );
    } catch (error) {
      onToast?.(getApiErrorMessage(error), "error", "Error de seguridad");
    } finally {
      setPasswordSaving(false);
    }
  };

  /* --------------------------------- States --------------------------------- */

  if (loading) {
    return (
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#edf5c5] dark:bg-[#9dbf14]/15">
            <div className="size-6 animate-spin rounded-full border-2 border-[#9dbf14]/30 border-t-[#3163a2] dark:border-t-[#b5d64b]" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-[#22264b] dark:text-white">
            Cargando información
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Estamos preparando los datos del perfil.
          </p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm dark:border-red-500/20 dark:bg-[#111d35]">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
            <Info size={24} />
          </div>

          <h3 className="mt-5 text-lg font-bold text-[#22264b] dark:text-white">
            No fue posible cargar el perfil
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {loadError || "Ocurrió un error al consultar la información."}
          </p>

          <button
            type="button"
            onClick={() => void loadProfile()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3163a2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#254d83] dark:bg-[#9dbf14] dark:text-[#17200b] dark:hover:bg-[#b5d64b]"
          >
            Reintentar
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  /* ---------------------------------- Tabs ---------------------------------- */

  const tabs: Array<{
    key: ProfileTab;
    label: string;
    description: string;
    icon: typeof UserCircle2;
  }> = [
    {
      key: "personal",
      label: "Personal",
      description: "Datos y contacto",
      icon: UserCircle2,
    },
    {
      key: "business",
      label: "Empresarial",
      description: "Empresa y vinculación",
      icon: Building2,
    },
    {
      key: "commercial",
      label: "Comercial",
      description: "Actividad y negocio",
      icon: BriefcaseBusiness,
    },
    {
      key: "security",
      label: "Seguridad",
      description: "Acceso y contraseña",
      icon: ShieldCheck,
    },
  ];

  const currentTab = tabs.find((item) => item.key === tab)!;

  /* --------------------------------- Render --------------------------------- */

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 pb-8">
      {/* Header del perfil */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111d35]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#3163a2] via-[#9dbf14] to-[#3163a2]" />

        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="relative w-fit shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`Fotografía de ${profile.name}`}
                    onLoad={handleAvatarLoad}
                    onError={() => {
                      setAvatarCandidateIndex((current) =>
                        current + 1 < avatarCandidates.length
                          ? current + 1
                          : current,
                      );
                    }}
                    className={`size-24 rounded-2xl border border-slate-200 shadow-sm sm:size-28 dark:border-white/10 ${
                      avatarLowQuality
                        ? "bg-slate-50 p-1.5 object-contain dark:bg-white/[0.04]"
                        : "object-cover"
                    }`}
                    style={{ imageRendering: "auto" }}
                  />
                ) : (
                  <div className="grid size-24 place-items-center rounded-2xl border border-[#9dbf14]/30 bg-[#edf5c5] text-3xl font-bold text-[#22264b] shadow-sm sm:size-28 dark:border-[#9dbf14]/20 dark:bg-[#9dbf14]/15 dark:text-[#dff090]">
                    {getInitials(profile.name)}
                  </div>
                )}

                {isSelf && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarLoading}
                    aria-label="Cambiar fotografía de perfil"
                    className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-xl border-2 border-white bg-[#3163a2] text-white shadow-md transition hover:bg-[#254d83] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#111d35] dark:bg-[#9dbf14] dark:text-[#17200b] dark:hover:bg-[#b5d64b]"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>

              {/* Datos principales */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-[#edf5c5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#52660c] dark:bg-[#9dbf14]/15 dark:text-[#c7e66b]">
                    {isSelf ? "Mi cuenta" : "Administración de usuario"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {accountStatus}
                  </span>
                </div>

                <h2 className="mt-3 break-words text-2xl font-bold tracking-tight text-[#22264b] sm:text-3xl dark:text-white">
                  {profile.name}
                </h2>

                <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Mail size={15} className="shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </span>

                  {profile.roleTitle && (
                    <span className="inline-flex items-center gap-2">
                      <BriefcaseBusiness size={15} className="shrink-0" />
                      <span>{profile.roleTitle}</span>
                    </span>
                  )}
                </div>

                {profile.city && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={13} />
                    {profile.city}
                    {profile.country ? `, ${profile.country}` : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Indicadores */}
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[390px]">
              <InfoCard
                icon={ShieldCheck}
                label="Estado de cuenta"
                value={accountStatus}
              />
              <InfoCard
                icon={UserCircle2}
                label="Miembro desde"
                value={formatDate(profile.createdAt)}
              />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarUpload}
          />

          {isSelf && (
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 dark:border-white/[0.07]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#22264b] transition hover:border-[#3163a2] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-[#9dbf14]/50 dark:hover:bg-white/[0.06]"
              >
                <Camera size={15} />
                {avatarLoading
                  ? "Procesando fotografía..."
                  : "Cambiar fotografía"}
              </button>

              {profile.hasCustomAvatar && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  disabled={avatarLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                  Restaurar fotografía
                </button>
              )}

              <span className="text-xs text-slate-400">
                PNG, JPG o WEBP. Máximo 5 MB.
              </span>
            </div>
          )}
        </div>
      </div>

      {!hideTabNavigation && (
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-4 dark:border-white/[0.08] dark:bg-[#111d35]">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`group flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition sm:px-4 ${
                  active
                    ? "bg-[#edf5c5] text-[#22264b] shadow-sm dark:bg-[#9dbf14]/15 dark:text-[#dff090]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#22264b] dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg transition ${
                    active
                      ? "bg-white/80 text-[#3163a2] dark:bg-[#9dbf14]/15 dark:text-[#c7e66b]"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-white/[0.05] dark:text-slate-400"
                  }`}
                >
                  <Icon size={17} />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold sm:text-sm">
                    {item.label}
                  </span>
                  <span className="mt-0.5 hidden truncate text-[10px] opacity-70 sm:block">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Contenido */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111d35]">
        <div className="p-5 sm:p-7 lg:p-8">
          {/* Encabezado de sección y acciones */}
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between dark:border-white/[0.07]">
            <div>
              <div className="flex items-center gap-2 text-[#3163a2] dark:text-[#b5d64b]">
                <currentTab.icon size={17} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {currentTab.label}
                </span>
              </div>

              <h3 className="mt-2 text-xl font-bold tracking-tight text-[#22264b] sm:text-2xl dark:text-white">
                {tab === "personal" && "Información personal"}
                {tab === "business" && "Información empresarial"}
                {tab === "commercial" && "Información comercial"}
                {tab === "security" && "Seguridad de la cuenta"}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {tab === "personal" &&
                  "Administra tus datos personales y la información de contacto asociada a tu cuenta."}
                {tab === "business" &&
                  "Configura la relación con tu empresa y mantén actualizada la información corporativa."}
                {tab === "commercial" &&
                  "Registra información relacionada con la actividad económica y el contexto comercial."}
                {tab === "security" &&
                  "Mantén protegida tu cuenta mediante una contraseña segura y actualizada."}
              </p>
            </div>

            {tab !== "security" && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3163a2] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#254d83] focus:outline-none focus:ring-4 focus:ring-[#3163a2]/15 dark:bg-[#9dbf14] dark:text-[#17200b] dark:hover:bg-[#b5d64b]"
                  >
                    <Pencil size={15} />
                    Editar información
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={resetFormToSource}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                    >
                      <X size={15} />
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 py-3 text-xs font-bold text-[#22264b] shadow-sm transition hover:bg-[#b5d64b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <span className="size-4 animate-spin rounded-full border-2 border-[#22264b]/30 border-t-[#22264b]" />
                      ) : (
                        <Save size={15} />
                      )}
                      {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Personal */}
          {tab === "personal" && (
            <div className="space-y-8">
              <FieldGroup
                title="Datos básicos"
                description="Información principal asociada a tu identidad."
              >
                <ProfileInput
                  label="Nombre completo"
                  value={form.name}
                  onChange={(value) => updateForm("name", value)}
                  disabled={!editing}
                  placeholder="Nombre y apellidos"
                  autoComplete="name"
                />

                <ProfileInput
                  label="Correo electrónico"
                  type="email"
                  value={form.email}
                  onChange={(value) => updateForm("email", value)}
                  disabled={!editing}
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                />
              </FieldGroup>

              <FieldGroup
                title="Información de contacto"
                description="Canales para comunicarse contigo."
              >
                <ProfileInput
                  label="Teléfono"
                  type="tel"
                  value={form.phone}
                  onChange={(value) => updateForm("phone", value)}
                  disabled={!editing}
                  placeholder="Teléfono fijo"
                  autoComplete="tel"
                />

                <ProfileInput
                  label="Celular"
                  type="tel"
                  value={form.mobile}
                  onChange={(value) => updateForm("mobile", value)}
                  disabled={!editing}
                  placeholder="Número celular"
                  autoComplete="tel"
                />
              </FieldGroup>

              <FieldGroup
                title="Información profesional"
                description="Datos relacionados con tu cargo y ubicación."
              >
                <ProfileInput
                  label="Cargo"
                  value={form.roleTitle}
                  onChange={(value) => updateForm("roleTitle", value)}
                  disabled={!editing}
                  placeholder="Cargo actual"
                />

                <ProfileInput
                  label="Área o departamento"
                  value={form.department}
                  onChange={(value) => updateForm("department", value)}
                  disabled={!editing}
                  placeholder="Ej. Finanzas, Comercial..."
                />

                <ProfileInput
                  label="Ciudad"
                  value={form.city}
                  onChange={(value) => updateForm("city", value)}
                  disabled={!editing}
                  placeholder="Ciudad"
                  autoComplete="address-level2"
                />

                <ProfileInput
                  label="País"
                  value={form.country}
                  onChange={(value) => updateForm("country", value)}
                  disabled={!editing}
                  placeholder="País"
                  autoComplete="country-name"
                />
              </FieldGroup>

              <div className="border-t border-slate-100 pt-6 dark:border-white/[0.07]">
                <ProfileTextarea
                  label="Información adicional de contacto"
                  value={form.contactNotes}
                  onChange={(value) => updateForm("contactNotes", value)}
                  disabled={!editing}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Empresarial */}
          {tab === "business" && (
            <div className="space-y-7">
              <div className="rounded-2xl border border-[#3163a2]/15 bg-[#f5f8fc] p-4 dark:border-[#3163a2]/20 dark:bg-[#3163a2]/[0.08]">
                <div className="flex gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#3163a2] dark:bg-white/[0.06] dark:text-[#b5d64b]">
                    <Building2 size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#22264b] dark:text-white">
                      Vinculación empresarial
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Define cómo se relaciona este usuario con una empresa. Los
                      campos corporativos se muestran según el tipo de
                      vinculación seleccionado.
                    </p>
                  </div>
                </div>
              </div>

              <label className="block max-w-xl space-y-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Tipo de vinculación
                </span>

                <select
                  value={form.relationshipType}
                  disabled={!editing}
                  onChange={(event) => {
                    updateForm(
                      "relationshipType",
                      event.target.value as CompanyRelationshipType | "",
                    );
                    setUnlinkCompany(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-[#22264b] outline-none transition focus:border-[#3163a2] focus:bg-white focus:ring-4 focus:ring-[#3163a2]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-white/10 dark:bg-[#0b162b] dark:text-white dark:focus:border-[#9dbf14] dark:disabled:bg-white/[0.03]"
                >
                  <option value="">Selecciona un tipo de vinculación</option>

                  {RELATIONSHIP_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              {editing && (
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-6 dark:border-white/[0.07]">
                  <button
                    type="button"
                    onClick={() => {
                      setUnlinkCompany(true);

                      setForm((current) => ({
                        ...current,
                        companyName: "",
                        companyNit: "",
                        companyPosition: "",
                        companyDepartment: "",
                        companyBusinessPhone: "",
                        companyCorporateEmail: "",
                        companyAddress: "",
                        companyCity: "",
                        companyCountry: "",
                        companyWebsite: "",
                        companyPrimaryContact: "",
                        companyNotes: "",
                      }));
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                    Desvincular empresa
                  </button>

                  {unlinkCompany && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-300">
                      La desvinculación se aplicará al guardar los cambios.
                    </span>
                  )}
                </div>
              )}

              {unlinkCompany ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/[0.07]">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                    Empresa pendiente de desvinculación
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-300">
                    Los datos de la empresa se eliminarán de la vinculación
                    cuando guardes los cambios.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setUnlinkCompany(false);
                      if (profile.company) {
                        setForm(mapProfileToForm(profile));
                      }
                    }}
                    className="mt-3 text-xs font-bold text-amber-800 underline underline-offset-4 dark:text-amber-200"
                  >
                    Deshacer desvinculación
                  </button>
                </div>
              ) : companyFieldsVisible ? (
                <div className="space-y-8">
                  <FieldGroup
                    title="Identificación de la empresa"
                    description="Información general de la organización."
                  >
                    <ProfileInput
                      label="Nombre de la empresa"
                      value={form.companyName}
                      onChange={(value) => updateForm("companyName", value)}
                      disabled={!editing}
                      placeholder="Razón social"
                    />

                    <ProfileInput
                      label="NIT"
                      value={form.companyNit}
                      onChange={(value) => updateForm("companyNit", value)}
                      disabled={!editing}
                      placeholder="Número de identificación"
                    />

                    <ProfileInput
                      label="Cargo dentro de la empresa"
                      value={form.companyPosition}
                      onChange={(value) => updateForm("companyPosition", value)}
                      disabled={!editing}
                      placeholder="Cargo o función"
                    />

                    <ProfileInput
                      label="Área o departamento"
                      value={form.companyDepartment}
                      onChange={(value) =>
                        updateForm("companyDepartment", value)
                      }
                      disabled={!editing}
                      placeholder="Área empresarial"
                    />
                  </FieldGroup>

                  <FieldGroup
                    title="Contacto corporativo"
                    description="Datos de comunicación de la organización."
                  >
                    <ProfileInput
                      label="Teléfono empresarial"
                      type="tel"
                      value={form.companyBusinessPhone}
                      onChange={(value) =>
                        updateForm("companyBusinessPhone", value)
                      }
                      disabled={!editing}
                      placeholder="Teléfono de la empresa"
                    />

                    <ProfileInput
                      label="Correo corporativo"
                      type="email"
                      value={form.companyCorporateEmail}
                      onChange={(value) =>
                        updateForm("companyCorporateEmail", value)
                      }
                      disabled={!editing}
                      placeholder="contacto@empresa.com"
                    />

                    <ProfileInput
                      label="Contacto principal"
                      value={form.companyPrimaryContact}
                      onChange={(value) =>
                        updateForm("companyPrimaryContact", value)
                      }
                      disabled={!editing}
                      placeholder="Nombre del contacto"
                    />

                    <ProfileInput
                      label="Página web"
                      type="url"
                      value={form.companyWebsite}
                      onChange={(value) => updateForm("companyWebsite", value)}
                      disabled={!editing}
                      placeholder="https://empresa.com"
                    />
                  </FieldGroup>

                  <FieldGroup
                    title="Ubicación empresarial"
                    description="Dirección y ubicación de la organización."
                  >
                    <ProfileInput
                      label="Dirección"
                      value={form.companyAddress}
                      onChange={(value) => updateForm("companyAddress", value)}
                      disabled={!editing}
                      placeholder="Dirección de la empresa"
                    />

                    <ProfileInput
                      label="Ciudad"
                      value={form.companyCity}
                      onChange={(value) => updateForm("companyCity", value)}
                      disabled={!editing}
                      placeholder="Ciudad"
                    />

                    <ProfileInput
                      label="País"
                      value={form.companyCountry}
                      onChange={(value) => updateForm("companyCountry", value)}
                      disabled={!editing}
                      placeholder="País"
                    />
                  </FieldGroup>

                  <div className="border-t border-slate-100 pt-6 dark:border-white/[0.07]">
                    <ProfileTextarea
                      label="Información adicional de la empresa"
                      value={form.companyNotes}
                      onChange={(value) => updateForm("companyNotes", value)}
                      disabled={!editing}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/[0.07] dark:bg-white/[0.03]">
                  <Building2
                    size={28}
                    className="mx-auto text-slate-400 dark:text-slate-500"
                  />

                  <h4 className="mt-3 text-sm font-bold text-[#22264b] dark:text-white">
                    Vinculación interna
                  </h4>

                  <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Este usuario está registrado como personal interno de
                    Aserco. No necesita información de una empresa externa.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Comercial */}
          {tab === "commercial" && (
            <div className="space-y-8">
              <FieldGroup
                title="Clasificación comercial"
                description="Información para identificar el tipo de relación y actividad económica."
              >
                <ProfileInput
                  label="Tipo de relación comercial"
                  value={form.commercialRelationshipType}
                  onChange={(value) =>
                    updateForm("commercialRelationshipType", value)
                  }
                  disabled={!editing}
                  placeholder="Ej. Cliente, aliado, prospecto..."
                />

                <ProfileInput
                  label="Sector económico"
                  value={form.economicSector}
                  onChange={(value) => updateForm("economicSector", value)}
                  disabled={!editing}
                  placeholder="Ej. Comercio, servicios..."
                />

                <ProfileInput
                  label="Actividad económica"
                  value={form.economicActivity}
                  onChange={(value) => updateForm("economicActivity", value)}
                  disabled={!editing}
                  placeholder="Actividad principal"
                />
              </FieldGroup>

              <FieldGroup
                title="Contexto del negocio"
                description="Describe la actividad y las características relevantes."
              >
                <div className="md:col-span-2">
                  <ProfileTextarea
                    label="Descripción del negocio"
                    value={form.businessDescription}
                    onChange={(value) =>
                      updateForm("businessDescription", value)
                    }
                    disabled={!editing}
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <ProfileTextarea
                    label="Observaciones comerciales"
                    value={form.commercialNotes}
                    onChange={(value) => updateForm("commercialNotes", value)}
                    disabled={!editing}
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <ProfileTextarea
                    label="Datos de contacto relevantes"
                    value={form.relevantContactData}
                    onChange={(value) =>
                      updateForm("relevantContactData", value)
                    }
                    disabled={!editing}
                    rows={3}
                  />
                </div>
              </FieldGroup>
            </div>
          )}

          {/* Seguridad */}
          {tab === "security" && (
            <div className="mx-auto max-w-2xl">
              <div className="mb-7 rounded-2xl border border-[#9dbf14]/25 bg-[#f7fae9] p-5 dark:border-[#9dbf14]/20 dark:bg-[#9dbf14]/[0.07]">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#6b8610] shadow-sm dark:bg-[#9dbf14]/10 dark:text-[#c7e66b]">
                    <LockKeyhole size={19} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#22264b] dark:text-white">
                      Protege tu cuenta
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                      Utiliza una contraseña única y difícil de adivinar. Evita
                      reutilizar contraseñas de otros servicios.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                {isSelf && (
                  <PasswordField
                    label="Contraseña actual"
                    value={passwordForm.currentPassword}
                    onChange={(value) =>
                      setPasswordForm((current) => ({
                        ...current,
                        currentPassword: value,
                      }))
                    }
                    visible={showCurrentPassword}
                    onToggle={() =>
                      setShowCurrentPassword((current) => !current)
                    }
                    autoComplete="current-password"
                  />
                )}

                <PasswordField
                  label="Nueva contraseña"
                  value={passwordForm.newPassword}
                  onChange={(value) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: value,
                    }))
                  }
                  visible={showNewPassword}
                  onToggle={() => setShowNewPassword((current) => !current)}
                  autoComplete="new-password"
                />

                <PasswordField
                  label="Confirmar nueva contraseña"
                  value={passwordForm.confirmPassword}
                  onChange={(value) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: value,
                    }))
                  }
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((current) => !current)}
                  autoComplete="new-password"
                />

                {/* Requisitos dinámicos */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/[0.08] dark:bg-white/[0.025]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-[#22264b] dark:text-white">
                      Requisitos de contraseña
                    </p>

                    <span
                      className={`text-[10px] font-bold ${
                        passwordIsValid
                          ? "text-emerald-600 dark:text-emerald-300"
                          : "text-slate-400"
                      }`}
                    >
                      {passwordRules.filter((rule) => rule.valid).length}/5
                      cumplidos
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`grid size-5 shrink-0 place-items-center rounded-full ${
                            rule.valid
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500"
                          }`}
                        >
                          {rule.valid ? <Check size={12} /> : <X size={11} />}
                        </span>

                        <span
                          className={
                            rule.valid
                              ? "font-medium text-emerald-700 dark:text-emerald-300"
                              : "text-slate-500 dark:text-slate-400"
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {passwordForm.confirmPassword.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-xs dark:border-white/[0.07]">
                      {passwordForm.newPassword ===
                      passwordForm.confirmPassword ? (
                        <>
                          <CheckCircle2
                            size={15}
                            className="text-emerald-500"
                          />
                          <span className="text-emerald-600 dark:text-emerald-300">
                            Las contraseñas coinciden.
                          </span>
                        </>
                      ) : (
                        <>
                          <Info size={15} className="text-amber-500" />
                          <span className="text-amber-600 dark:text-amber-300">
                            Las contraseñas no coinciden.
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.07]">
                  <p className="text-xs leading-5 text-slate-400">
                    {isSelf
                      ? "Al actualizarla, utiliza la nueva contraseña en tu próximo inicio de sesión."
                      : "El usuario deberá utilizar la nueva contraseña en su próximo inicio de sesión."}
                  </p>

                  <button
                    type="submit"
                    disabled={
                      passwordSaving ||
                      !passwordIsValid ||
                      passwordForm.newPassword !==
                        passwordForm.confirmPassword ||
                      (isSelf && !passwordForm.currentPassword)
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3163a2] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#254d83] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#9dbf14] dark:text-[#17200b] dark:hover:bg-[#b5d64b]"
                  >
                    {passwordSaving ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-[#17200b]/30 dark:border-t-[#17200b]" />
                    ) : (
                      <ShieldCheck size={16} />
                    )}

                    {passwordSaving
                      ? "Actualizando..."
                      : isSelf
                        ? "Actualizar contraseña"
                        : "Restablecer contraseña"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Acciones inferiores */}
      {onBack && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#3163a2] hover:text-[#3163a2] dark:border-white/10 dark:bg-[#111d35] dark:text-slate-300 dark:hover:border-[#9dbf14] dark:hover:text-[#b5d64b]"
          >
            <ArrowLeft size={15} />
            Volver
          </button>
        </div>
      )}
    </section>
  );
}

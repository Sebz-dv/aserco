import { useEffect, useState } from "react";
import {
  createKnowledgeArticle,
  createKnowledgeCall,
  createKnowledgeCategory,
  createKnowledgeEvent,
  createKnowledgeMedia,
  createKnowledgeResource,
  deleteKnowledgeArticle,
  deleteKnowledgeCall,
  deleteKnowledgeCategory,
  deleteKnowledgeEvent,
  deleteKnowledgeMedia,
  deleteKnowledgeResource,
  getKnowledgeArticles,
  getKnowledgeCalls,
  getKnowledgeCategories,
  getKnowledgeDashboard,
  getKnowledgeEvents,
  getKnowledgeMedia,
  getKnowledgeResources,
  updateKnowledgeArticle,
  updateKnowledgeCall,
  updateKnowledgeCategory,
  updateKnowledgeEvent,
  updateKnowledgeMedia,
  updateKnowledgeResource,
  type KnowledgeArticleRecord,
  type KnowledgeCallRecord,
  type KnowledgeCategoryRecord,
  type KnowledgeEventRecord,
  type KnowledgeMediaRecord,
  type KnowledgeResourceRecord,
} from "../lib/api";
import {
  BookOpen,
  FolderOpen,
  CalendarDays,
  Megaphone,
  FileText,
  Image,
  Pencil,
  Plus,
  Trash2,
  X,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
type Props = {
  onBackHome: () => void;
  onBackKnowledge: () => void;
};

type ContentTab =
  | "articles"
  | "categories"
  | "events"
  | "calls"
  | "resources"
  | "media";

const EMPTY_ARTICLE_FORM = {
  title: "",
  subtitle: "",
  excerpt: "",
  content: "",
  categoryId: "",
  coverImageUrl: "",
  status: "draft",
};

const EMPTY_CATEGORY_FORM = {
  name: "",
  description: "",
  color: "#3163a2",
  imageUrl: "",
};

const EMPTY_EVENT_FORM = {
  title: "",
  summary: "",
  description: "",
  eventDate: "",
  location: "",
  isVirtual: "false",
  status: "upcoming",
  coverImageUrl: "",
};

const EMPTY_CALL_FORM = {
  title: "",
  summary: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "active",
  organization: "",
};

const EMPTY_RESOURCE_FORM = {
  title: "",
  summary: "",
  type: "guide",
  fileUrl: "",
  externalUrl: "",
  status: "active",
};

const EMPTY_MEDIA_FORM = {
  title: "",
  type: "image",
  url: "",
  thumbnail: "",
  description: "",
};

export function KnowledgeAdminPage(_: Props) {
  const [stats, setStats] = useState([
    { label: "Artículos publicados", value: "0" },
    { label: "Artículos borrador", value: "0" },
    { label: "Eventos activos", value: "0" },
    { label: "Llamadas activas", value: "0" },
  ]);
  const [activeTab, setActiveTab] = useState<ContentTab>("articles");
  const [articles, setArticles] = useState<KnowledgeArticleRecord[]>([]);
  const [categories, setCategories] = useState<KnowledgeCategoryRecord[]>([]);
  const [events, setEvents] = useState<KnowledgeEventRecord[]>([]);
  const [calls, setCalls] = useState<KnowledgeCallRecord[]>([]);
  const [resources, setResources] = useState<KnowledgeResourceRecord[]>([]);
  const [media, setMedia] = useState<KnowledgeMediaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingCallId, setEditingCallId] = useState<number | null>(null);
  const [editingResourceId, setEditingResourceId] = useState<number | null>(
    null,
  );
  const [editingMediaId, setEditingMediaId] = useState<number | null>(null);
  const [articleForm, setArticleForm] = useState(EMPTY_ARTICLE_FORM);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [callForm, setCallForm] = useState(EMPTY_CALL_FORM);
  const [resourceForm, setResourceForm] = useState(EMPTY_RESOURCE_FORM);
  const [mediaForm, setMediaForm] = useState(EMPTY_MEDIA_FORM);

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setArticleForm(EMPTY_ARTICLE_FORM);
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
  };

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventForm(EMPTY_EVENT_FORM);
  };

  const resetCallForm = () => {
    setEditingCallId(null);
    setCallForm(EMPTY_CALL_FORM);
  };

  const resetResourceForm = () => {
    setEditingResourceId(null);
    setResourceForm(EMPTY_RESOURCE_FORM);
  };

  const resetMediaForm = () => {
    setEditingMediaId(null);
    setMediaForm(EMPTY_MEDIA_FORM);
  };

  const loadDashboard = async () => {
    try {
      const [
        summary,
        recentArticles,
        categoryList,
        eventList,
        callList,
        resourceList,
        mediaList,
      ] = await Promise.all([
        getKnowledgeDashboard(),
        getKnowledgeArticles({ limit: 20 }),
        getKnowledgeCategories(),
        getKnowledgeEvents(),
        getKnowledgeCalls(),
        getKnowledgeResources(),
        getKnowledgeMedia(),
      ]);

      setStats([
        {
          label: "Artículos publicados",
          value: String(summary.publishedArticles),
        },
        { label: "Artículos borrador", value: String(summary.draftArticles) },
        { label: "Eventos activos", value: String(summary.totalEvents) },
        { label: "Llamadas activas", value: String(summary.totalCalls) },
      ]);
      setArticles(recentArticles);
      setCategories(categoryList);
      setEvents(eventList);
      setCalls(callList);
      setResources(resourceList);
      setMedia(mediaList);
    } catch {
      setArticles([]);
      setCategories([]);
      setEvents([]);
      setCalls([]);
      setResources([]);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const handleArticleInput = (
    field: keyof typeof EMPTY_ARTICLE_FORM,
    value: string,
  ) => {
    setArticleForm((current) => ({ ...current, [field]: value }));
  };

  const handleCategoryInput = (
    field: keyof typeof EMPTY_CATEGORY_FORM,
    value: string,
  ) => {
    setCategoryForm((current) => ({ ...current, [field]: value }));
  };

  const handleEventInput = (
    field: keyof typeof EMPTY_EVENT_FORM,
    value: string,
  ) => {
    setEventForm((current) => ({ ...current, [field]: value }));
  };

  const handleCallInput = (
    field: keyof typeof EMPTY_CALL_FORM,
    value: string,
  ) => {
    setCallForm((current) => ({ ...current, [field]: value }));
  };

  const handleResourceInput = (
    field: keyof typeof EMPTY_RESOURCE_FORM,
    value: string,
  ) => {
    setResourceForm((current) => ({ ...current, [field]: value }));
  };

  const handleMediaInput = (
    field: keyof typeof EMPTY_MEDIA_FORM,
    value: string,
  ) => {
    setMediaForm((current) => ({ ...current, [field]: value }));
  };

  const uploadKnowledgeFile = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      window.alert("Solo puedes subir imágenes o videos.");
      return "";
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/knowledge/admin/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "No se pudo subir el archivo.");
      }

      return typeof data?.url === "string" ? data.url : "";
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "No se pudo subir el archivo.",
      );
      return "";
    }
  };

  const handleArticleFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadKnowledgeFile(file);
    if (!uploadedUrl) {
      event.target.value = "";
      return;
    }

    setArticleForm((current) => ({ ...current, coverImageUrl: uploadedUrl }));
    event.target.value = "";
  };

  const handleCategoryFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadKnowledgeFile(file);
    if (!uploadedUrl) {
      event.target.value = "";
      return;
    }

    setCategoryForm((current) => ({ ...current, imageUrl: uploadedUrl }));
    event.target.value = "";
  };

  const handleEventFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadKnowledgeFile(file);
    if (!uploadedUrl) {
      event.target.value = "";
      return;
    }

    setEventForm((current) => ({ ...current, coverImageUrl: uploadedUrl }));
    event.target.value = "";
  };

  const handleResourceFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadKnowledgeFile(file);
    if (!uploadedUrl) {
      event.target.value = "";
      return;
    }

    setResourceForm((current) => ({ ...current, fileUrl: uploadedUrl }));
    event.target.value = "";
  };

  const handleMediaFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadKnowledgeFile(file);
    if (!uploadedUrl) {
      event.target.value = "";
      return;
    }

    setMediaForm((current) => ({ ...current, url: uploadedUrl }));
    event.target.value = "";
  };

  const handleEditArticle = (article: KnowledgeArticleRecord) => {
    setActiveTab("articles");
    setEditingArticleId(article.id);
    setArticleForm({
      title: article.title ?? "",
      subtitle: article.subtitle ?? "",
      excerpt: article.excerpt ?? "",
      content: article.content ?? "",
      categoryId: article.category_id ? String(article.category_id) : "",
      coverImageUrl: article.cover_image_url ?? "",
      status: article.status ?? "draft",
    });
  };

  const handleDeleteArticle = async (article: KnowledgeArticleRecord) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar el artículo "${article.title}"?`,
    );
    if (!confirmed) return;

    try {
      await deleteKnowledgeArticle(undefined, article.id);
      if (editingArticleId === article.id) {
        resetArticleForm();
      }
      await loadDashboard();
    } catch {
      window.alert("No se pudo eliminar el artículo seleccionado.");
    }
  };

  const handleSaveArticle = async () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) return;

    if (categories.length === 0) {
      window.alert("Debes crear al menos una categoría antes de crear un artículo.");
      return;
    }

    if (!articleForm.categoryId) {
      window.alert("Selecciona una categoría para el artículo.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: articleForm.title.trim(),
        subtitle: articleForm.subtitle.trim() || undefined,
        excerpt: articleForm.excerpt.trim() || undefined,
        content: articleForm.content.trim(),
        categoryId: Number(articleForm.categoryId),
        coverImageUrl: articleForm.coverImageUrl.trim() || undefined,
        status: articleForm.status,
        authorName: "Super Admin",
      };

      if (editingArticleId !== null) {
        await updateKnowledgeArticle(undefined, editingArticleId, payload);
      } else {
        await createKnowledgeArticle(undefined, payload);
      }

      resetArticleForm();
      await loadDashboard();
    } catch {
      window.alert(
        "No se pudo guardar el artículo. Revisa los datos e intenta nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) return;

    setSubmitting(true);

    try {
      const payload = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
        color: categoryForm.color || "#3163a2",
        imageUrl: categoryForm.imageUrl.trim() || undefined,
      };

      if (editingCategoryId !== null) {
        await updateKnowledgeCategory(undefined, editingCategoryId, payload);
      } else {
        await createKnowledgeCategory(undefined, payload);
      }

      resetCategoryForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo guardar la categoría seleccionada.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: KnowledgeCategoryRecord) => {
    if (!window.confirm(`¿Deseas eliminar la categoría "${category.name}"?`))
      return;

    try {
      await deleteKnowledgeCategory(undefined, category.id);
      if (editingCategoryId === category.id) resetCategoryForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo eliminar la categoría.");
    }
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim()) return;

    setSubmitting(true);

    try {
      const payload = {
        title: eventForm.title.trim(),
        summary: eventForm.summary.trim() || undefined,
        description: eventForm.description.trim() || undefined,
        eventDate: eventForm.eventDate || undefined,
        location: eventForm.location.trim() || undefined,
        isVirtual: eventForm.isVirtual === "true",
        status: eventForm.status,
        coverImageUrl: eventForm.coverImageUrl.trim() || undefined,
      };

      if (editingEventId !== null) {
        await updateKnowledgeEvent(undefined, editingEventId, payload);
      } else {
        await createKnowledgeEvent(undefined, payload);
      }

      resetEventForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo guardar el evento.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (event: KnowledgeEventRecord) => {
    if (!window.confirm(`¿Deseas eliminar el evento "${event.title}"?`)) return;

    try {
      await deleteKnowledgeEvent(undefined, event.id);
      if (editingEventId === event.id) resetEventForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo eliminar el evento.");
    }
  };

  const handleSaveCall = async () => {
    if (!callForm.title.trim()) return;

    setSubmitting(true);

    try {
      const payload = {
        title: callForm.title.trim(),
        summary: callForm.summary.trim() || undefined,
        description: callForm.description.trim() || undefined,
        startDate: callForm.startDate || undefined,
        endDate: callForm.endDate || undefined,
        status: callForm.status,
        organization: callForm.organization.trim() || undefined,
      };

      if (editingCallId !== null) {
        await updateKnowledgeCall(undefined, editingCallId, payload);
      } else {
        await createKnowledgeCall(undefined, payload);
      }

      resetCallForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo guardar la convocatoria.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCall = async (call: KnowledgeCallRecord) => {
    if (!window.confirm(`¿Deseas eliminar la convocatoria "${call.title}"?`))
      return;

    try {
      await deleteKnowledgeCall(undefined, call.id);
      if (editingCallId === call.id) resetCallForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo eliminar la convocatoria.");
    }
  };

  const handleSaveResource = async () => {
    if (!resourceForm.title.trim()) return;

    setSubmitting(true);

    try {
      const payload = {
        title: resourceForm.title.trim(),
        summary: resourceForm.summary.trim() || undefined,
        type: resourceForm.type,
        fileUrl: resourceForm.fileUrl.trim() || undefined,
        externalUrl: resourceForm.externalUrl.trim() || undefined,
        status: resourceForm.status,
      };

      if (editingResourceId !== null) {
        await updateKnowledgeResource(undefined, editingResourceId, payload);
      } else {
        await createKnowledgeResource(undefined, payload);
      }

      resetResourceForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo guardar el recurso.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (resource: KnowledgeResourceRecord) => {
    if (!window.confirm(`¿Deseas eliminar el recurso "${resource.title}"?`))
      return;

    try {
      await deleteKnowledgeResource(undefined, resource.id);
      if (editingResourceId === resource.id) resetResourceForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo eliminar el recurso.");
    }
  };

  const handleSaveMedia = async () => {
    if (!mediaForm.title.trim()) return;

    setSubmitting(true);

    try {
      const payload = {
        title: mediaForm.title.trim(),
        type: mediaForm.type,
        url: mediaForm.url.trim() || undefined,
        thumbnail: mediaForm.thumbnail.trim() || undefined,
        description: mediaForm.description.trim() || undefined,
      };

      if (editingMediaId !== null) {
        await updateKnowledgeMedia(undefined, editingMediaId, payload);
      } else {
        await createKnowledgeMedia(undefined, payload);
      }

      resetMediaForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo guardar la media.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMedia = async (item: KnowledgeMediaRecord) => {
    if (!window.confirm(`¿Deseas eliminar "${item.title}"?`)) return;

    try {
      await deleteKnowledgeMedia(undefined, item.id);
      if (editingMediaId === item.id) resetMediaForm();
      await loadDashboard();
    } catch {
      window.alert("No se pudo eliminar la media.");
    }
  };

  const tabs: { key: ContentTab; label: string }[] = [
      { key: "categories", label: "Categorías" },
    { key: "articles", label: "Artículos" },
    { key: "events", label: "Eventos" },
    { key: "calls", label: "Convocatorias" },
    { key: "resources", label: "Recursos" },
    { key: "media", label: "Multimedia" },
  ];

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#f5f7f2] p-4 text-[#1c2440] transition-colors duration-300 dark:bg-[#080f1c] dark:text-white sm:p-6 lg:p-8">
      {/* Fondo decorativo global */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full border border-[#9dbf14]/15" />
        <div className="absolute -left-24 -top-24 h-[300px] w-[300px] rounded-full border border-[#9dbf14]/20" />
        <div className="absolute -left-12 top-[25%] h-20 w-20 rounded-full bg-[#9dbf14]/10 blur-3xl" />

        <div className="absolute right-[-180px] top-[10%] h-[500px] w-[500px] rounded-full border border-[#22264b]/10 dark:border-white/10" />
        <div className="absolute right-[-100px] top-[15%] h-[340px] w-[340px] rounded-full border border-[#9dbf14]/20" />
        <div className="absolute right-[8%] top-[28%] h-16 w-16 rounded-full bg-[#9dbf14]/10 blur-2xl" />

        <div className="absolute -left-40 top-[48%] h-[460px] w-[460px] rounded-full border border-[#22264b]/10 dark:border-white/10" />
        <div className="absolute -left-20 top-[53%] h-[300px] w-[300px] rounded-full border border-[#9dbf14]/20" />
        <div className="absolute left-[15%] top-[70%] h-12 w-12 rounded-full border border-[#9dbf14]/20" />

        <div className="absolute right-[-160px] top-[55%] h-[460px] w-[460px] rounded-full border border-[#9dbf14]/15" />
        <div className="absolute right-[-90px] top-[60%] h-[300px] w-[300px] rounded-full border border-[#22264b]/10 dark:border-white/10" />

        <div className="absolute bottom-[-200px] left-[25%] h-[500px] w-[500px] rounded-full border border-[#9dbf14]/15" />
        <div className="absolute bottom-[-120px] left-[30%] h-[340px] w-[340px] rounded-full border border-[#22264b]/10 dark:border-white/10" />
        <div className="absolute bottom-10 right-[12%] h-24 w-24 rounded-full bg-[#9dbf14]/10 blur-3xl" />

        <div className="absolute left-[45%] top-[20%] h-3 w-3 rounded-full bg-[#9dbf14]/30" />
        <div className="absolute left-[65%] top-[42%] h-5 w-5 rounded-full border border-[#9dbf14]/25" />
        <div className="absolute left-[55%] top-[82%] h-4 w-4 rounded-full bg-[#22264b]/10 dark:bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Encabezado */}
        <header className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(29,53,87,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111d30]/90 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-[#9dbf14]/15" />
          <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-[#9dbf14]/15" />
          <div className="pointer-events-none absolute right-24 top-12 h-20 w-20 rounded-full bg-[#9dbf14]/10 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#9dbf14]/30 bg-[#9dbf14]/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9dbf14]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#526d08] dark:text-[#c9e77a]">
                  Panel de administración
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#22264b] dark:text-white sm:text-3xl lg:text-4xl">
                Aserco Conocimiento
                <span className="block text-[#79990b]">Empresarial</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Gestiona y organiza el contenido de tu centro de conocimiento.
                Administra artículos, categorías, eventos y recursos desde un
                solo lugar.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-100 bg-[#f8faf6] p-4 dark:border-white/10 dark:bg-white/5 md:self-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22264b] text-[#dff090] shadow-lg shadow-[#22264b]/15">
                <LayoutDashboard size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Espacio editorial
                </p>
                <p className="mt-1 text-sm font-bold text-[#22264b] dark:text-white">
                  Administración
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#79990b]">
                  Aserco Smart Finance
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Estadísticas */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const icons = [BookOpen, FolderOpen, CalendarDays, FileText];
            const Icon = icons[index % icons.length];

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_40px_rgba(29,53,87,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(29,53,87,0.10)] dark:border-white/10 dark:bg-[#111d30]/90"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#9dbf14]/15 transition-transform duration-500 group-hover:scale-125" />
                <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full border border-[#9dbf14]/10" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-4 text-3xl font-bold tracking-tight text-[#22264b] dark:text-white">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf5c5] text-[#526d08] transition-transform duration-300 group-hover:rotate-6 dark:bg-[#9dbf14]/15 dark:text-[#c9e77a]">
                    <Icon size={20} />
                  </div>
                </div>

                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full w-1/3 rounded-full bg-[#9dbf14] transition-all duration-500 group-hover:w-2/3" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Administración de contenido */}
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-4 shadow-[0_20px_60px_rgba(29,53,87,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111d30]/90 sm:p-6">
          {/* Navegación */}
          <div className="mb-6 border-b border-slate-100 pb-4 dark:border-white/10">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-[#22264b] text-white shadow-lg shadow-[#22264b]/15 dark:bg-[#9dbf14] dark:text-[#1c2440]"
                      : "border border-transparent text-slate-500 hover:bg-slate-100 hover:text-[#22264b] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-[20px] bg-slate-100 dark:bg-white/5"
                />
              ))}
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Listados */}
              <section className="min-w-0 space-y-4">
                {/* ARTÍCULOS */}
                {activeTab === "articles" && (
                  <>
                    {articles.length ? (
                      articles.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-[20px] border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-[#9dbf14]/40 hover:shadow-[0_12px_35px_rgba(29,53,87,0.07)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-[#9dbf14]/30"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <BookOpen
                                  size={14}
                                  className="text-[#79990b]"
                                />
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3163a2] dark:text-[#a8c75d]">
                                  {item.category_name ?? "Artículo"}
                                </p>
                              </div>

                              <h3 className="text-lg font-bold text-[#22264b] transition-colors group-hover:text-[#79990b] dark:text-white">
                                {item.title}
                              </h3>

                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                {item.excerpt || "Sin resumen"}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-[#edf5c5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#526d08] dark:bg-[#9dbf14]/15 dark:text-[#c9e77a]">
                              {item.status ?? "published"}
                            </span>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
                            <span className="text-xs text-slate-400">
                              Contenido editorial
                            </span>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditArticle(item)}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#22264b] transition-colors hover:border-[#9dbf14] hover:bg-[#9dbf14]/10 dark:border-white/10 dark:text-slate-200 dark:hover:bg-[#9dbf14]/10"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteArticle(item)}
                                className="inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-400 dark:hover:bg-rose-400/10"
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                        <BookOpen
                          className="mx-auto mb-3 text-slate-400"
                          size={28}
                        />
                        <p className="font-semibold text-[#22264b] dark:text-white">
                          No hay artículos creados
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Crea tu primer artículo utilizando el formulario.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* CATEGORÍAS */}
                {activeTab === "categories" && (
                  <>
                    {categories.length ? (
                      categories.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-[20px] border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-[#9dbf14]/40 hover:shadow-[0_12px_35px_rgba(29,53,87,0.07)] dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-4">
                              <span
                                className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 shadow-inner dark:border-white/10"
                                style={{
                                  backgroundColor: item.color || "#3163a2",
                                }}
                              />

                              <div className="min-w-0">
                                <p className="font-bold text-[#22264b] dark:text-white">
                                  {item.name}
                                </p>
                                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                  {item.slug}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab("categories");
                                  setEditingCategoryId(item.id);
                                  setCategoryForm({
                                    name: item.name,
                                    description: item.description ?? "",
                                    color: item.color ?? "#3163a2",
                                    imageUrl: item.image_url ?? "",
                                  });
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#22264b] transition-colors hover:border-[#9dbf14] hover:bg-[#9dbf14]/10 dark:border-white/10 dark:text-slate-200"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(item)}
                                className="inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-400"
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                        <FolderOpen
                          className="mx-auto mb-3 text-slate-400"
                          size={28}
                        />
                        <p className="font-semibold text-[#22264b] dark:text-white">
                          No hay categorías creadas
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Organiza tus artículos creando categorías.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* EVENTOS */}
                {activeTab === "events" && (
                  <>
                    {events.length ? (
                      events.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-[20px] border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-[#9dbf14]/40 hover:shadow-[0_12px_35px_rgba(29,53,87,0.07)] dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <CalendarDays
                              size={14}
                              className="text-[#79990b]"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3163a2] dark:text-[#a8c75d]">
                              {item.status}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-[#22264b] dark:text-white">
                            {item.title}
                          </h3>

                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <MapPin size={14} />
                            {item.location || "Sin ubicación"}
                          </p>

                          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("events");
                                setEditingEventId(item.id);
                                setEventForm({
                                  title: item.title,
                                  summary: item.summary ?? "",
                                  description: item.description ?? "",
                                  eventDate: item.event_date
                                    ? new Date(item.event_date)
                                        .toISOString()
                                        .slice(0, 16)
                                    : "",
                                  location: item.location ?? "",
                                  isVirtual: String(Boolean(item.is_virtual)),
                                  status: item.status ?? "upcoming",
                                  coverImageUrl: item.cover_image_url ?? "",
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#22264b] hover:border-[#9dbf14] hover:bg-[#9dbf14]/10 dark:border-white/10 dark:text-slate-200"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-400"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                        <CalendarDays
                          className="mx-auto mb-3 text-slate-400"
                          size={28}
                        />
                        <p className="font-semibold text-[#22264b] dark:text-white">
                          No hay eventos creados
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* CONVOCATORIAS */}
                {activeTab === "calls" && (
                  <>
                    {calls.length ? (
                      calls.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-[20px] border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-[#9dbf14]/40 hover:shadow-[0_12px_35px_rgba(29,53,87,0.07)] dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <Megaphone size={14} className="text-[#79990b]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3163a2] dark:text-[#a8c75d]">
                              {item.status}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-[#22264b] dark:text-white">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {item.organization || "Sin organización"}
                          </p>

                          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("calls");
                                setEditingCallId(item.id);
                                setCallForm({
                                  title: item.title,
                                  summary: item.summary ?? "",
                                  description: item.description ?? "",
                                  startDate: item.start_date
                                    ? new Date(item.start_date)
                                        .toISOString()
                                        .slice(0, 16)
                                    : "",
                                  endDate: item.end_date
                                    ? new Date(item.end_date)
                                        .toISOString()
                                        .slice(0, 16)
                                    : "",
                                  status: item.status ?? "active",
                                  organization: item.organization ?? "",
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#22264b] hover:border-[#9dbf14] hover:bg-[#9dbf14]/10 dark:border-white/10 dark:text-slate-200"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCall(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-400"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                        <Megaphone
                          className="mx-auto mb-3 text-slate-400"
                          size={28}
                        />
                        <p className="font-semibold text-[#22264b] dark:text-white">
                          No hay convocatorias creadas
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* RECURSOS */}
                {activeTab === "resources" && (
                  <>
                    {resources.length ? (
                      resources.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-[20px] border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-[#9dbf14]/40 hover:shadow-[0_12px_35px_rgba(29,53,87,0.07)] dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <FileText size={14} className="text-[#79990b]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3163a2] dark:text-[#a8c75d]">
                              {item.type}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-[#22264b] dark:text-white">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {item.summary || "Sin resumen"}
                          </p>

                          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("resources");
                                setEditingResourceId(item.id);
                                setResourceForm({
                                  title: item.title,
                                  summary: item.summary ?? "",
                                  type: item.type ?? "guide",
                                  fileUrl: item.file_url ?? "",
                                  externalUrl: item.external_url ?? "",
                                  status: item.status ?? "active",
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#22264b] hover:border-[#9dbf14] hover:bg-[#9dbf14]/10 dark:border-white/10 dark:text-slate-200"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteResource(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-400"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                        <FileText
                          className="mx-auto mb-3 text-slate-400"
                          size={28}
                        />
                        <p className="font-semibold text-[#22264b] dark:text-white">
                          No hay recursos creados
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* MULTIMEDIA */}
                {activeTab === "media" && (
                  <>
                    {media.length ? (
                      media.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-[20px] border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-[#9dbf14]/40 hover:shadow-[0_12px_35px_rgba(29,53,87,0.07)] dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <Image size={14} className="text-[#79990b]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3163a2] dark:text-[#a8c75d]">
                              {item.type}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-[#22264b] dark:text-white">
                            {item.title}
                          </h3>

                          <p className="mt-2 break-all text-sm text-slate-500 dark:text-slate-400">
                            {item.url || "Sin URL"}
                          </p>

                          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("media");
                                setEditingMediaId(item.id);
                                setMediaForm({
                                  title: item.title,
                                  type: item.type ?? "image",
                                  url: item.url ?? "",
                                  thumbnail: item.thumbnail ?? "",
                                  description: item.description ?? "",
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#22264b] hover:border-[#9dbf14] hover:bg-[#9dbf14]/10 dark:border-white/10 dark:text-slate-200"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-400"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                        <Image
                          className="mx-auto mb-3 text-slate-400"
                          size={28}
                        />
                        <p className="font-semibold text-[#22264b] dark:text-white">
                          No hay multimedia creada
                        </p>
                      </div>
                    )}
                  </>
                )}
              </section>

              {/* FORMULARIOS */}
              <aside className="relative h-fit overflow-hidden rounded-[26px] border border-white/10 bg-[#22264b] p-5 text-white shadow-[0_20px_50px_rgba(29,53,87,0.18)] dark:bg-[#17243a] sm:p-6 lg:sticky lg:top-6">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#9dbf14]/20" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#9dbf14]/15" />
                <div className="pointer-events-none absolute bottom-20 -left-20 h-48 w-48 rounded-full border border-white/5" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-start justify-between gap-3 border-b border-white/10 pb-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#9dbf14]" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dff090]">
                          Gestión de contenido
                        </p>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {activeTab === "articles"
                          ? editingArticleId !== null
                            ? "Editar artículo"
                            : "Nuevo artículo"
                          : activeTab === "categories"
                            ? editingCategoryId !== null
                              ? "Editar categoría"
                              : "Nueva categoría"
                            : activeTab === "events"
                              ? editingEventId !== null
                                ? "Editar evento"
                                : "Nuevo evento"
                              : activeTab === "calls"
                                ? editingCallId !== null
                                  ? "Editar convocatoria"
                                  : "Nueva convocatoria"
                                : activeTab === "resources"
                                  ? editingResourceId !== null
                                    ? "Editar recurso"
                                    : "Nuevo recurso"
                                  : editingMediaId !== null
                                    ? "Editar multimedia"
                                    : "Nueva multimedia"}
                      </h3>
                    </div>

                    {((activeTab === "articles" && editingArticleId !== null) ||
                      (activeTab === "categories" &&
                        editingCategoryId !== null) ||
                      (activeTab === "events" && editingEventId !== null) ||
                      (activeTab === "calls" && editingCallId !== null) ||
                      (activeTab === "resources" &&
                        editingResourceId !== null) ||
                      (activeTab === "media" && editingMediaId !== null)) && (
                      <button
                        type="button"
                        onClick={
                          activeTab === "articles"
                            ? resetArticleForm
                            : activeTab === "categories"
                              ? resetCategoryForm
                              : activeTab === "events"
                                ? resetEventForm
                                : activeTab === "calls"
                                  ? resetCallForm
                                  : activeTab === "resources"
                                    ? resetResourceForm
                                    : resetMediaForm
                        }
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-[#dff090] transition-colors hover:bg-white/10"
                      >
                        <X size={14} />
                        Cancelar
                      </button>
                    )}
                  </div>

                  {/* ARTÍCULO */}
                  {activeTab === "articles" && (
                    <div className="space-y-3">
                      <input
                        value={articleForm.title}
                        onChange={(event) =>
                          handleArticleInput("title", event.target.value)
                        }
                        placeholder="Título del artículo"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-[#9dbf14] focus:bg-white/[0.10] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <input
                        value={articleForm.subtitle}
                        onChange={(event) =>
                          handleArticleInput("subtitle", event.target.value)
                        }
                        placeholder="Subtítulo"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <input
                        value={articleForm.excerpt}
                        onChange={(event) =>
                          handleArticleInput("excerpt", event.target.value)
                        }
                        placeholder="Resumen breve"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <textarea
                        value={articleForm.content}
                        onChange={(event) =>
                          handleArticleInput("content", event.target.value)
                        }
                        placeholder="Contenido del artículo"
                        rows={5}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#dff090]">
                          Categoría del artículo
                        </label>

                        {categories.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-[#9dbf14]/40 bg-[#9dbf14]/5 px-4 py-3 text-sm text-[#dff090]">
                            Aún no hay categorías creadas. Crea una categoría antes de publicar un artículo.
                          </div>
                        ) : (
                          <select
                            value={articleForm.categoryId}
                            onChange={(event) =>
                              handleArticleInput("categoryId", event.target.value)
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                          >
                            <option value="" className="text-slate-700">
                              Selecciona una categoría
                            </option>
                            {categories.map((category) => (
                              <option key={category.id} value={String(category.id)} className="text-slate-700">
                                {category.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#dff090]">
                          Portada o video
                        </label>

                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleArticleFileChange}
                          className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[#dff090] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#1d3557] hover:file:bg-[#c9e77a]"
                        />

                        {articleForm.coverImageUrl && (
                          <p className="break-all text-xs text-[#dff090]">
                            Archivo cargado: {articleForm.coverImageUrl}
                          </p>
                        )}
                      </div>

                      <select
                        value={articleForm.status}
                        onChange={(event) =>
                          handleArticleInput("status", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#17243a] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      >
                        <option value="draft">Borrador</option>
                        <option value="review">En revisión</option>
                        <option value="published">Publicado</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleSaveArticle}
                        disabled={
                          submitting ||
                          !articleForm.title.trim() ||
                          !articleForm.content.trim()
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 py-3 text-sm font-bold text-[#1c2440] shadow-lg shadow-black/10 transition-all hover:bg-[#b0d52a] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting ? (
                          "Guardando..."
                        ) : (
                          <>
                            <Plus size={17} />
                            {editingArticleId !== null
                              ? "Actualizar artículo"
                              : "Guardar artículo"}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* CATEGORÍA */}
                  {activeTab === "categories" && (
                    <div className="space-y-3">
                      <input
                        value={categoryForm.name}
                        onChange={(event) =>
                          handleCategoryInput("name", event.target.value)
                        }
                        placeholder="Nombre de la categoría"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <textarea
                        value={categoryForm.description}
                        onChange={(event) =>
                          handleCategoryInput("description", event.target.value)
                        }
                        placeholder="Descripción"
                        rows={4}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#dff090]">
                          Color identificador
                        </label>
                        <input
                          type="color"
                          value={categoryForm.color}
                          onChange={(event) =>
                            handleCategoryInput("color", event.target.value)
                          }
                          className="h-12 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
                        />
                      </div>

                      <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#dff090]">
                          Imagen de categoría
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCategoryFileChange}
                          className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[#dff090] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#1d3557]"
                        />

                        {categoryForm.imageUrl && (
                          <p className="break-all text-xs text-[#dff090]">
                            Archivo cargado: {categoryForm.imageUrl}
                          </p>
                        )}
                      </div>

                      <input
                        value={categoryForm.imageUrl}
                        onChange={(event) =>
                          handleCategoryInput("imageUrl", event.target.value)
                        }
                        placeholder="URL de imagen"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <button
                        type="button"
                        onClick={handleSaveCategory}
                        disabled={submitting || !categoryForm.name.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 py-3 text-sm font-bold text-[#1c2440] transition-all hover:bg-[#b0d52a] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "Guardando..."
                          : editingCategoryId !== null
                            ? "Actualizar categoría"
                            : "Guardar categoría"}
                      </button>
                    </div>
                  )}

                  {/* EVENTO */}
                  {activeTab === "events" && (
                    <div className="space-y-3">
                      <input
                        value={eventForm.title}
                        onChange={(event) =>
                          handleEventInput("title", event.target.value)
                        }
                        placeholder="Título del evento"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <textarea
                        value={eventForm.summary}
                        onChange={(event) =>
                          handleEventInput("summary", event.target.value)
                        }
                        placeholder="Resumen"
                        rows={3}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <textarea
                        value={eventForm.description}
                        onChange={(event) =>
                          handleEventInput("description", event.target.value)
                        }
                        placeholder="Descripción"
                        rows={4}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <input
                        type="datetime-local"
                        value={eventForm.eventDate}
                        onChange={(event) =>
                          handleEventInput("eventDate", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      />

                      <input
                        value={eventForm.location}
                        onChange={(event) =>
                          handleEventInput("location", event.target.value)
                        }
                        placeholder="Ubicación"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#dff090]">
                          Portada del evento
                        </label>

                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleEventFileChange}
                          className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[#dff090] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#1d3557]"
                        />

                        {eventForm.coverImageUrl && (
                          <p className="break-all text-xs text-[#dff090]">
                            Archivo cargado: {eventForm.coverImageUrl}
                          </p>
                        )}
                      </div>

                      <select
                        value={eventForm.isVirtual}
                        onChange={(event) =>
                          handleEventInput("isVirtual", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#17243a] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      >
                        <option value="false">Presencial</option>
                        <option value="true">Virtual</option>
                      </select>

                      <select
                        value={eventForm.status}
                        onChange={(event) =>
                          handleEventInput("status", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#17243a] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      >
                        <option value="upcoming">Próximo</option>
                        <option value="ongoing">En curso</option>
                        <option value="completed">Completado</option>
                      </select>

                      <input
                        value={eventForm.coverImageUrl}
                        onChange={(event) =>
                          handleEventInput("coverImageUrl", event.target.value)
                        }
                        placeholder="URL de portada"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <button
                        type="button"
                        onClick={handleSaveEvent}
                        disabled={submitting || !eventForm.title.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 py-3 text-sm font-bold text-[#1c2440] transition-all hover:bg-[#b0d52a] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "Guardando..."
                          : editingEventId !== null
                            ? "Actualizar evento"
                            : "Guardar evento"}
                      </button>
                    </div>
                  )}

                  {/* CONVOCATORIA */}
                  {activeTab === "calls" && (
                    <div className="space-y-3">
                      <input
                        value={callForm.title}
                        onChange={(event) =>
                          handleCallInput("title", event.target.value)
                        }
                        placeholder="Título de la convocatoria"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14] focus:ring-2 focus:ring-[#9dbf14]/20"
                      />

                      <textarea
                        value={callForm.summary}
                        onChange={(event) =>
                          handleCallInput("summary", event.target.value)
                        }
                        placeholder="Resumen"
                        rows={3}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <textarea
                        value={callForm.description}
                        onChange={(event) =>
                          handleCallInput("description", event.target.value)
                        }
                        placeholder="Descripción"
                        rows={4}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <input
                        type="datetime-local"
                        value={callForm.startDate}
                        onChange={(event) =>
                          handleCallInput("startDate", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      />

                      <input
                        type="datetime-local"
                        value={callForm.endDate}
                        onChange={(event) =>
                          handleCallInput("endDate", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      />

                      <input
                        value={callForm.organization}
                        onChange={(event) =>
                          handleCallInput("organization", event.target.value)
                        }
                        placeholder="Organización"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <select
                        value={callForm.status}
                        onChange={(event) =>
                          handleCallInput("status", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#17243a] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      >
                        <option value="active">Activa</option>
                        <option value="closed">Cerrada</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleSaveCall}
                        disabled={submitting || !callForm.title.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 py-3 text-sm font-bold text-[#1c2440] transition-all hover:bg-[#b0d52a] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "Guardando..."
                          : editingCallId !== null
                            ? "Actualizar convocatoria"
                            : "Guardar convocatoria"}
                      </button>
                    </div>
                  )}

                  {/* RECURSO */}
                  {activeTab === "resources" && (
                    <div className="space-y-3">
                      <input
                        value={resourceForm.title}
                        onChange={(event) =>
                          handleResourceInput("title", event.target.value)
                        }
                        placeholder="Título del recurso"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <textarea
                        value={resourceForm.summary}
                        onChange={(event) =>
                          handleResourceInput("summary", event.target.value)
                        }
                        placeholder="Resumen"
                        rows={3}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <select
                        value={resourceForm.type}
                        onChange={(event) =>
                          handleResourceInput("type", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#17243a] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      >
                        <option value="guide">Guía</option>
                        <option value="pdf">PDF</option>
                        <option value="template">Plantilla</option>
                        <option value="video">Video</option>
                      </select>

                      <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#dff090]">
                          Archivo del recurso
                        </label>

                        <input
                          type="file"
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          onChange={handleResourceFileChange}
                          className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[#dff090] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#1d3557]"
                        />

                        {resourceForm.fileUrl && (
                          <p className="break-all text-xs text-[#dff090]">
                            Archivo cargado: {resourceForm.fileUrl}
                          </p>
                        )}
                      </div>

                      <input
                        value={resourceForm.fileUrl}
                        onChange={(event) =>
                          handleResourceInput("fileUrl", event.target.value)
                        }
                        placeholder="URL del archivo"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <input
                        value={resourceForm.externalUrl}
                        onChange={(event) =>
                          handleResourceInput("externalUrl", event.target.value)
                        }
                        placeholder="URL externa"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <select
                        value={resourceForm.status}
                        onChange={(event) =>
                          handleResourceInput("status", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#17243a] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      >
                        <option value="active">Activo</option>
                        <option value="archived">Archivado</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleSaveResource}
                        disabled={submitting || !resourceForm.title.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 py-3 text-sm font-bold text-[#1c2440] transition-all hover:bg-[#b0d52a] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "Guardando..."
                          : editingResourceId !== null
                            ? "Actualizar recurso"
                            : "Guardar recurso"}
                      </button>
                    </div>
                  )}

                  {/* MULTIMEDIA */}
                  {activeTab === "media" && (
                    <div className="space-y-3">
                      <input
                        value={mediaForm.title}
                        onChange={(event) =>
                          handleMediaInput("title", event.target.value)
                        }
                        placeholder="Título de la pieza multimedia"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <select
                        value={mediaForm.type}
                        onChange={(event) =>
                          handleMediaInput("type", event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#17243a] px-4 py-3 text-sm text-white outline-none focus:border-[#9dbf14]"
                      >
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                        <option value="document">Documento</option>
                      </select>

                      <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#dff090]">
                          Archivo multimedia
                        </label>

                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaFileChange}
                          className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[#dff090] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#1d3557]"
                        />

                        {mediaForm.url && (
                          <p className="break-all text-xs text-[#dff090]">
                            Archivo cargado: {mediaForm.url}
                          </p>
                        )}
                      </div>

                      <input
                        value={mediaForm.url}
                        onChange={(event) =>
                          handleMediaInput("url", event.target.value)
                        }
                        placeholder="URL principal"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <input
                        value={mediaForm.thumbnail}
                        onChange={(event) =>
                          handleMediaInput("thumbnail", event.target.value)
                        }
                        placeholder="Thumbnail"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <textarea
                        value={mediaForm.description}
                        onChange={(event) =>
                          handleMediaInput("description", event.target.value)
                        }
                        placeholder="Descripción"
                        rows={4}
                        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#9dbf14]"
                      />

                      <button
                        type="button"
                        onClick={handleSaveMedia}
                        disabled={submitting || !mediaForm.title.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9dbf14] px-4 py-3 text-sm font-bold text-[#1c2440] transition-all hover:bg-[#b0d52a] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "Guardando..."
                          : editingMediaId !== null
                            ? "Actualizar multimedia"
                            : "Guardar multimedia"}
                      </button>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

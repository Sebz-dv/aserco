
import {
  ArrowRight,
  Building2,
  SearchCheck,
  Blocks,
  Landmark,
  ClipboardCheck,
  TrendingUp,
  Check,
} from "lucide-react";

import { SectionHeading } from "../atoms/SectionHeading";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Necesidad financiera",
    description:
      "Identificamos las necesidades y oportunidades de financiación de tu empresa.",
    details: [
      "Capital de trabajo",
      "Inversión y expansión",
      "Compra de activos",
      "Modernización",
      "Sostenibilidad y liquidez",
    ],
  },
  {
    number: "02",
    icon: SearchCheck,
    title: "Smart Check",
    description:
      "Evaluamos el perfil financiero y las capacidades de tu negocio.",
    details: [
      "Análisis financiero",
      "Perfilamiento de riesgo",
      "Capacidad de pago",
      "Identificación de oportunidades",
    ],
  },
  {
    number: "03",
    icon: Blocks,
    title: "Estructuración",
    description:
      "Diseñamos una solución financiera alineada con tus objetivos.",
    details: [
      "Monto y plazo",
      "Garantías",
      "Línea financiera",
      "Entidad objetivo",
      "Estructura de operación",
    ],
  },
  {
    number: "04",
    icon: Landmark,
    title: "Canalización multibanca",
    description:
      "Conectamos tu empresa con las alternativas financieras adecuadas.",
    details: [
      "Banca privada",
      "Banca de desarrollo",
      "Fintech",
      "Fondos",
      "Cooperativas",
    ],
  },
  {
    number: "05",
    icon: ClipboardCheck,
    title: "Gestión integral",
    description:
      "Gestionamos y acompañamos cada etapa hasta el desembolso.",
    details: [
      "Gestión documental",
      "Radicación",
      "Respuesta a observaciones",
      "Seguimiento",
      "Cierre de operación",
    ],
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "Resultados",
    description:
      "Impulsamos el crecimiento y fortalecimiento de tu empresa.",
    details: [
      "Mayor liquidez",
      "Inversión productiva",
      "Expansión",
      "Competitividad",
      "Sostenibilidad",
    ],
  },
];

export function Approach() {
  return (
    <section
      id="nosotros"
      data-reveal
      className="section-surface py-24 dark:bg-[#22264b]"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Encabezado */}
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div>
            <SectionHeading
              eyebrow="NUESTRA METODOLOGÍA"
              title="De la necesidad al resultado."
              description="Un proceso estructurado que conecta las necesidades financieras de tu empresa con las alternativas adecuadas, mediante una gestión cercana y estratégica."
            />
          </div>

          <div className="flex items-center gap-4 lg:justify-end">
            <div className="h-12 w-1 shrink-0 rounded-full bg-[#9dbf14]" />
            <p className="max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              Seis etapas. Una gestión integral. Un objetivo:
              facilitar el acceso a soluciones financieras.
            </p>
          </div>
        </div>

        {/* Línea de progreso */}
        <div className="relative mt-16">

          <div className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-slate-200 dark:bg-white/15 lg:block" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  data-reveal
                  style={{ transitionDelay: `${index * 90}ms` }}
                  className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9dbf14]/50 hover:shadow-xl hover:shadow-slate-200/60 dark:border-white/10 dark:bg-[#1d2344] dark:hover:shadow-black/20"
                >
                  {/* Número e icono */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="grid size-14 place-items-center rounded-2xl border border-slate-100 bg-[#f3f6fb] text-[#3163a2] transition-colors group-hover:border-[#9dbf14]/30 group-hover:bg-[#9dbf14]/10 group-hover:text-[#789900] dark:border-white/10 dark:bg-[#222b50] dark:text-[#9dbf14]">
                      <Icon size={25} strokeWidth={1.7} />
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-slate-200 transition-colors group-hover:text-[#9dbf14] dark:text-white/15">
                      {step.number}
                    </span>
                  </div>

                  {/* Contenido */}
                  <h3 className="mt-6 min-h-[48px] text-base font-bold leading-6 text-[#22264b] dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 min-h-[96px] text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>

                  {/* Detalles */}
                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-white/10">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#789900] dark:text-[#c5e76b]">
                      Aspectos clave
                    </p>

                    <ul className="space-y-2.5">
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-start gap-2 text-[11px] leading-4 text-slate-600 dark:text-slate-300"
                        >
                          <Check
                            size={13}
                            className="mt-0.5 shrink-0 text-[#8eae18]"
                          />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Indicador de etapa */}
                  <div className="mt-auto pt-6">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full bg-[#9dbf14] transition-all duration-500 ${
                          index === 5 ? "w-full" : "w-1/3 group-hover:w-full"
                        }`}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Resultado final */}
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-[#22264b] p-8 sm:p-10 dark:bg-[#171d3b]">
          <div className="absolute -right-16 -top-24 size-72 rounded-full border-[40px] border-white/[0.04]" />
          <div className="absolute -bottom-28 right-32 size-64 rounded-full bg-[#9dbf14]/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#9dbf14]/30 bg-[#9dbf14]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#c5e76b]">
                <span className="size-1.5 rounded-full bg-[#9dbf14]" />
                Nuestro compromiso
              </div>

              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Más que financiación, conexiones que impulsan tu crecimiento.
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Acompañamos a tu empresa desde la identificación de
                sus necesidades hasta la materialización de sus
                oportunidades financieras.
              </p>
            </div>

            <a
              href="#contacto"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#9dbf14] px-6 py-4 text-sm font-bold text-[#172039] transition-all hover:bg-[#b1d42a] hover:gap-4"
            >
              Hablemos de tu empresa
              <ArrowRight size={17} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}


import {
  Building2,
  Zap,
  Landmark,
  ChartNoAxesCombined,
  Globe2,
  Plane,
  House,
  Users,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import { SectionHeading } from "../atoms/SectionHeading";
import { ServiceCard } from "../molecules/ServiceCard";

const businessServices = [
  {
    number: "01",
    title: "Tarjetas corporativas y cupo rotativo",
    description:
      "Cupo rotativo para el control operativo y la administración eficiente de gastos de la empresa, pensado para empresas con operación diaria y necesidad de liquidez ágil.",
    icon: CreditCard,
    href: "#tarjetas-corporativas",
  },
  {
    number: "02",
    title: "SaaS de administración de gastos",
    description:
      "Plataforma inteligente para centralizar, categorizar y analizar los gastos y movimientos de la empresa, con trazabilidad y apoyo para decisiones más eficientes.",
    icon: ChartNoAxesCombined,
    href: "#saas-gastos",
  },
  {
    number: "03",
    title: "Factoring y Confirming",
    description:
      "Soluciones para gestionar cuentas por cobrar, anticipar liquidez y optimizar los pagos de tu empresa.",
    icon: ChartNoAxesCombined,
    href: "#factoring",
  },
  {
    number: "04",
    title: "Eficiencia energética",
    description:
      "Alternativas de financiación para proyectos que buscan optimizar el consumo energético empresarial.",
    icon: Zap,
    href: "#energia",
  },
  {
    number: "05",
    title: "Créditos con garantía real",
    description:
      "Financiación empresarial respaldada con garantías reales, con procesos ágiles de aprobación y desembolso.",
    icon: ShieldCheck,
    href: "#garantia-empresas",
  },
  {
    number: "06",
    title: "Créditos productivos",
    description:
      "Estructuración de soluciones de crédito de acuerdo con las necesidades y capacidad financiera de cada empresa.",
    icon: Building2,
    href: "#creditos-productivos",
  },
  {
    number: "07",
    title: "Trade Finance",
    description:
      "Instrumentos financieros para facilitar y respaldar las operaciones de comercio exterior.",
    icon: Globe2,
    href: "#trade-finance",
  },
  {
    number: "08",
    title: "Factoring de exportación",
    description:
      "Alternativas de liquidez para empresas que venden sus productos y servicios en mercados internacionales.",
    icon: Plane,
    href: "#factoring-exportacion",
  },
];

const personalServices = [
  {
    number: "01",
    title: "Crédito para vivienda",
    description:
      "Alternativas de financiación para quienes buscan adquirir su vivienda.",
    icon: House,
    href: "#vivienda",
  },
  {
    number: "02",
    title: "Créditos para pensionados",
    description:
      "Opciones de financiación con procesos de aprobación ágiles para pensionados.",
    icon: Users,
    href: "#pensionados",
  },
  {
    number: "03",
    title: "Créditos con garantía real",
    description:
      "Soluciones de financiación respaldadas por bienes inmuebles.",
    icon: Landmark,
    href: "#garantia-personas",
  },
];

export function Services() {
  return (
    <section
      id="servicios"
      data-reveal
      className="section-surface py-24 dark:bg-[#1f2543]"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Encabezado */}
        <div className="mb-16">
          <SectionHeading
            eyebrow="Nuestro portafolio"
            title="Soluciones financieras para cada necesidad."
            description="Conectamos empresas y personas con alternativas de financiación, liquidez y crecimiento a través de nuestro ecosistema de aliados financieros."
          />
        </div>

        {/* Línea empresarial */}
        <div id="linea-empresarial" className="mb-20 scroll-mt-28">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-[#9dbf14]">
                01 / Línea empresarial
              </span>
              <h3 className="text-2xl font-bold text-[#22264b] dark:text-white md:text-3xl">
                Soluciones para impulsar empresas.
              </h3>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Financiación estratégica, gestión de liquidez y soluciones
              especializadas para acompañar cada etapa del negocio.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {businessServices.map((item, index) => (
              <div key={item.number + item.title} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
                <ServiceCard {...item} />
              </div>
            ))}
          </div>
        </div>

        {/* Línea personas */}
        <div id="linea-personas" className="border-t border-slate-200 pt-16 scroll-mt-28 dark:border-white/10">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-[#9dbf14]">
                02 / Línea personas
              </span>
              <h3 className="text-2xl font-bold text-[#22264b] dark:text-white md:text-3xl">
                Alternativas para tus proyectos personales.
              </h3>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Productos financieros complementarios para acompañar
              decisiones importantes y necesidades personales.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {personalServices.map((item, index) => (
              <div key={item.number + item.title} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
                <ServiceCard {...item} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

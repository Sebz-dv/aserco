import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Building2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";

const contactChannels = [
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "ceo@aserco.com.co",
    href: "mailto:ceo@aserco.com.co",
    color: "lime",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Escríbenos directamente",
    href: "https://wa.me/573144142937",
    external: true,
    color: "green",
  },
  {
    icon: Phone,
    label: "Teléfono de contacto",
    value: "+57 314 414 2937",
    href: "tel:+573144142937",
    color: "blue",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export function Contact() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        variants: revealVariants,
      };

  return (
    <section
      id="contacto"
      data-reveal
      className="
    relative isolate overflow-hidden
    bg-transparent py-24
    text-slate-900 dark:text-white
    transition-colors duration-300
  "
    >
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* ENCABEZADO */}
        <motion.div {...reveal} className=" max-w-3xl sm:mb-16">
          <div
            className="
              mb-5 inline-flex items-center gap-2
              rounded-full border border-[#9dbf14]/20
              bg-[#9dbf14]/10 px-4 py-2
              text-xs font-bold uppercase tracking-[0.16em]
              text-[#789900]
              dark:text-[#b5d83d]
            "
          >
            <Sparkles size={15} />
            Estamos para ayudarte
          </div>

          <h2
            className="
            text-3xl font-semibold leading-[1.12]
            tracking-tight sm:text-4xl lg:text-6xl
          "
          >
            Las mejores oportunidades comienzan con una{" "}
            <span className="text-[#789900] dark:text-[#b5d83d]">
              conversación.
            </span>
          </h2>

          <p
            className="
            mt-5 max-w-2xl text-sm leading-7
            text-slate-600 sm:text-base sm:leading-8
            dark:text-slate-300
          "
          >
            Cada empresa tiene necesidades y objetivos diferentes. Cuéntanos
            sobre tu negocio y encontremos juntos las alternativas financieras
            que mejor se adapten a él.
          </p>
        </motion.div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          {/* TARJETA PRINCIPAL */}
          <motion.div
            {...reveal}
            whileHover={reduceMotion ? undefined : { y: -5 }}
            transition={{ duration: 0.3 }}
            className="
              group relative flex min-h-[500px] flex-col
              justify-between overflow-hidden rounded-[32px]
              border border-slate-200/70
              bg-white/75 p-7
              shadow-[0_25px_70px_rgba(34,38,75,0.07)]
              backdrop-blur-xl
              transition-colors duration-300
              dark:border-white/10
              dark:bg-[#101c32]/85
              dark:shadow-[0_25px_70px_rgba(0,0,0,0.25)]
              sm:p-10 md:p-12
            "
          >
            {/* DECORACIÓN */}
            <div
              className="
              pointer-events-none absolute -right-24 -top-24
              size-80 rounded-full border border-[#9dbf14]/15
              transition-transform duration-700
              group-hover:scale-110
            "
            />
            <div
              className="
              pointer-events-none absolute -right-12 -top-12
              size-56 rounded-full border border-[#9dbf14]/15
            "
            />
            <div
              className="
              pointer-events-none absolute -bottom-32 -left-20
              size-72 rounded-full bg-[#3163a2]/5 blur-3xl
            "
            />

            <div className="relative z-10">
              <motion.div
                whileHover={
                  reduceMotion ? undefined : { rotate: 6, scale: 1.08 }
                }
                className="
                  grid size-16 place-items-center rounded-2xl
                  border border-[#9dbf14]/20
                  bg-[#9dbf14]/15
                  text-[#789900]
                  shadow-[0_8px_25px_rgba(157,191,20,0.12)]
                  dark:text-[#b5d83d]
                "
              >
                <Building2 size={29} />
              </motion.div>

              <p
                className="
                mt-9 text-xs font-bold uppercase
                tracking-[0.22em]
                text-[#789900] dark:text-[#b5d83d]
              "
              >
                Aserco Smart Finance
              </p>

              <h3
                className="
                mt-5 max-w-lg text-3xl font-semibold
                leading-[1.15] tracking-tight
                sm:text-4xl
              "
              >
                Impulsemos juntos el futuro financiero de tu empresa.
              </h3>

              <p
                className="
                mt-6 max-w-md text-sm leading-7
                text-slate-600 dark:text-slate-300
              "
              >
                Nuestro equipo está preparado para conocer tus necesidades,
                resolver tus inquietudes y orientarte en el proceso.
              </p>
            </div>

            <div className="relative z-10 mt-12">
              <motion.a
                href="mailto:ceo@aserco.com.co?subject=Consulta%20de%20servicios%20financieros"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className="
                  group/btn inline-flex w-full items-center
                  justify-center gap-3 rounded-full
                  bg-[#9dbf14] px-6 py-4
                  text-sm font-bold text-[#22264b]
                  shadow-lg shadow-[#9dbf14]/20
                  transition-all duration-300
                  hover:bg-[#b5d83d]
                  hover:shadow-xl hover:shadow-[#9dbf14]/25
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                  focus-visible:outline-[#9dbf14]
                  sm:w-auto sm:justify-start sm:px-8
                "
              >
                Iniciar una conversación
                <ArrowUpRight
                  size={19}
                  className="
                    transition-transform duration-300
                    group-hover/btn:translate-x-1
                    group-hover/btn:-translate-y-1
                  "
                />
              </motion.a>
            </div>
          </motion.div>

          {/* COLUMNA DE CONTACTO */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="flex flex-col gap-5"
          >
            {/* CANALES */}
            <motion.div
              variants={revealVariants}
              className="
                relative overflow-hidden rounded-[30px]
                border border-slate-200/70
                bg-white/75 p-6
                shadow-[0_20px_50px_rgba(34,38,75,0.055)]
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-[#101c32]/85
                sm:p-8
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className="
                    text-[10px] font-bold uppercase
                    tracking-[0.2em] text-[#789900]
                    dark:text-[#b5d83d] sm:text-xs
                  "
                  >
                    Canales de atención
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    Hablemos directamente
                  </h3>
                </div>

                <div
                  className="
                  grid size-12 shrink-0 place-items-center
                  rounded-2xl border border-[#9dbf14]/20
                  bg-[#9dbf14]/10 text-[#789900]
                  dark:text-[#b5d83d]
                "
                >
                  <MessageCircle size={21} />
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {contactChannels.map((channel) => {
                  const Icon = channel.icon;
                  const isGreen = channel.color === "green";
                  const isBlue = channel.color === "blue";

                  return (
                    <motion.a
                      key={channel.label}
                      href={channel.href}
                      target={channel.external ? "_blank" : undefined}
                      rel={channel.external ? "noopener noreferrer" : undefined}
                      variants={revealVariants}
                      whileHover={reduceMotion ? undefined : { x: 4 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                      className="
                        group/link flex items-center gap-3
                        rounded-2xl border border-slate-200/80
                        bg-slate-50/80 p-4
                        transition-colors duration-300
                        hover:border-[#9dbf14]/40
                        hover:bg-[#9dbf14]/5
                        dark:border-white/[0.07]
                        dark:bg-white/[0.025]
                        dark:hover:bg-white/[0.05]
                        sm:gap-4
                      "
                    >
                      <div
                        className={`
                        grid size-11 shrink-0 place-items-center
                        rounded-xl transition-colors duration-300
                        ${
                          isGreen
                            ? "bg-[#25D366]/15 text-[#0d9c43] dark:text-[#58d98d]"
                            : isBlue
                              ? "bg-[#3163a2]/10 text-[#3163a2] dark:text-[#75a9e8]"
                              : "bg-[#9dbf14]/15 text-[#789900] dark:text-[#b5d83d]"
                        }
                      `}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {channel.label}
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold">
                          {channel.value}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="
                          shrink-0 text-slate-400
                          transition-all duration-300
                          group-hover/link:-translate-y-1
                          group-hover/link:translate-x-1
                          group-hover/link:text-[#789900]
                        "
                      />
                    </motion.a>
                  );
                })}

                {/* UBICACIÓN */}
                <motion.div
                  variants={revealVariants}
                  className="
                    flex items-center gap-4 rounded-2xl
                    border border-slate-200/80
                    bg-slate-50/80 p-4
                    dark:border-white/[0.07]
                    dark:bg-white/[0.025]
                  "
                >
                  <div
                    className="
                    grid size-11 shrink-0 place-items-center
                    rounded-xl bg-[#9dbf14]/15
                    text-[#789900] dark:text-[#b5d83d]
                  "
                  >
                    <MapPin size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ubicación
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Villavicencio, Colombia
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* BLOQUE DE CONFIANZA */}
            <motion.div
              variants={revealVariants}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              className="
                relative overflow-hidden rounded-[30px]
                bg-[#22264b] p-7 text-white
                shadow-[0_20px_50px_rgba(34,38,75,0.18)]
                sm:p-8
              "
            >
              <div
                className="
                pointer-events-none absolute -right-12 -top-16
                size-52 rounded-full border border-white/10
              "
              />
              <div
                className="
                pointer-events-none absolute -right-5 -top-8
                size-36 rounded-full border border-white/10
              "
              />
              <div
                className="
                pointer-events-none absolute -bottom-20 -left-10
                size-48 rounded-full bg-[#9dbf14]/10 blur-3xl
              "
              />

              <div className="relative z-10 flex items-start gap-4">
                <motion.div
                  whileHover={reduceMotion ? undefined : { rotate: 8 }}
                  className="
                    grid size-12 shrink-0 place-items-center
                    rounded-2xl bg-[#9dbf14]
                    text-[#22264b]
                    shadow-lg shadow-[#9dbf14]/20
                  "
                >
                  <ShieldCheck size={23} />
                </motion.div>

                <div>
                  <p className="text-base font-semibold">
                    Una relación basada en confianza.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Escuchamos, analizamos y conectamos oportunidades
                    financieras de acuerdo con las necesidades de cada empresa.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

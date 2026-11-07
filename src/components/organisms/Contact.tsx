import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Building2,
  Sparkles,
} from "lucide-react";

export function Contact() {
  return (
    <section
      id="contacto"
      data-reveal
      className="section-surface py-24 text-slate-900 transition-colors duration-300 dark:bg-[#080e20] dark:text-white"
    >
      <div className="decor-orb -left-28 top-12 size-96 bg-[#9dbf14]/8 blur-[100px]" />
      <div className="decor-ring -right-8 bottom-12 size-80 border-[#3163a2]/20" />
      <div className="decor-orb -right-24 bottom-0 size-72 bg-[#3163a2]/8 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 max-w-3xl sm:mb-14">
          <div className="section-kicker mb-5 sm:mb-6">
            <Sparkles size={15} />
            Estamos para ayudarte
          </div>

          <h2 className="text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-6xl">
            Las mejores oportunidades comienzan con una{" "}
            <span className="text-[#789900] dark:text-[#b5d83d]">
              conversación.
            </span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base sm:leading-8 dark:text-slate-300">
            Cada empresa tiene necesidades y objetivos diferentes. Cuéntanos
            sobre tu negocio y encontremos juntos las alternativas financieras
            que mejor se adapten a él.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="soft-card relative flex min-h-97.5 flex-col justify-between overflow-hidden rounded-[28px] p-6 shadow-[0_24px_60px_rgba(34,38,75,0.08)] sm:p-8 md:p-12 dark:shadow-[0_24px_60px_rgba(2,6,23,0.32)]">
            <div className="decor-ring -right-20 -top-20 size-80 border-[#9dbf14]/15" />
            <div className="decor-ring -right-10 -top-10 size-60 border-[#9dbf14]/15" />

            <div className="relative z-10">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b5d83d]">
                <Building2 size={27} />
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#789900] dark:text-[#b5d83d]">
                Aserco Smart Finance
              </p>

              <h3 className="mt-4 max-w-lg text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Impulsemos juntos el futuro financiero de tu empresa.
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
                Nuestro equipo está preparado para conocer tus necesidades,
                resolver tus inquietudes y orientarte en el proceso.
              </p>
            </div>

            <div className="relative z-10 mt-8 sm:mt-10">
              <a
                href="mailto:ceo@aserco.com.co?subject=Consulta%20de%20servicios%20financieros"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#9dbf14] px-5 py-3.5 text-sm font-bold text-[#22264b] shadow-lg shadow-[#9dbf14]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#b5d83d] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9dbf14] sm:w-auto sm:justify-start sm:px-7 sm:py-4"
              >
                Iniciar una conversación
                <ArrowUpRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="soft-card rounded-[26px] p-5 shadow-[0_18px_40px_rgba(34,38,75,0.06)] dark:shadow-[0_18px_40px_rgba(2,6,23,0.22)] sm:p-7 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#789900] dark:text-[#b5d83d] sm:text-xs">
                    Canales de atención
                  </p>
                  <h3 className="mt-2 text-lg font-semibold sm:text-xl">
                    Hablemos directamente
                  </h3>
                </div>

                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b5d83d] sm:size-11">
                  <MessageCircle size={20} />
                </div>
              </div>

              <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                <a
                  href="mailto:ceo@aserco.com.co"
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-[#9dbf14]/50 hover:bg-[#9dbf14]/5 dark:border-white/5 dark:bg-white/3 dark:hover:bg-[#9dbf14]/10 sm:gap-4 sm:p-4"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b5d83d] sm:size-11">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                      Correo electrónico
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold">
                      ceo@aserco.com.co
                    </p>
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#789900]"
                  />
                </a>

                <a
                  href="https://wa.me/573144142937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-[#25D366]/50 hover:bg-[#25D366]/5 dark:border-white/5 dark:bg-white/3 dark:hover:bg-[#25D366]/10 sm:gap-4 sm:p-4"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#25D366]/15 text-[#0d9c43] dark:text-[#58d98d] sm:size-11">
                    <MessageCircle size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                      WhatsApp
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Escríbenos directamente
                    </p>
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#25D366]"
                  />
                </a>

                <a
                  href="tel:+573144142937"
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-[#9dbf14]/50 hover:bg-[#9dbf14]/5 dark:border-white/5 dark:bg-white/3 dark:hover:bg-[#9dbf14]/10 sm:gap-4 sm:p-4"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b5d83d] sm:size-11">
                    <Phone size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                      Teléfono de contacto
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      +57 314 414 2937
                    </p>
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#789900]"
                  />
                </a>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-white/5 dark:bg-white/3 sm:gap-4 sm:p-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b5d83d] sm:size-11">
                    <MapPin size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                      Ubicación
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Villavicencio, Colombia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] bg-[#22264b] p-7 text-white shadow-[0_18px_45px_rgba(34,38,75,0.18)] md:p-8">
              <div className="decor-ring -right-10 -top-16 size-48 border-white/10" />
              <div className="decor-ring -right-2 -top-8 size-32 border-white/10" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#9dbf14] text-[#22264b]">
                  <ShieldIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Una relación basada en confianza.
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    Escuchamos, analizamos y conectamos oportunidades
                    financieras de acuerdo con las necesidades de cada empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return <Building2 size={21} />;
}

import { Brand } from "../../atoms/Brand";

type SidebarHeaderProps = {
  readonly dark: boolean;
  readonly sidebarOpen: boolean;
};

const logoColor = new URL(
  "../../../assets/logos/logoColor.png",
  import.meta.url,
).href;

export function SidebarHeader({ dark, sidebarOpen }: SidebarHeaderProps) {
  return (
    <header
      className={`
        flex h-19 shrink-0 items-center justify-center
        border-b bg-white/2 transition-all duration-200
        ${sidebarOpen ? "px-5" : "px-2"}
        ${dark ? "border-white/7" : "border-slate-200"}
      `}
    >
      {sidebarOpen ? (
        <Brand />
      ) : (
        <div
          className={`
            flex size-10 shrink-0 items-center justify-center
            overflow-hidden rounded-2xl
            ${
              dark
                ? "bg-white shadow-black/10"
                : "bg-white ring-1 ring-slate-200 shadow-slate-200/60"
            }
          `}
        >
          <img
            src={logoColor}
            alt="Aserco"
            className="h-full w-full object-contain p-2"
            draggable={false}
          />
        </div>
      )}
    </header>
  );
}

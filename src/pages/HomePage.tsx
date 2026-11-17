import { Header } from "../components/organisms/Header";
import { Hero } from "../components/organisms/Hero";
import { CTASection } from "../components/organisms/CTASection";
import { Services } from "../components/organisms/Services";
import { Approach } from "../components/organisms/Approach";
import { Contact } from "../components/organisms/Contact";
import { Footer } from "../components/organisms/Footer";
import type { AuthUser } from "../lib/api";

type Props = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  onToggleTheme: () => void;
  onConfirmLogout?: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: (path?: string) => void;
  onOpenKnowledge: () => void;
}>;

export function HomePage({
  dark,
  user,
  onToggleTheme,
  onConfirmLogout,
  onOpenProfile,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
  onOpenKnowledge,
}: Props) {
  return (
    <>
      <Header
        dark={dark}
        user={user}
        onToggleTheme={onToggleTheme}
        onConfirmLogout={onConfirmLogout}
        onOpenProfile={onOpenProfile}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onOpenAdmin={onOpenAdmin}
        onOpenKnowledge={onOpenKnowledge}
      />

      {/* Espacio reservado para el Header fijo */}
      <div className="h-22" aria-hidden="true" />

      <main className="relative z-10 flex flex-col gap-0">
        <Hero />
        <CTASection />
        <Services />
        <Approach />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

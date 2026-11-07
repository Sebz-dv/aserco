import { Header } from "../components/organisms/Header";
import { Hero } from "../components/organisms/Hero";
import { CTASection } from "../components/organisms/CTASection";
import { Services } from "../components/organisms/Services";
import { Approach } from "../components/organisms/Approach";
import { Contact } from "../components/organisms/Contact";
import { Footer } from "../components/organisms/Footer";
import type { AuthUser } from "../lib/api";

type Props = {
  dark: boolean;
  user: AuthUser | null;
  onToggleTheme: () => void;
  onConfirmLogout?: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: (path?: string) => void;
  onOpenKnowledge: () => void;
};

export function HomePage({ dark, user, onToggleTheme, onConfirmLogout, onOpenLogin, onOpenRegister, onOpenAdmin, onOpenKnowledge }: Props) {
  return (
    <>
      <Header
        dark={dark}
        user={user}
        onToggleTheme={onToggleTheme}
        onConfirmLogout={onConfirmLogout}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onOpenAdmin={onOpenAdmin}
        onOpenKnowledge={onOpenKnowledge}
      />
      <main>
        <Hero user={user} />
        <CTASection />
        <Services />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

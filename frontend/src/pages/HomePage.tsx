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
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
};

export function HomePage({ dark, user, onToggleTheme, onLogout, onOpenLogin, onOpenRegister }: Props) {
  return (
    <>
      <Header
        dark={dark}
        user={user}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
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

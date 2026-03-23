import { Navbar } from '@/components/Navbar/Navbar';
import { Hero } from '@/components/Hero/Hero';
import { TerminalPreview } from '@/components/TerminalPreview/TerminalPreview';
import { LogoBar } from '@/components/LogoBar/LogoBar';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TerminalPreview />
      </main>
      <footer>
        <LogoBar />
      </footer>
      <SocialLinks />
    </>
  );
}

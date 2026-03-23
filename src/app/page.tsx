import { Navbar } from '@/components/Navbar/Navbar';
import { Hero } from '@/components/Hero/Hero';
import { TerminalPreview } from '@/components/TerminalPreview/TerminalPreview';
import { LogoBar } from '@/components/LogoBar/LogoBar';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TerminalPreview />
        <LogoBar />
      </main>
    </>
  );
}

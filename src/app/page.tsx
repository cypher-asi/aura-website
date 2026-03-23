import { Navbar } from '@/components/Navbar/Navbar';
import { Hero } from '@/components/Hero/Hero';
import { CommandSnippet } from '@/components/CommandSnippet/CommandSnippet';
import { TerminalPreview } from '@/components/TerminalPreview/TerminalPreview';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CommandSnippet />
        <TerminalPreview />
      </main>
    </>
  );
}

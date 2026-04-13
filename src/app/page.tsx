import { Navbar } from '@/components/Navbar/Navbar';
import { Hero } from '@/components/Hero/Hero';
import { TerminalPreview } from '@/components/TerminalPreview/TerminalPreview';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { VideoBackground } from '@/components/VideoBackground/VideoBackground';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <VideoBackground />
      <Navbar />
      <main className="homeMain">
        <Hero />
        <TerminalPreview />
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

import { Navbar } from '@/components/Navbar/Navbar';
import { Hero } from '@/components/Hero/Hero';
import { TerminalPreview } from '@/components/TerminalPreview/TerminalPreview';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { VideoBackground } from '@/components/VideoBackground/VideoBackground';
import { ENABLE_MAIN_IMAGE } from '@/config/features';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <div className="homePage">
        <VideoBackground />
        <Navbar />
        <main className="homeMain">
          <Hero />
          {ENABLE_MAIN_IMAGE && <TerminalPreview />}
        </main>
      </div>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

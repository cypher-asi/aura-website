import { Navbar } from '@/components/Navbar/Navbar';
import { PageHero } from '@/components/PageHero/PageHero';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';

export default function Aura3dPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Products"
          headline={
            <>
              AURA 3D
              <br />
              <span className="pageHeroHeadlineMuted">Generative 3D asset creation</span>
            </>
          }
          description="Generate production-ready 3D models, environments, and animations from natural language prompts."
          ctaText="Get Started"
        />
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

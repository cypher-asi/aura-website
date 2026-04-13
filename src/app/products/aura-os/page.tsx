import { Navbar } from '@/components/Navbar/Navbar';
import { PageHero } from '@/components/PageHero/PageHero';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';

export default function AuraOsPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Products"
          headline={
            <>
              AURA OS
              <br />
              <span className="pageHeroHeadlineMuted">A modern agent orchestration system</span>
            </>
          }
          description="Deploy, manage, and scale autonomous agents with a unified operating layer built for production workloads."
          ctaText="Get Started"
        />
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

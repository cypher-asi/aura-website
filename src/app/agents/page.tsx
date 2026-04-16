import { Navbar } from '@/components/Navbar/Navbar';
import { PageHero } from '@/components/PageHero/PageHero';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';

export const metadata = {
  title: 'Agents',
};

export default function AgentsPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Agents"
          headline={
            <>
              Turn ideas into code
              <br />
              <span className="pageHeroHeadlineMuted">Delegate implementation to focus on higher-level direction.</span>
            </>
          }
          description="Autonomous agents that plan, write, and ship production code end-to-end."
          ctaText="Get Started"
        />
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

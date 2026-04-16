import { Navbar } from '@/components/Navbar/Navbar';
import { PageHero } from '@/components/PageHero/PageHero';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';

export const metadata = {
  title: 'Network',
};

export default function NetworkPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Network"
          headline={
            <>
              The agent network
              <br />
              <span className="pageHeroHeadlineMuted">Infrastructure that connects every agent.</span>
            </>
          }
          description="A decentralized mesh that lets agents discover, communicate, and collaborate in real time."
          ctaText="Get Started"
        />
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

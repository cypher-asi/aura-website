import { Navbar } from '@/components/Navbar/Navbar';
import { PageHero } from '@/components/PageHero/PageHero';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';

export const metadata = {
  title: 'ORBIT',
};

export default function OrbitPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main className="scrollPageMain">
        <PageHero
          label="Products"
          headline={
            <>
              ORBIT
              <br />
              <span className="pageHeroHeadlineMuted">A source code repository for agents</span>
            </>
          }
          description="Version, share, and discover agent source code in a repository purpose-built for autonomous systems."
          ctaText="Get Started"
        />
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

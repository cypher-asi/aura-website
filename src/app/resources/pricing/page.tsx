import { Navbar } from '@/components/Navbar/Navbar';
import { PageHero } from '@/components/PageHero/PageHero';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';

export default function PricingPage(): React.ReactNode {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Resources"
          headline={
            <>
              Pricing
              <br />
              <span className="pageHeroHeadlineMuted">Token-based and subscription plans.</span>
            </>
          }
          description="Flexible pricing that scales with your usage. Start free, upgrade when you need to."
          ctaText="Get Started"
        />
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

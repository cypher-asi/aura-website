import { Navbar } from '@/components/Navbar/Navbar';
import { ProductCallToAction } from '@/components/ProductCallToAction/ProductCallToAction';
import { PageHero } from '@/components/PageHero/PageHero';
import { ProductScreenSection } from '@/components/ProductScreenSection/ProductScreenSection';
import { ScrollClassToggle } from '@/components/ScrollClassToggle/ScrollClassToggle';
import { StandardFooter } from '@/components/StandardFooter/StandardFooter';

export const metadata = {
  title: 'Product',
};

export default function ProductPage(): React.ReactNode {
  return (
    <>
      <ScrollClassToggle className="productPageScrollEnabled" />
      <Navbar />
      <main>
        <PageHero
          headline="A modern agent orchestration system"
          description="Deploy, manage, and scale autonomous agents with a unified operating layer built for production workloads."
          preview={null}
        />
        <ProductScreenSection
          headline={
            <>
              Built for end-to-end
              <br />
              agent delivery
            </>
          }
          placeholderLabel="AURA OS workspace"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductScreenSection
          headline={
            <>
              Built for end-to-end
              <br />
              agent delivery
            </>
          }
          placeholderLabel="AURA OS workspace detail"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductScreenSection
          headline={
            <>
              Built for end-to-end
              <br />
              agent delivery
            </>
          }
          placeholderLabel="AURA OS workspace overview"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductCallToAction href="/download" label="DOWNLOAD" />
      </main>
      <StandardFooter />
    </>
  );
}

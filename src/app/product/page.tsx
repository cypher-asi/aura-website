import { ChangelogPreview } from '@/components/ChangelogPreview/ChangelogPreview';
import { Navbar } from '@/components/Navbar/Navbar';
import { ProductCallToAction } from '@/components/ProductCallToAction/ProductCallToAction';
import { PageHero } from '@/components/PageHero/PageHero';
import { ProductScreenSection } from '@/components/ProductScreenSection/ProductScreenSection';
import { StandardFooter } from '@/components/StandardFooter/StandardFooter';

export const metadata = {
  title: 'Product',
};

export default async function ProductPage(): Promise<React.ReactNode> {
  return (
    <>
      <Navbar />
      <main className="scrollPageMain">
        <PageHero
          headline="The Open Intelligence Network"
          description="AURA enables you to deploy, train and hire agents to build fully autonomous companies."
          preview={null}
        />
        <ProductScreenSection
          headline="Hire a team of agents that run your company while you sleep."
          placeholderLabel="AURA OS workspace"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductScreenSection
          headline="Ship complex software that improves itself 247."
          placeholderLabel="AURA OS workspace detail"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductScreenSection
          headline="Command swarms of powerful agents from your palm."
          placeholderLabel="AURA OS workspace overview"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductScreenSection
          headline="Hire agents with expert knowledge in every domain."
          placeholderLabel="AURA OS workspace overview"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductScreenSection
          headline="Unify your intelligence into a singular location."
          placeholderLabel="AURA OS workspace overview"
          imageSrc="/product-screens/aura-os-workspace.png"
          imageAlt="AURA OS workspace showing a chat panel, agent list, and terminal"
        />
        <ProductScreenSection
          headline="Private. Secure. Open Source."
          description="Secure your intellectual property and knowledge without giving it away to the primary model companies."
          centered
          showMedia={false}
        />
        <ChangelogPreview />
        <ProductCallToAction href="/download" label="DOWNLOAD" />
      </main>
      <StandardFooter />
    </>
  );
}

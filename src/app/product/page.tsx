import { ChangelogPreview } from '@/components/ChangelogPreview/ChangelogPreview';
import {
  CodeIcon,
  FeaturePanel,
  LockIcon,
  ShieldIcon,
} from '@/components/FeaturePanel/FeaturePanel';
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
          description="AURA enables you to train, hire and deploy agents to build fully autonomous products and companies."
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
          headline="Command swarms of powerful agents from anywhere."
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
        <FeaturePanel
          label="SOVEREIGN"
          headline="Private by Design."
          features={[
            {
              icon: <LockIcon />,
              title: 'Private',
              description:
                'AURA does not view or train on your personal or corporate data. Data sent to frontier model providers is not directly identifiable.',
            },
            {
              icon: <ShieldIcon />,
              title: 'Secure',
              description:
                'The AURA harness and kernel is built from the ground up with security, verification and policy enforcement as first class citizens.',
            },
            {
              icon: <CodeIcon />,
              title: 'Open Source',
              description:
                'AURA is 100% open source under the MIT license. Fork it at anytime with zero vendor lock-in.',
            },
          ]}
        />
        <ChangelogPreview />
        <ProductCallToAction href="/download" label="DOWNLOAD" />
      </main>
      <StandardFooter />
    </>
  );
}

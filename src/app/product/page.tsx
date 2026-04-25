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
          headline={
            <>
              The
              <br />
              Open Intelligence
              <br />
              Network
            </>
          }
          description="AURA enables you to train, hire and deploy agents to build fully autonomous products and companies."
          preview={null}
        />
        <ProductScreenSection
          headline="A secure operating system to manage agentic swarms."
          placeholderLabel="AURA desktop interface"
          imageSrc="/product-screens/aura-product-screen-desktop.png"
          imageAlt="AURA desktop interface showing an operating system workspace"
        />
        <ProductScreenSection
          headline="Spawn a team of agents that run your company while you sleep."
          placeholderLabel="AURA agents interface"
          imageSrc="/product-screens/aura-product-screen-superagent.png"
          imageAlt="AURA agents interface showing autonomous agents"
        />
        <ProductScreenSection
          headline="Ship complex software that improves autonomously."
          placeholderLabel="AURA software automation interface"
          imageSrc="/product-screens/aura-product-screen-automation.png"
          imageAlt="AURA software automation interface showing autonomous development workflows"
        />
        <ProductScreenSection
          headline="Deploy agentic processes for every workflow."
          placeholderLabel="AURA process interface"
          imageSrc="/product-screens/aura-product-screen-process.png"
          imageAlt="AURA process interface showing agentic workflow processes"
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

'use client';

import { type ReactNode, useState } from 'react';
import { Check } from 'lucide-react';

import { AppLink } from '@/components/AppLink/AppLink';
import { Navbar } from '@/components/Navbar/Navbar';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import '../resources/pricing/PricingPage.css';

type BillingCycle = 'monthly' | 'yearly';

type Plan = {
  readonly name: string;
  readonly monthlyPrice: string;
  readonly yearlyPrice: string;
  readonly description: string;
  readonly features: readonly ReactNode[];
  readonly ctaLabel: string;
  readonly href: string;
  readonly recommended?: boolean;
};

const PLANS: readonly Plan[] = [
  {
    name: 'Mortal',
    monthlyPrice: 'Free',
    yearlyPrice: 'Free',
    description: 'Includes:',
    features: [
      'No credit card required',
      'Local open source models',
      'Pay-as-you-go for frontier models',
    ],
    ctaLabel: 'Download',
    href: '/download',
  },
  {
    name: 'Pro',
    monthlyPrice: '$20',
    yearlyPrice: '$192',
    description: 'Everything in Mortal, plus:',
    features: [
      '$20 worth of monthly credits',
      'Remote agents',
    ],
    ctaLabel: 'Download',
    href: '/download',
  },
  {
    name: 'Crusader',
    monthlyPrice: '$60',
    yearlyPrice: '$576',
    description: 'Everything in Pro, plus:',
    features: [
      '3x the amount of credits for frontier models',
    ],
    ctaLabel: 'Download',
    href: '/download',
    recommended: true,
  },
  {
    name: 'Sage',
    monthlyPrice: '$200',
    yearlyPrice: '$1,920',
    description: 'Everything in Crusader, plus:',
    features: [
      '20x usage on frontier models',
      'Priority access to new features',
    ],
    ctaLabel: 'Download',
    href: '/download',
  },
] as const;

export default function PricingPage(): ReactNode {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const cadenceLabel = billingCycle === 'monthly' ? '/mo.' : '/yr.';
  const [freePlan, ...paidPlans] = PLANS;

  return (
    <>
      <Navbar />
      <main className="scrollPageMain">
        <section className="pricingPage">
          <div className="pricingPageContent">
            <header className="pricingPageHeader">
              <h1 className="pricingPageTitle">Pricing</h1>
              <div className="pricingToggle" role="tablist" aria-label="Billing cycle">
                <button
                  type="button"
                  role="tab"
                  aria-selected={billingCycle === 'monthly'}
                  className={`pricingToggleButton${billingCycle === 'monthly' ? ' pricingToggleButtonActive' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={billingCycle === 'yearly'}
                  className={`pricingToggleButton${billingCycle === 'yearly' ? ' pricingToggleButtonActive' : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                </button>
              </div>
            </header>

            <div className="pricingPlansSection">
              <p className="pricingPlansLabel">Individual Plans</p>
              <div className="pricingPlansStack">
                <article className="pricingPlanCard pricingPlanCardFullWidth">
                  <div className="pricingPlanBody">
                    <div className="pricingPlanHeading">
                      <div className="pricingPlanTitleRow">
                        <h2 className="pricingPlanTitle">{freePlan.name}</h2>
                      </div>
                      <p className="pricingPlanPrice">
                        <span className="pricingPlanPriceValue">{freePlan.monthlyPrice}</span>
                      </p>
                    </div>

                    <div className="pricingPlanIncludesBlock">
                      <p className="pricingPlanDescription">{freePlan.description}</p>
                      <ul className="pricingPlanFeatureList pricingPlanFeatureListInline">
                        {freePlan.features.map((feature, index) => (
                          <li key={`${freePlan.name}-${index}`} className="pricingPlanFeature">
                            <Check size={15} strokeWidth={2} className="pricingPlanFeatureIcon" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <AppLink href={freePlan.href} className="pricingPlanButton">
                    {freePlan.ctaLabel}
                  </AppLink>
                </article>

                <div className="pricingPlansGrid">
                  {paidPlans.map((plan) => {
                    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

                    return (
                      <article
                        key={plan.name}
                        className={`pricingPlanCard${plan.recommended ? ' pricingPlanCardRecommended' : ''}`}
                      >
                        <div className="pricingPlanBody">
                          <div className="pricingPlanHeading">
                            <div className="pricingPlanTitleRow">
                              <h2 className="pricingPlanTitle">{plan.name}</h2>
                            </div>
                            <p className="pricingPlanPrice">
                              <span className="pricingPlanPriceValue">{price}</span>
                              {price !== 'Free' && <span className="pricingPlanPriceCadence">{cadenceLabel}</span>}
                            </p>
                            <p className="pricingPlanDescription">{plan.description}</p>
                          </div>

                          <ul className="pricingPlanFeatureList">
                            {plan.features.map((feature, index) => (
                              <li key={`${plan.name}-${index}`} className="pricingPlanFeature">
                                <Check size={15} strokeWidth={2} className="pricingPlanFeatureIcon" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <AppLink
                          href={plan.href}
                          className={`pricingPlanButton${plan.recommended ? ' pricingPlanButtonPrimary' : ''}`}
                        >
                          {plan.ctaLabel}
                        </AppLink>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}

'use client';

import { Text } from '@cypher-asi/zui';
import './Hero.css';

const TOOL_ICONS = ['Bi', 'Ox', 'ES', 'TS', 'Cr'] as const;

export function Hero(): React.ReactNode {
  return (
    <section className="hero">
      <div className="heroGlow" />
      <div className="heroContent">
        <h1 className="heroHeadline">
          A production-grade, zero-configuration preset for{' '}
          <span className="heroIcons">
            {TOOL_ICONS.map((icon) => (
              <span key={icon} className="heroIconDot">
                {icon}
              </span>
            ))}
          </span>
        </h1>
        <Text variant="secondary" size="base" align="center" className="heroSubtitle">
          Aura is a highly opinionated preset for ESLint, Biome and Oxlint;
          designed to help you and your AI models write consistent and type-safe
          code without the hassle of configuration.
        </Text>
      </div>
    </section>
  );
}

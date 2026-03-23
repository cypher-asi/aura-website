'use client';

import './Hero.css';

export function Hero(): React.ReactNode {
  return (
    <section className="hero">
      <div className="heroContent">
        <h1 className="heroHeadline">
          Zero-config linting, formatting and tooling for your codebase
        </h1>
        <div className="heroSubRow">
          <p className="heroSubtitle">
            Production-grade presets for ESLint, Biome and Oxlint. Designed for teams and AI agents.
          </p>
          <div className="heroBadges">
            <span className="heroBadge">New</span>
            <a href="#docs" className="heroBadgeLink">
              Read the docs &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Github } from 'lucide-react';
import { AppLink } from '@/components/AppLink/AppLink';
import './StandardFooter.css';

function XIcon(): React.ReactNode {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function StandardFooter(): React.ReactNode {
  return (
    <footer className="standardFooter">
      <div className="standardFooterInner">
        <div className="standardFooterSide" aria-hidden="true" />
        <a
          href="https://cypher.net"
          target="_blank"
          rel="noopener noreferrer"
          className="standardFooterProjectLink"
        >
          A CYPHER PROJECT
        </a>
        <AppLink href="/" className="standardFooterLogoLink" aria-label="AURA home">
          <img src="/aura-logo.png" alt="AURA" className="standardFooterLogo" />
        </AppLink>
        <div className="standardFooterLinks" aria-label="Social links">
          <a href="https://x.com/aura_asi" target="_blank" rel="noopener noreferrer" className="standardFooterLink" aria-label="X">
            <XIcon />
          </a>
          <a href="https://github.com/cypher-asi/" target="_blank" rel="noopener noreferrer" className="standardFooterLink" aria-label="GitHub">
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { getDownloadPath } from '@/config/downloadTargets';
import { ButtonFUI } from '../ButtonFUI/ButtonFUI';
import { SocialLinks } from '../SocialLinks/SocialLinks';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Product', href: '/products/aura-os' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Pricing', href: '/pricing' },
] as const;

const MOBILE_NAV_ID = 'site-mobile-nav';

export function Navbar(): React.ReactNode {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const closeMobileMenu = useCallback((): void => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback((): void => {
    setMobileMenuOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.classList.remove('mobileMenuOpen');
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.body.classList.add('mobileMenuOpen');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('mobileMenuOpen');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const updateScrollState = (): void => {
      setHasScrolled(window.scrollY > 12);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  return (
    <header className={`navbar ${hasScrolled ? 'navbarScrolled' : ''}`}>
      <nav className="navbarInner" aria-label="Primary">
        <Link href="/" className="logoLink">
          <img src="/aura-logo.png" alt="AURA" className="titleLogo" />
        </Link>
        <ul className="navLinks">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link href={href} className="navLink">{label}</Link>
            </li>
          ))}
        </ul>
        <div className="navActions">
          <SocialLinks variant="navbar" />
          <ButtonFUI href={getDownloadPath()}>
            Download
          </ButtonFUI>
          <button
            type="button"
            className="mobileMenuToggle"
            aria-expanded={mobileMenuOpen}
            aria-controls={MOBILE_NAV_ID}
            aria-label={mobileMenuOpen ? 'Close site navigation' : 'Open site navigation'}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
          </button>
        </div>
      </nav>
      <div
        id={MOBILE_NAV_ID}
        className={`mobileNavPanel ${mobileMenuOpen ? 'mobileNavPanelOpen' : ''}`}
        aria-hidden={!mobileMenuOpen}
        role="dialog"
        aria-modal="true"
      >
        <div className="mobileNavPanelInner">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="mobileNavLink" onClick={closeMobileMenu}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { AppLink } from '@/components/AppLink/AppLink';
import { getDownloadPath } from '@/config/downloadTargets';
import { ENABLE_PRODUCT_PAGE } from '@/config/features';
import { ButtonFUI } from '../ButtonFUI/ButtonFUI';
import { SocialLinks } from '../SocialLinks/SocialLinks';
import './Navbar.css';

const ALL_NAV_LINKS = [
  { label: 'Product', href: '/product', flag: ENABLE_PRODUCT_PAGE },
  { label: 'Changelog', href: '/changelog', flag: true },
  { label: 'Pricing', href: '/pricing', flag: true },
] as const;

const NAV_LINKS = ALL_NAV_LINKS.filter(({ flag }) => flag);

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
      const scrollTop = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      );

      setHasScrolled(scrollTop > 12);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    document.addEventListener('scroll', updateScrollState, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      document.removeEventListener('scroll', updateScrollState, true);
    };
  }, []);

  return (
    <header className={`navbar ${hasScrolled && !mobileMenuOpen ? 'navbarScrolled' : ''} ${mobileMenuOpen ? 'navbarMenuOpen' : ''}`}>
      <nav className="navbarInner" aria-label="Primary">
        <AppLink href="/" className="logoLink">
          <img src="/aura-logo.png" alt="AURA" className="titleLogo" />
        </AppLink>
        <ul className="navLinks">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <AppLink href={href} className="navLink">{label}</AppLink>
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
        <button
          type="button"
          className="mobileNavClose"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
        >
          <X size={20} strokeWidth={1.8} />
        </button>
        <div className="mobileNavPanelInner">
          {NAV_LINKS.map(({ label, href }) => (
            <AppLink key={label} href={href} className="mobileNavLink" onClick={closeMobileMenu}>
              {label}
            </AppLink>
          ))}
        </div>
      </div>
    </header>
  );
}

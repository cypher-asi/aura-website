'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

import { getDownloadPath } from '@/config/downloadTargets';
import { ENABLE_TOP_NAV } from '@/config/features';
import { ButtonFUI } from '../ButtonFUI/ButtonFUI';
import { NavDropdown } from '../NavDropdown/NavDropdown';
import { SocialLinks } from '../SocialLinks/SocialLinks';
import './Navbar.css';

const PRODUCT_ITEMS = [
  { label: 'AURA OS', description: 'A modern agent orchestration system', href: '/products/aura-os' },
  { label: 'AURA 3D', description: 'A generative system for building 3D assets', href: '/products/aura-3d' },
  { label: 'ORBIT', description: 'A source code repository for agents', href: '/products/orbit' },
] as const;

const RESOURCE_ITEMS = [
  { label: 'Pricing', description: 'Token-based and subscription', href: '/resources/pricing' },
  { label: 'Docs', description: 'Machine and human docs', href: 'https://docs.aura.ai', external: true },
] as const;

type DropdownKey = 'products' | 'resources';

const NAV_LINKS = [
  { label: 'Products', href: '/products/aura-os', dropdownKey: 'products' as DropdownKey },
  { label: 'Agents', href: '/agents', dropdownKey: null },
  { label: 'Network', href: '/network', dropdownKey: null },
  { label: 'Resources', href: '/resources/pricing', dropdownKey: 'resources' as DropdownKey },
] as const;

const DROPDOWN_ITEMS: Record<DropdownKey, readonly { readonly label: string; readonly description: string; readonly href: string; readonly external?: boolean }[]> = {
  products: PRODUCT_ITEMS,
  resources: RESOURCE_ITEMS,
};

const HOVER_CLOSE_DELAY = 150;
const MOBILE_NAV_ID = 'site-mobile-nav';

export function Navbar(): React.ReactNode {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<DropdownKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((key: DropdownKey): void => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDropdown(key);
  }, []);

  const handleLeave = useCallback((): void => {
    closeTimer.current = setTimeout(() => {
      setOpenDropdown(null);
      closeTimer.current = null;
    }, HOVER_CLOSE_DELAY);
  }, []);

  const closeMobileMenu = useCallback((): void => {
    setMobileMenuOpen(false);
    setMobileExpandedSection(null);
  }, []);

  const toggleMobileMenu = useCallback((): void => {
    setMobileMenuOpen((current) => !current);
  }, []);

  const toggleMobileSection = useCallback((key: DropdownKey): void => {
    setMobileExpandedSection((current) => (current === key ? null : key));
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileExpandedSection(null);
    }
  }, [mobileMenuOpen]);

  return (
    <header className="navbar">
      <nav className="navbarInner" aria-label="Primary">
        <Link href="/">
          <img src="/aura-logo.png" alt="AURA" className="titleLogo" />
        </Link>
        {ENABLE_TOP_NAV && (
          <ul className="navLinks">
            {NAV_LINKS.map(({ label, href, dropdownKey }) => (
              <li
                key={label}
                className={dropdownKey ? 'navLinkWithDropdown' : undefined}
                onMouseEnter={dropdownKey ? () => handleEnter(dropdownKey) : undefined}
                onMouseLeave={dropdownKey ? handleLeave : undefined}
              >
                <Link href={href} className="navLink">{label}</Link>
                {dropdownKey && (
                  <div className={`navDropdownWrapper ${openDropdown === dropdownKey ? 'navDropdownVisible' : ''}`}>
                    <NavDropdown items={DROPDOWN_ITEMS[dropdownKey]} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="navActions">
          <SocialLinks variant="navbar" />
          <ButtonFUI href={getDownloadPath()}>
            Download
          </ButtonFUI>
          {ENABLE_TOP_NAV && (
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
          )}
        </div>
      </nav>
      {ENABLE_TOP_NAV && (
        <div
          id={MOBILE_NAV_ID}
          className={`mobileNavPanel ${mobileMenuOpen ? 'mobileNavPanelOpen' : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="mobileNavPanelInner">
            {NAV_LINKS.map(({ label, href, dropdownKey }) =>
              dropdownKey ? (
                <div key={label} className="mobileNavSection">
                  <button
                    type="button"
                    className="mobileNavSectionToggle"
                    aria-expanded={mobileExpandedSection === dropdownKey}
                    onClick={() => toggleMobileSection(dropdownKey)}
                  >
                    <span>{label}</span>
                    {mobileExpandedSection === dropdownKey ? (
                      <ChevronUp size={16} strokeWidth={1.8} className="mobileNavSectionIcon" />
                    ) : (
                      <ChevronDown size={16} strokeWidth={1.8} className="mobileNavSectionIcon" />
                    )}
                  </button>
                  <div
                    className={`mobileNavSectionLinks ${
                      mobileExpandedSection === dropdownKey ? 'mobileNavSectionLinksOpen' : ''
                    }`}
                  >
                    {DROPDOWN_ITEMS[dropdownKey].map(({ label: itemLabel, description, href: itemHref, external }) =>
                      external ? (
                        <a
                          key={itemLabel}
                          href={itemHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mobileNavSublink"
                          onClick={closeMobileMenu}
                        >
                          <span className="mobileNavSublinkLabel">{itemLabel}</span>
                          <span className="mobileNavSublinkDescription">{description}</span>
                        </a>
                      ) : (
                        <Link
                          key={itemLabel}
                          href={itemHref}
                          className="mobileNavSublink"
                          onClick={closeMobileMenu}
                        >
                          <span className="mobileNavSublinkLabel">{itemLabel}</span>
                          <span className="mobileNavSublinkDescription">{description}</span>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <Link key={label} href={href} className="mobileNavLink" onClick={closeMobileMenu}>
                  {label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </header>
  );
}

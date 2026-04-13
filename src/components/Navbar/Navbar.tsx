'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';

import { ENABLE_TOP_NAV } from '@/config/features';
import { ButtonFUI } from '../ButtonFUI/ButtonFUI';
import { NavDropdown } from '../NavDropdown/NavDropdown';
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

export function Navbar(): React.ReactNode {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
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

  return (
    <header className="navbar">
      <nav className="navbarInner">
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
          <ButtonFUI>
            Download
          </ButtonFUI>
        </div>
      </nav>
    </header>
  );
}

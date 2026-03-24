'use client';

import { useCallback, useRef, useState } from 'react';

import { ButtonFUI } from '../ButtonFUI/ButtonFUI';
import { NavDropdown } from '../NavDropdown/NavDropdown';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Products', href: '#products', hasDropdown: true },
  { label: 'Agents', href: '#agents', hasDropdown: false },
  { label: 'Network', href: '#network', hasDropdown: false },
  { label: 'Resources', href: '#resources', hasDropdown: false },
] as const;

const HOVER_CLOSE_DELAY = 150;

export function Navbar(): React.ReactNode {
  const [productsOpen, setProductsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((): void => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setProductsOpen(true);
  }, []);

  const handleLeave = useCallback((): void => {
    closeTimer.current = setTimeout(() => {
      setProductsOpen(false);
      closeTimer.current = null;
    }, HOVER_CLOSE_DELAY);
  }, []);

  return (
    <header className="navbar">
      <nav className="navbarInner">
        <img src="/aura-logo.png" alt="AURA" className="titleLogo" />
        <ul className="navLinks">
          {NAV_LINKS.map(({ label, href, hasDropdown }) => (
            <li
              key={label}
              className={hasDropdown ? 'navLinkWithDropdown' : undefined}
              onMouseEnter={hasDropdown ? handleEnter : undefined}
              onMouseLeave={hasDropdown ? handleLeave : undefined}
            >
              <a href={href} className="navLink">{label}</a>
              {hasDropdown && (
                <div className={`navDropdownWrapper ${productsOpen ? 'navDropdownVisible' : ''}`}>
                  <NavDropdown />
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="navActions">
          <ButtonFUI>
            Download
          </ButtonFUI>
        </div>
      </nav>
    </header>
  );
}

'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@cypher-asi/zui';
import './Navbar.css';

interface NavItem {
  readonly label: string;
  readonly hasDropdown: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Providers', hasDropdown: true },
  { label: 'Editors', hasDropdown: true },
  { label: 'Agents', hasDropdown: true },
] as const;

export function Navbar(): React.ReactNode {
  return (
    <nav className="navbar">
      <div className="navbarLeft">
        <div className="logo">
          <span className="logoIcon">A</span>
          Aura
        </div>
        <div className="navLinks">
          {NAV_ITEMS.map((item) => (
            <button key={item.label} className="navLink" type="button">
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="navLinkChevron" size={12} />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="navbarRight">
        <span className="socialLink">Social</span>
        <Button variant="primary" size="sm" rounded="full">
          Read the docs
        </Button>
      </div>
    </nav>
  );
}

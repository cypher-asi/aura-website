import { Download } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'Agents', href: '#agents' },
  { label: 'Network', href: '#network' },
  { label: 'Pricing', href: '#pricing' },
] as const;

export function Navbar(): React.ReactNode {
  return (
    <header className="navbar">
      <nav className="navbarInner">
        <img src="/aura-logo.png" alt="AURA" className="titleLogo" />
        <ul className="navLinks">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className="navLink">{label}</a>
            </li>
          ))}
        </ul>
        <div className="navActions">
          <a href="#docs" className="docsLink">Docs</a>
          <button type="button" className="downloadButton">
            Download
            <Download size={14} strokeWidth={2.5} />
          </button>
        </div>
      </nav>
    </header>
  );
}

import Link from 'next/link';
import './NavDropdown.css';

interface NavDropdownItem {
  readonly label: string;
  readonly description: string;
  readonly href: string;
  readonly external?: boolean;
}

interface NavDropdownProps {
  readonly items: readonly NavDropdownItem[];
}

export function NavDropdown({ items }: NavDropdownProps): React.ReactNode {
  return (
    <div className="navDropdown">
      <div className="navDropdownGrid">
        {items.map(({ label, description, href, external }) =>
          external ? (
            <a key={label} href={href} className="navDropdownItem" target="_blank" rel="noopener noreferrer">
              <span className="navDropdownLabel">{label}</span>
              <span className="navDropdownDescription">{description}</span>
            </a>
          ) : (
            <Link key={label} href={href} className="navDropdownItem">
              <span className="navDropdownLabel">{label}</span>
              <span className="navDropdownDescription">{description}</span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

import './NavDropdown.css';

const NAV_PRODUCTS = [
  { label: 'AURA OS', description: 'A modern agent orchestration system', href: '#aura-os' },
  { label: 'AURA 3D', description: 'A generative system for building 3D assets', href: '#aura-3d' },
  { label: 'ORBIT', description: 'A light-weight source code repository for agents', href: '#orbit' },
] as const;

export function NavDropdown(): React.ReactNode {
  return (
    <div className="navDropdown">
      <div className="navDropdownGrid">
        {NAV_PRODUCTS.map(({ label, description, href }) => (
          <a key={label} href={href} className="navDropdownItem">
            <span className="navDropdownLabel">{label}</span>
            <span className="navDropdownDescription">{description}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

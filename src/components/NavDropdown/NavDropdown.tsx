import './NavDropdown.css';

const NAV_PRODUCTS = [
  { label: 'Intake', description: 'Make your product operations self-driving', href: '#intake' },
  { label: 'Build', description: 'Move work forward across teams and agents', href: '#build' },
  { label: 'Monitor', description: 'Understand progress at scale', href: '#monitor' },
  { label: 'Plan', description: 'Plan and navigate from idea to launch', href: '#plan' },
  { label: 'Diffs', description: 'Make code review effortless', href: '#diffs' },
  { label: 'Integrations', description: 'Collaborate across tools', href: '#integrations' },
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

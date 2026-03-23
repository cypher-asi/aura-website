import './LogoBar.css';

const LOGOS = [
  'ESLint',
  'Biome',
  'Oxlint',
  'TypeScript',
  'Cursor',
  'Windsurf',
  'Claude',
  'Next.js',
] as const;

export function LogoBar(): React.ReactNode {
  return (
    <div className="logoBar">
      <div className="logoBarInner">
        {LOGOS.map((name) => (
          <span key={name} className="logoItem">{name}</span>
        ))}
      </div>
    </div>
  );
}

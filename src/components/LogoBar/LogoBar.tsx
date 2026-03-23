import './LogoBar.css';

const LOGOS = [
  'OpenAI',
  'Anthropic',
  'DeepSeek',
  'Google',
  'Meta',
  'xAI',
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

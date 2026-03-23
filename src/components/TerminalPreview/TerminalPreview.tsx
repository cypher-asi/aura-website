import './TerminalPreview.css';

interface TerminalLineProps {
  readonly children: React.ReactNode;
}

function TerminalLine({ children }: TerminalLineProps): React.ReactNode {
  return <span className="terminalLine">{children}</span>;
}

export function TerminalPreview(): React.ReactNode {
  return (
    <div className="terminalWrapper">
      <div className="terminal">
        <div className="terminalChrome">
          <div className="terminalDots">
            <span className="terminalDot" />
            <span className="terminalDot" />
            <span className="terminalDot" />
          </div>
          <span className="terminalTitle">Terminal</span>
        </div>
        <div className="terminalBody">
          <TerminalLine>
            <span className="terminalPrompt">$ </span>
            <span className="terminalCommand">bun x aura@latest init</span>
          </TerminalLine>
          <TerminalLine>&nbsp;</TerminalLine>
          <TerminalLine>
            <span className="terminalBullet">● </span>
            Detected lockfile, using <span className="terminalHighlight">bun</span>
          </TerminalLine>
          <TerminalLine>&nbsp;</TerminalLine>

          <TerminalLine>
            <span className="terminalQuestion">◇ Which formatters / linters do you want to use?</span>
          </TerminalLine>
          <TerminalLine>
            <span className="terminalSelection">│ Biome</span>
          </TerminalLine>
          <TerminalLine>&nbsp;</TerminalLine>

          <TerminalLine>
            <span className="terminalQuestion">◇ Which frameworks are you using?</span>
          </TerminalLine>
          <TerminalLine>
            <span className="terminalSelection">│ React, Next.js</span>
          </TerminalLine>
          <TerminalLine>&nbsp;</TerminalLine>

          <TerminalLine>
            <span className="terminalQuestion">◇ Which editors do you want to configure?</span>
          </TerminalLine>
          <TerminalLine>
            <span className="terminalSelection">│ VSCode / Cursor / Windsurf</span>
          </TerminalLine>
          <TerminalLine>&nbsp;</TerminalLine>

          <TerminalLine>
            <span className="terminalQuestion">◇ Which agents do you want to enable?</span>
          </TerminalLine>
          <TerminalLine>
            <span className="terminalSelection">│ Cursor, Claude Code</span>
          </TerminalLine>
          <TerminalLine>&nbsp;</TerminalLine>

          <TerminalLine>
            <span className="terminalQuestion">◇ Which agent hooks do you want to enable?</span>
          </TerminalLine>
          <TerminalLine>
            <span className="terminalSelection">│ Cursor, Claude Code</span>
          </TerminalLine>
          <TerminalLine>&nbsp;</TerminalLine>

          <TerminalLine>
            <span className="terminalBullet">● </span>
            Would you like any of the following Git hooks?
          </TerminalLine>
          <TerminalLine>
            <span className="terminalCheckbox">  ☐ </span>
            <span className="terminalOption">Husky</span>
          </TerminalLine>
          <TerminalLine>
            <span className="terminalCheckbox">  ☐ </span>
            <span className="terminalOption">Lefthook</span>
          </TerminalLine>
        </div>
      </div>
    </div>
  );
}

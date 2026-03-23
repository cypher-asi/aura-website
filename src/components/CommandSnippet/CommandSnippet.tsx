'use client';

import { ButtonCopy } from '@cypher-asi/zui';
import './CommandSnippet.css';

const INSTALL_COMMAND = 'npx aura@latest init';

export function CommandSnippet(): React.ReactNode {
  return (
    <div className="commandRow">
      <div className="commandPill">
        <span className="commandPrefix">$</span>
        <span>{INSTALL_COMMAND}</span>
        <ButtonCopy text={INSTALL_COMMAND} variant="ghost" size="sm" />
      </div>
      <a href="#docs" className="docsLink">
        Read the docs
      </a>
    </div>
  );
}

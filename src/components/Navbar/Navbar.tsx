'use client';

import { Topbar, Button } from '@cypher-asi/zui';
import './Navbar.css';

export function Navbar(): React.ReactNode {
  return (
    <Topbar
      className="navbar"
      title={<span className="titleCenter">AURA</span>}
      actions={
        <Button variant="primary" size="sm" className="downloadButton">
          Download
        </Button>
      }
    />
  );
}

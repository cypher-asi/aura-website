'use client';

import { useEffect, useState } from 'react';
import './Taskbar.css';

function IconNetwork(): React.ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function Taskbar(): React.ReactNode {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const ms = (60 - new Date().getSeconds()) * 1000;
    const timeout = setTimeout(() => {
      setTime(formatTime());
      const interval = setInterval(() => setTime(formatTime()), 60_000);
      return () => clearInterval(interval);
    }, ms);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="taskbar">
      <span className="taskbarLabel"><span className="taskbarSlash">/</span>CYPHER</span>
      <div className="taskbarRight">
        <span className="taskbarNetworkIcon"><IconNetwork /></span>
        <span className="taskbarClock">{time}</span>
      </div>
    </div>
  );
}

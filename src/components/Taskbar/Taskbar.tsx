'use client';

import { useEffect, useState } from 'react';
import './Taskbar.css';

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
        <span className="taskbarClock">{time}</span>
      </div>
    </div>
  );
}

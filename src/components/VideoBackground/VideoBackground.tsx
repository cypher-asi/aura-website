'use client';

import './VideoBackground.css';

export function VideoBackground(): React.ReactNode {
  return (
    <div className="videoBackground">
      <video
        className="videoBackgroundVideo"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/AURA_visual_loop.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

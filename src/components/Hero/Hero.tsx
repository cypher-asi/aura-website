'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import './Hero.css';

const ROTATING_WORDS = [
  'workforce',
  'team',
  'swarm',
  'network',
  'company',
  'project',
  'startup',
  'DAO',
];

const TYPE_SPEED = 80;
const DELETE_SPEED = 50;
const PAUSE_BEFORE_DELETE = 2000;
const PAUSE_BEFORE_TYPE = 300;

export function Hero(): React.ReactNode {
  const [displayed, setDisplayed] = useState(ROTATING_WORDS[0]);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const typeWord = useCallback((word: string, charIndex: number) => {
    if (charIndex <= word.length) {
      setDisplayed(word.slice(0, charIndex));
      timeoutRef.current = setTimeout(() => typeWord(word, charIndex + 1), TYPE_SPEED);
    } else {
      timeoutRef.current = setTimeout(() => deleteWord(word, word.length), PAUSE_BEFORE_DELETE);
    }
  }, []);

  const deleteWord = useCallback((word: string, charIndex: number) => {
    if (charIndex >= 0) {
      setDisplayed(word.slice(0, charIndex));
      timeoutRef.current = setTimeout(() => deleteWord(word, charIndex - 1), DELETE_SPEED);
    } else {
      indexRef.current = (indexRef.current + 1) % ROTATING_WORDS.length;
      const next = ROTATING_WORDS[indexRef.current];
      timeoutRef.current = setTimeout(() => typeWord(next, 1), PAUSE_BEFORE_TYPE);
    }
  }, [typeWord]);

  useEffect(() => {
    timeoutRef.current = setTimeout(
      () => deleteWord(ROTATING_WORDS[0], ROTATING_WORDS[0].length),
      PAUSE_BEFORE_DELETE,
    );
    return () => clearTimeout(timeoutRef.current);
  }, [deleteWord]);

  return (
    <section className="hero">
      <div className="heroContent">
        <h1 className="heroHeadline">
          Create a{' '}
          <span className="heroRotatingWord">
            {displayed}
            <span className="heroTypewriterCursor" />
          </span>
          <br />
          of agents in minutes.
        </h1>
        <div className="heroSubRow">
          <p className="heroSubtitle">
            A workforce network for super-intelligence machines.
          </p>
          <div className="heroBadges">
            <span className="heroBadge">New</span>
            <a href="#docs" className="heroBadgeLink">
              Read the docs &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

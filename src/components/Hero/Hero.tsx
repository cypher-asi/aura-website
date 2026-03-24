'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonAction } from '@/components/ButtonAction/ButtonAction';
import './Hero.css';

const ROTATING_WORDS = [
  'workforce',
  'team',
  'swarm',
  'network',
  'fleet',
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
          <ButtonAction
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1v9m0 0L4.5 6.5M8 10l3.5-3.5M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            Download for Windows
          </ButtonAction>
        </div>
      </div>
    </section>
  );
}

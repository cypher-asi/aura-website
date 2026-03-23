'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button, type ButtonVariant, type ButtonSize } from '@/components/Button/Button';
import clsx from 'clsx';
import './ButtonCopy.css';

export interface ButtonCopyProps {
  text: string;
  onCopy?: () => void;
  title?: string;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  feedbackDuration?: number;
}

export function ButtonCopy({
  text,
  onCopy,
  title = 'Copy',
  disabled = false,
  size = 'sm',
  variant = 'ghost',
  className,
  feedbackDuration = 2000,
}: ButtonCopyProps) {
  const iconSize = size === 'sm' ? 12 : 14;
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), feedbackDuration);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [text, onCopy, feedbackDuration]);

  return (
    <Button
      variant={variant}
      size={size}
      iconOnly
      onClick={handleClick}
      disabled={disabled}
      title={copied ? 'Copied!' : title}
      className={clsx(copied && 'btnCopyCopied', className)}
    >
      {copied ? (
        <Check size={iconSize} strokeWidth={2} className="btnCopyIcon" />
      ) : (
        <Copy size={iconSize} strokeWidth={2} className="btnCopyIcon" />
      )}
    </Button>
  );
}

ButtonCopy.displayName = 'ButtonCopy';

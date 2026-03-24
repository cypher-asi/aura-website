import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './ButtonAction.css';

interface ButtonActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly size?: 'sm' | 'md';
  readonly icon?: ReactNode;
}

export function ButtonAction({
  size = 'md',
  icon,
  className,
  children,
  ...props
}: ButtonActionProps): ReactNode {
  return (
    <button
      type="button"
      className={clsx(
        'sciFiButton',
        size === 'sm' ? 'sciFiButtonSm' : 'sciFiButtonMd',
        className,
      )}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}

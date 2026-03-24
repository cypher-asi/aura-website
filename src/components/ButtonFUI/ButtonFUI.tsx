import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './ButtonFUI.css';

interface ButtonFUIProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly icon?: ReactNode;
}

export function ButtonFUI({
  icon,
  className,
  children,
  ...props
}: ButtonFUIProps): ReactNode {
  return (
    <button
      type="button"
      className={clsx('buttonFUI', className)}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}

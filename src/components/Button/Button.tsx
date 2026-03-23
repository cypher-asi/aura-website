import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type CSSProperties,
} from 'react';
import clsx from 'clsx';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'filled' | 'glass' | 'transparent';
export type ButtonSize = 'sm' | 'md';
export type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ButtonTextCase = 'none' | 'capitalize' | 'uppercase';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btnPrimary',
  secondary: 'btnSecondary',
  ghost: 'btnGhost',
  danger: 'btnDanger',
  filled: 'btnFilled',
  glass: 'btnGlass',
  transparent: 'btnTransparent',
};

const ROUNDED_CLASS: Record<Exclude<ButtonRounded, 'md'>, string> = {
  none: 'btnRoundedNone',
  sm: 'btnRoundedSm',
  lg: 'btnRoundedLg',
  full: 'btnRoundedFull',
};

const TEXT_CASE_CLASS: Record<Exclude<ButtonTextCase, 'none'>, string> = {
  capitalize: 'btnCapitalize',
  uppercase: 'btnUppercase',
};

type ButtonAsButton = {
  as?: 'button';
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsSpan = {
  as: 'span';
} & HTMLAttributes<HTMLSpanElement>;

export type ButtonProps = (ButtonAsButton | ButtonAsSpan) & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  textCase?: ButtonTextCase;
  iconOnly?: boolean;
  icon?: ReactNode;
  selected?: boolean;
  selectedBgColor?: string;
  contentStates?: ReactNode[];
};

export const Button = forwardRef<HTMLButtonElement | HTMLSpanElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      rounded = 'md',
      textCase = 'none',
      iconOnly = false,
      icon,
      selected = false,
      selectedBgColor,
      className,
      as = 'button',
      contentStates,
      children,
      ...props
    },
    ref
  ) => {
    const classNames = clsx(
      'btn',
      VARIANT_CLASS[variant],
      size === 'sm' && 'btnSm',
      rounded !== 'md' && ROUNDED_CLASS[rounded],
      textCase !== 'none' && TEXT_CASE_CLASS[textCase],
      iconOnly && 'btnIconOnly',
      selected && 'btnSelected',
      contentStates && 'btnStableSize',
      className
    );

    const buttonStyle = selectedBgColor && selected
      ? { '--button-selected-bg': selectedBgColor } as CSSProperties
      : undefined;

    const content = contentStates ? (
      <>
        <span className="btnMeasurementContainer">
          {contentStates.map((state, index) => (
            <span key={index} className="btnMeasurementItem" aria-hidden="true">
              {icon}
              {state}
            </span>
          ))}
        </span>
        <span className="btnVisibleContent">
          {icon}
          {children}
        </span>
      </>
    ) : (
      <>
        {icon}
        {children}
      </>
    );

    if (as === 'span') {
      return (
        <span
          ref={ref as Ref<HTMLSpanElement>}
          className={classNames}
          style={buttonStyle}
          {...(props as HTMLAttributes<HTMLSpanElement>)}
        >
          {content}
        </span>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={classNames}
        style={buttonStyle}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

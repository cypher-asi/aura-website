import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './ButtonAction.css';

interface ButtonActionBaseProps {
  readonly size?: 'sm' | 'md';
  readonly icon?: ReactNode;
}

type ButtonActionButtonProps = ButtonActionBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    readonly href?: undefined;
    readonly className?: string;
    readonly children?: ReactNode;
  };

type ButtonActionLinkProps = ButtonActionBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    readonly href: string;
    readonly className?: string;
    readonly children?: ReactNode;
  };

type ButtonActionProps = ButtonActionButtonProps | ButtonActionLinkProps;

export function ButtonAction(props: ButtonActionProps): ReactNode {
  const {
    size = 'md',
    icon,
    className,
    children,
  } = props;
  const buttonClassName = clsx(
    'sciFiButton',
    size === 'sm' ? 'sciFiButtonSm' : 'sciFiButtonMd',
    className,
  );

  if ('href' in props && props.href) {
    const linkPropsSource = props as ButtonActionLinkProps;
    const {
      size: _size,
      icon: _icon,
      className: _className,
      children: _children,
      href,
      ...anchorProps
    } = linkPropsSource;

    return (
      <a href={href} className={buttonClassName} {...anchorProps}>
        {children}
        {icon}
      </a>
    );
  }

  const buttonPropsSource = props as ButtonActionButtonProps;
  const {
    size: _size,
    icon: _icon,
    className: _className,
    children: _children,
    type = 'button',
    ...buttonElementProps
  } = buttonPropsSource;

  return (
    <button
      type={type}
      className={buttonClassName}
      {...buttonElementProps}
    >
      {children}
      {icon}
    </button>
  );
}

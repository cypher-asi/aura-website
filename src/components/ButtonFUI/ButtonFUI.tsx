'use client';

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import { beginRouteTransition, shouldHandleClientNavigation } from '@/components/RouteTransition/RouteTransitionManager';
import './ButtonFUI.css';

interface ButtonFUIBaseProps {
  readonly icon?: ReactNode;
}

type ButtonFUIButtonProps = ButtonFUIBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    readonly href?: undefined;
    readonly className?: string;
    readonly children?: ReactNode;
  };

type ButtonFUILinkProps = ButtonFUIBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    readonly href: string;
    readonly className?: string;
    readonly children?: ReactNode;
  };

type ButtonFUIProps = ButtonFUIButtonProps | ButtonFUILinkProps;

export function ButtonFUI(props: ButtonFUIProps): ReactNode {
  const {
    icon,
    className,
    children,
  } = props;
  const buttonClassName = clsx('buttonFUI', className);

  if ('href' in props && props.href) {
    const linkPropsSource = props as ButtonFUILinkProps;
    const {
      icon: _icon,
      className: _className,
      children: _children,
      href,
      onClick,
      target,
      ...anchorProps
    } = linkPropsSource;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (target && target !== '_self') {
        return;
      }

      if (!shouldHandleClientNavigation(event)) {
        return;
      }

      beginRouteTransition(href);
    };

    return (
      <a href={href} className={buttonClassName} onClick={handleClick} target={target} {...anchorProps}>
        {children}
        {icon}
      </a>
    );
  }

  const buttonPropsSource = props as ButtonFUIButtonProps;
  const {
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

'use client';

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import { beginRouteTransition, shouldHandleClientNavigation } from '@/components/RouteTransition/RouteTransitionManager';
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

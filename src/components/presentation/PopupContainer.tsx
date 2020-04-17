import React, { useState, useRef, useEffect, useCallback } from 'react';
/** @jsx jsx */
import { jsx, css, keyframes, SerializedStyles } from '@emotion/core';

import { shadow } from 'styles/shadow';

export type Props = {
  popupTriger: JSX.Element;
  popup: JSX.Element;
  keep?: boolean;
  position?: 'right' | 'left';
  readonly?: boolean;
  custonCss?: SerializedStyles;
};

export const PopupContainer: React.FC<Props> = props => {
  // TODO: こんなにuseCallback使って書かないといけないもんなのか調べる

  const [isShown, setIsShown] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  let documentClickHandler: (
    event: MouseEvent
  ) => void = useCallback((_: MouseEvent) => {}, []);

  const hide = useCallback(() => {
    setIsShown(false);
    document.removeEventListener('click', documentClickHandler);
  }, [documentClickHandler]);

  documentClickHandler = useCallback(
    (event: MouseEvent) => {
      if (props.keep && popupRef.current?.contains(event.target as Node)) {
        return;
      }
      hide();
    },
    [hide, props.keep]
  );

  const handleToggleButtonClick = () => {
    if (isShown) {
      return;
    }
    setIsShown(true);
    document.addEventListener('click', documentClickHandler);
  };
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
    return () => {
      document.removeEventListener('click', documentClickHandler);
    };
  }, [documentClickHandler, isInitialized, setIsInitialized]);
  return (
    <div
      css={css`
        display: inline-block;
        line-height: 0;
        position: relative;
        ${props.custonCss};
      `}
      onClick={!props.readonly ? handleToggleButtonClick : () => {}}
      ref={popupRef}
    >
      {props.popupTriger}
      <div
        css={css`
          position: absolute;
          top: calc(100% + 4px);
          display: ${isInitialized ? 'inline-block' : 'none'};
          ${shadow};
          ${props.position === 'left' ? leftPositiong : rightPosition};
          visibility: ${isShown ? 'visible' : 'hidden'};
          height: ${isShown ? 'auto' : 0};
          animation: ${isShown == null ? '' : isShown ? fadeIn : fadeOut} 0.2s
            ease-out forwards;
          z-index: 2;
        `}
      >
        {props.popup}
      </div>
    </div>
  );
};

const fadeIn = keyframes`
  0% {
    visibility: hidden;
    opacity: 0;
    height: auto;
  }
  1% {
    opacity: 0;
    transform: translateY(-2px);
    height: auto;
  }
  100% {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    height: auto;
  }
`;

const fadeOut = keyframes`
  0% {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    height: auto;
  }
  99% {
    opacity: 0;
    transform: translateY(-2px);
    height: auto;
  }
  100% {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-2px);
    height: 0;
  }
`;

const rightPosition = css`
  right: -4px;
`;

const leftPositiong = css`
  left: -4px;
`;

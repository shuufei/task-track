import React, { useState, useRef } from 'react';
/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core';

import { shadow } from 'styles/shadow';

export type Props = {
  popupTriger: JSX.Element;
  popup: JSX.Element;
  keep?: boolean;
};

export const PopupContainer: React.FC<Props> = props => {
  const [isShown, setIsShown] = useState<boolean | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const documentClickHandler = (event: MouseEvent) => {
    if (props.keep && popupRef.current?.contains(event.target as Node)) {
      return;
    }
    hide();
  };

  const hide = () => {
    setIsShown(false);
    removeDocumentClickHandler();
  };

  const removeDocumentClickHandler = () => {
    document.removeEventListener('click', documentClickHandler);
  };

  const handleToggleButtonClick = () => {
    if (isShown) {
      return;
    }
    setIsShown(true);
    document.addEventListener('click', documentClickHandler);
  };
  return (
    <div
      css={css`
        display: inline-block;
        position: relative;
      `}
      onClick={handleToggleButtonClick}
      ref={popupRef}
    >
      {props.popupTriger}
      <div
        css={css`
          position: absolute;
          top: calc(100% + 4px);
          right: -4px;
          display: inline-block;
          ${shadow};
          visibility: ${isShown ? 'visible' : 'hidden'};
          animation: ${isShown == null ? '' : isShown ? fadeIn : fadeOut} 0.2s
            ease-out forwards;
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
  }
  1% {
    opacity: 0;
    transform: translateY(-2px);
  }
  100% {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  0% {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
  99% {
    opacity: 0;
    transform: translateY(-2px);
  }
  100% {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-2px);
  }
`;

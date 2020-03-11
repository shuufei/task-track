import React, { useState, useRef } from 'react';
/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core';

import { colors } from 'styles/color';
import { shadow } from 'styles/shadow';
import * as typography from 'styles/typography';
import { TimeField, MAX_SEC, MIN_SEC } from './TimeField';

const buttonStyle = css`
  border: none;
  background-color: ${colors.white};
  padding: 4px 6px;
  border-radius: 2px;
  cursor: pointer;
  ${typography.caption};
  :focus {
    outline: none;
  }
  :hover {
    background-color: ${colors.black80};
  }
`;

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

export type Props = {
  timesec: number;
  addSec: (sec: number, currentSec: number) => void;
  subtractSec: (sec: number, currentSec: number) => void;
};

export const TimeControl: React.FC<Props> = props => {
  const [isShown, setIsShown] = useState<boolean | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const documentClickHandler = (event: MouseEvent) => {
    if (popupRef.current?.contains(event.target as Node)) {
      return;
    }
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

  const add = (sec: number) => {
    const after = sec + props.timesec;
    if (after >= MAX_SEC) {
      props.addSec(0, MAX_SEC);
    } else {
      props.addSec(sec, props.timesec);
    }
  };
  const subtract = (sec: number) => {
    const after = props.timesec - sec;
    if (after <= MIN_SEC) {
      props.subtractSec(0, MIN_SEC);
    } else {
      props.subtractSec(sec, props.timesec);
    }
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
      <TimeField timesec={props.timesec} />
      <div
        css={css`
          position: absolute;
          top: calc(100% + 4px);
          right: -4px;
          background-color: ${colors.black100};
          padding: 10px 12px;
          border-radius: 3px;
          ${shadow};
          display: flex;
          visibility: ${isShown ? 'visible' : 'hidden'};
          animation: ${isShown == null ? '' : isShown ? fadeIn : fadeOut} 0.2s
            ease-out forwards;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <button css={buttonStyle} onClick={() => subtract(60 * 15)}>
            -15min
          </button>
          <button
            css={css`
              margin-top: 4px;
              ${buttonStyle};
            `}
            onClick={() => subtract(60 * 30)}
          >
            -30min
          </button>
          <button
            css={css`
              margin-top: 4px;
              ${buttonStyle};
            `}
            onClick={() => subtract(60 * 60)}
          >
            -60min
          </button>
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            margin-left: 10px;
          `}
        >
          <button css={buttonStyle} onClick={() => add(60 * 15)}>
            +15min
          </button>
          <button
            css={css`
              margin-top: 5px;
              ${buttonStyle};
            `}
            onClick={() => add(60 * 30)}
          >
            +30min
          </button>
          <button
            css={css`
              margin-top: 5px;
              ${buttonStyle};
            `}
            onClick={() => add(60 * 60)}
          >
            +60min
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';
import { MAX_SEC, MIN_SEC } from 'util/time';

export type Props = {
  timesec: number;
  addSec: (sec: number, currentSec: number) => void;
  subtractSec: (sec: number, currentSec: number) => void;
};

export const TimeControlPanel: React.FC<Props> = props => {
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
        background-color: ${colors.black100};
        padding: 10px 12px;
        border-radius: 3px;
        display: inline-flex;
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
            margin-top: 4px;
            ${buttonStyle};
          `}
          onClick={() => add(60 * 30)}
        >
          +30min
        </button>
        <button
          css={css`
            margin-top: 4px;
            ${buttonStyle};
          `}
          onClick={() => add(60 * 60)}
        >
          +60min
        </button>
      </div>
    </div>
  );
};

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

import React from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import * as typography from 'styles/typography';
import { colors } from 'styles/color';

export const TIME_FORMAT = 'HH:mm:ss';

export const MIN_SEC = 0;
export const MAX_SEC = 60 * 60 * 23 + 60 * 59 + 59; // 24:59:59より大きい値はとりえない

export const convertToTimeFormatFromSec = (timeSec: number) => {
  if (timeSec <= MIN_SEC) {
    return '00:00:00';
  }
  if (timeSec >= MAX_SEC) {
    return '23:59:59';
  }
  const hours = Math.floor(timeSec / (60 * 60));
  const minutes = Math.floor((timeSec - hours * 60 * 60) / 60);
  const seconds = Math.floor(timeSec) - hours * 60 * 60 - minutes * 60;
  const zeroPadding = (n: number) => {
    return String(n).padStart(2, '0');
  };
  return `${zeroPadding(hours)}:${zeroPadding(minutes)}:${zeroPadding(
    seconds
  )}`;
};

export type Props = {
  timesec: number;
  customCss?: SerializedStyles;
};

export const TimeField: React.FC<Props> = props => {
  const time = convertToTimeFormatFromSec(props.timesec);
  return (
    <input
      type="time"
      step="1"
      value={time}
      readOnly={true}
      css={css`
        padding: 2px 4px;
        text-align: center;
        background-color: ${colors.black80};
        border-radius: 3px;
        box-shadow: none;
        border: none;
        ${typography.caption}
        cursor: pointer;
        ::-webkit-clear-button,
        ::-webkit-inner-spin-button {
          display: none;
        }
        ::-webkit-datetime-edit-hour-field:focus,
        ::-webkit-datetime-edit-minute-field:focus,
        ::-webkit-datetime-edit-second-field:focus {
          background-color: unset;
          color: inherit;
        }
        :focus {
          outline: none;
        }
        :hover {
          background-color: ${colors.black200};
        }
        ${props.customCss}
      `}
    />
  );
};

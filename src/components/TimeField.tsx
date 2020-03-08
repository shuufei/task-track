import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import * as typography from 'styles/typography';
import { colors } from 'styles/color';

export const TIME_FORMAT = 'HH:mm:ss';

export const convertToTimeFormatFromSec = (timeSec: number) => {
  const min = 0;
  const max = 60 * 60 * 99 + 60 * 59 + 59; // 99:59:59より大きい値はとりえない
  if (timeSec <= min) {
    return '00:00:00';
  }
  if (timeSec >= max) {
    return '99:59:59';
  }
  const hours = Math.floor(timeSec / (60 * 60));
  const minutes = Math.floor((timeSec - hours * 60 * 60) / 60);
  const seconds = timeSec - hours * 60 * 60 - minutes * 60;
  const zeroPadding = (n: number) => {
    return String(n).padStart(2, '0');
  };
  return `${zeroPadding(hours)}:${zeroPadding(minutes)}:${zeroPadding(
    seconds
  )}`;
};

export type Props = {
  timeSec: number;
};

export const TimeField: React.FC<Props> = props => {
  const time = convertToTimeFormatFromSec(props.timeSec);
  console.log('--- time: ', time);
  return (
    <input
      type="time"
      step="1"
      value="12:00:00"
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
        }
        :focus {
          outline: none;
          background-color: ${colors.black200};
        }
      `}
      {...props}
    />
  );
};

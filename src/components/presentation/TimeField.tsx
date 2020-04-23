import React from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import * as typography from 'styles/typography';
import { colors } from 'styles/color';
import { convertToTimeFormatFromSec } from 'util/time';

export const TIME_FORMAT = 'HH:mm:ss';

export type Props = {
  timesec: number;
  customCss?: SerializedStyles;
};

export const TimeField: React.FC<Props> = props => {
  const time = convertToTimeFormatFromSec(props.timesec);
  return (
    <input
      type="text"
      value={time}
      readOnly={true}
      tabIndex={-1}
      css={css`
        display: inline-block;
        width: 55px;
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

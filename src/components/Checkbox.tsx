import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';

export type Props = {
  isChecked?: boolean;
  onToggle: (isCheck: boolean) => void;
};

export const Checkbox: React.FC<Props> = ({ isChecked = false, onToggle }) => {
  const checkmarkStyle = isChecked
    ? css`
        background-color: ${colors.green500};
        :after {
          content: '';
          position: absolute;
          display: inline-block;
          left: 5px;
          top: 0;
          width: 5px;
          height: 10px;
          border: solid ${colors.white};
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `
    : css`
        background-color: ${colors.black50};
      `;
  return (
    <label
      css={css`
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 16px;
        width: 16px;
      `}
    >
      <input
        type="checkbox"
        css={css`
          position: absolute;
          opacity: 0;
          height: 0;
          width: 0;
        `}
      />
      <span
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          border: solid 1px ${colors.black200};
          border-radius: 3px;
          ${checkmarkStyle};
        `}
        onClick={() => onToggle(!isChecked)}
      ></span>
    </label>
  );
};

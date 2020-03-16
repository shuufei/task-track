import React from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { colors } from 'styles/color';

export type Props = {
  isChecked?: boolean;
  onToggle: (isCheck: boolean) => void;
  customCss?: SerializedStyles;
};

export const Checkbox: React.FC<Props> = props => {
  const SIZE = '14px';
  const checkmarkStyle = props.isChecked
    ? css`
        background-color: ${colors.green500};
        :after {
          content: '';
          position: absolute;
          display: inline-block;
          left: 4px;
          top: 1;
          width: 4px;
          height: 7px;
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
        line-height: 0;
        position: relative;
        cursor: pointer;
        ${props.customCss};
      `}
    >
      <input
        type="checkbox"
        css={css`
          position: absolute;
          opacity: 0;
          height: 0;
          width: 0;
          visibility: hidden;
        `}
      />
      <span
        css={css`
          height: ${SIZE};
          width: ${SIZE};
          display: inline-block;
          line-height: 0;
          border: solid 1px ${colors.black200};
          border-radius: 3px;
          box-sizing: border-box;
          ${checkmarkStyle};
        `}
        onClick={() => props.onToggle(!props.isChecked)}
      ></span>
    </label>
  );
};

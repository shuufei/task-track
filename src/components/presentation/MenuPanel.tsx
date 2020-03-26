import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export type Props = {
  addComments: (...args: any[]) => void;
  delete: (...args: any[]) => void;
};

export const MenuPanel: React.FC<Props> = props => {
  return (
    <div
      css={css`
        padding: 10px 12px;
        border-radius: 3px;
        background-color: ${colors.black100};
      `}
    >
      <button css={buttonStyle} onClick={() => props.addComments()}>
        Add Comment
      </button>
      <button
        css={css`
          ${buttonStyle}
          margin-top: 4px;
          color: ${colors.red500};
        `}
        onClick={() => props.delete()}
      >
        Delete
      </button>
    </div>
  );
};

const buttonStyle = css`
  border: none;
  background-color: ${colors.white};
  padding: 6px 8px;
  width: 104px;
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

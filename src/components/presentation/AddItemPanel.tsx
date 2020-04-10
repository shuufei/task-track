import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export type Props = {
  addTask: () => void;
  addSection: () => void;
};

export const AddItemPanel: React.FC<Props> = props => {
  return (
    <div
      css={css`
        padding: 10px 12px;
        border-radius: 3px;
        background-color: ${colors.black100};
      `}
    >
      <button css={buttonStyle} onClick={() => props.addTask()}>
        Add Task
      </button>
      <button
        css={css`
          margin-top: 4px;
          ${buttonStyle}
        `}
        onClick={() => props.addSection()}
      >
        Add Section
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

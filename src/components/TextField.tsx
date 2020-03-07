import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export const TextField: React.FC = () => {
  return (
    <input
      type="text"
      css={css`
        width: 100%;
        border: none;
        padding: 4px 6px;
        ${typography.base};
        :focus {
          outline: none;
          border-bottom: solid 1px ${colors.primary500};
        }
      `}
      name=""
      id=""
    />
  );
};

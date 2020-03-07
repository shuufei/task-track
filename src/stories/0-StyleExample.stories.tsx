import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import * as typography from 'styles/typography';
import { colors } from 'styles/color';

export default {
  title: 'StyleExample'
};

export const Typography = () => (
  <React.Fragment>
    <p css={typography.base}>Base Typography</p>
    <p css={typography.caption}>Caption Typography</p>
  </React.Fragment>
);

const colorBlockStyle = css`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: solid 1px ${colors.black200};
`;
export const Color = () => (
  <div
    css={css`
      padding: 12px;
    `}
  >
    {Object.entries(colors).map(([key, value]) => {
      return (
        <React.Fragment>
          <span css={typography.base}>{key}</span>
          <div
            css={css`
              ${colorBlockStyle};
              background-color: ${value};
              margin-top: 4px;
              margin-bottom: 12px;
            `}
          ></div>
        </React.Fragment>
      );
    })}
  </div>
);

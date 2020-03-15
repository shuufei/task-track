import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { Icon } from './Icon';
import { colors } from 'styles/color';
import { Textarea } from './Textarea';

export type Props = {
  delete: () => void;
};

export const Comment: React.FC<Props> = props => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <span
        css={css`
          width: 5px;
          height: 5px;
          background-color: ${colors.black400};
          border-radius: 50%;
        `}
      ></span>
      <Textarea
        placeholder={'Edit Comment'}
        css={css`
          margin-left: 4px;
        `}
      />
      <div
        css={css`
          display: inline-block;
          cursor: pointer;
        `}
        onClick={() => props.delete()}
      >
        <Icon
          iconname={'close'}
          css={css`
            margin-left: 12px;
          `}
        />
      </div>
    </div>
  );
};

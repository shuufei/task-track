import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { Icon } from './Icon';
import { colors } from 'styles/color';
import { Textarea, AdjustHeightToTextarea } from './Textarea';

export type Props = {
  delete: () => void;
};

export const Comment: React.FC<Props> = props => {
  return (
    <div
      css={css`
        display: flex;
        align-items: flex-start;
      `}
    >
      <AdjustHeightToTextarea>
        <span
          css={css`
            width: 5px;
            height: 5px;
            background-color: ${colors.black400};
            border-radius: 50%;
          `}
        ></span>
      </AdjustHeightToTextarea>
      <Textarea
        placeholder={'Edit Comment'}
        css={css`
          margin-left: 4px;
        `}
      />
      <AdjustHeightToTextarea
        css={css`
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
      </AdjustHeightToTextarea>
    </div>
  );
};

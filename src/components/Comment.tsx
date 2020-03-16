import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { Icon } from './Icon';
import { colors } from 'styles/color';
import { Textarea, AdjustHeightToTextarea } from './Textarea';

export type Props = {
  comment: string;
  editComment: (comment: string) => void;
  delete: () => void;
  onPressEnter?: () => void;
};

export const Comment: React.FC<Props> = props => {
  const [isHover, setIsHover] = useState(false);
  const onPressDelete = (prevValue: string) => {
    if (prevValue === '') {
      props.delete();
    }
  };
  return (
    <div
      css={css`
        display: flex;
        align-items: flex-start;
      `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
        value={props.comment}
        changeValue={value => props.editComment(value)}
        onPressEnter={() =>
          props.onPressEnter != null ? props.onPressEnter() : null
        }
        onPressDelete={prevValue => onPressDelete(prevValue)}
        customCss={css`
          margin-left: 6px;
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
            visibility: ${isHover ? 'visible' : 'hidden'};
          `}
        />
      </AdjustHeightToTextarea>
    </div>
  );
};

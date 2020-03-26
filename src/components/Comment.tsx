import React, { useState, useRef, useEffect } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { Icon } from './Icon';
import { colors } from 'styles/color';
import * as typography from 'styles/typography';
import { Textarea, AdjustHeightToTextarea, Handler } from './Textarea';

const COMMENT_TEXTAREA_HEIGHT = '24px';

export type Props = {
  comment: string;
  editComment: (comment: string) => void;
  delete: () => void;
  onPressEnter?: () => void;
  onPressArrowUp?: () => void;
  onPressArrowDown?: () => void;
  focus?: boolean;
};

export const Comment: React.FC<Props> = props => {
  const [isHover, setIsHover] = useState(false);
  const [isHoverDelete, setIsHoverDelete] = useState(false);
  const [beforeFocus, setBeforeFocus] = useState(false);
  const innerRef = useRef<Handler>(null);
  useEffect(() => {
    if (props.focus != null && props.focus !== beforeFocus) {
      setBeforeFocus(props.focus);
      if (props.focus && innerRef.current != null) {
        innerRef.current.focus();
      }
    }
  }, [beforeFocus, props.focus]);
  const onPressDelete = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    prevValue: string
  ) => {
    if (prevValue === '') {
      event.preventDefault();
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
      <AdjustHeightToTextarea
        css={css`
          height: ${COMMENT_TEXTAREA_HEIGHT};
        `}
      >
        <span
          css={css`
            width: 4px;
            height: 4px;
            background-color: ${colors.black400};
            border-radius: 50%;
          `}
        ></span>
      </AdjustHeightToTextarea>
      <Textarea
        placeholder={'Edit Comment'}
        value={props.comment}
        ref={innerRef}
        changeValue={value => props.editComment(value)}
        onPressEnter={() =>
          props.onPressEnter != null ? props.onPressEnter() : null
        }
        onPressDelete={(event, prevValue) => onPressDelete(event, prevValue)}
        onPressArrowUp={() =>
          props.onPressArrowUp != null ? props.onPressArrowUp() : null
        }
        onPressArrowDown={() =>
          props.onPressArrowDown != null ? props.onPressArrowDown() : null
        }
        customCss={css`
          margin-left: 4px;
          border: solid 1px ${isHoverDelete ? colors.red500 : 'rgba(0,0,0,0)'};
          ${typography.caption};
        `}
      />
      <AdjustHeightToTextarea
        css={css`
          cursor: pointer;
          height: ${COMMENT_TEXTAREA_HEIGHT};
        `}
        onClick={() => props.delete()}
        onMouseEnter={() => setIsHoverDelete(true)}
        onMouseLeave={() => setIsHoverDelete(false)}
      >
        <Icon
          iconname={'close'}
          customCss={css`
            margin-left: 12px;
            box-sizing: border-box;
            visibility: ${isHover ? 'visible' : 'hidden'};
          `}
        />
      </AdjustHeightToTextarea>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { Icon } from './Icon';
import { colors } from 'styles/color';
import { Textarea, AdjustHeightToTextarea, Handler } from './Textarea';

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
        ref={innerRef}
        changeValue={value => props.editComment(value)}
        onPressEnter={() =>
          props.onPressEnter != null ? props.onPressEnter() : null
        }
        onPressDelete={prevValue => onPressDelete(prevValue)}
        onPressArrowUp={() =>
          props.onPressArrowUp != null ? props.onPressArrowUp() : null
        }
        onPressArrowDown={() =>
          props.onPressArrowDown != null ? props.onPressArrowDown() : null
        }
        customCss={css`
          margin-left: 6px;
          border: solid 1px ${isHoverDelete ? colors.red500 : 'rgba(0,0,0,0)'};
        `}
      />
      <AdjustHeightToTextarea
        css={css`
          cursor: pointer;
        `}
        onClick={() => props.delete()}
        onMouseEnter={() => setIsHoverDelete(true)}
        onMouseLeave={() => setIsHoverDelete(false)}
      >
        <Icon
          iconname={'close'}
          customCss={css`
            margin-left: 12px;
            visibility: ${isHover ? 'visible' : 'hidden'};
          `}
        />
      </AdjustHeightToTextarea>
    </div>
  );
};

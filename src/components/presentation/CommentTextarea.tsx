import React from 'react';
/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/core';

import { Handler, Textarea, IME_ENTER_KEY_CODE } from './Textarea';

export type Props = {
  comment: string;
  editComment: (comment: string) => void;
  generateNextComment: () => void;
  deleteComment: () => void;
  toPrevComment: () => void;
  toNextComment: () => void;
  customCss?: SerializedStyles;
};

export const CommentTextarea = React.forwardRef<Handler, Props>(
  (props, ref) => {
    const onPressEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.shiftKey || event.keyCode === IME_ENTER_KEY_CODE) {
        return;
      }
      event.preventDefault();
      props.generateNextComment();
    };
    const onPressDelete = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const prevValue = (event.target as any).value;
      if (prevValue === '') {
        event.preventDefault();
        props.deleteComment();
      }
    };
    const onPressArrowUp = (
      event: React.KeyboardEvent<HTMLTextAreaElement>,
      textarea: HTMLTextAreaElement
    ) => {
      const isSelecting = textarea.selectionStart !== textarea.selectionEnd;
      if (event.shiftKey || isSelecting) {
        return;
      }
      const currentLine = textarea.value
        .substr(0, textarea.selectionStart)
        .split('\n').length;
      if (currentLine <= 1) {
        props.toPrevComment();
      }
    };
    const onPressArrowDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement>,
      textarea: HTMLTextAreaElement
    ) => {
      const isSelecting = textarea.selectionStart !== textarea.selectionEnd;
      if (event.shiftKey || isSelecting) {
        return;
      }
      const totalLine = textarea.value.split('\n').length;
      const currentLine = textarea.value
        .substr(0, textarea.selectionStart)
        .split('\n').length;
      if (totalLine === currentLine) {
        props.toNextComment();
      }
    };
    return (
      <Textarea
        placeholder={'Edit Comment'}
        value={props.comment}
        ref={ref}
        changeValue={props.editComment}
        onPressEnter={onPressEnter}
        onPressDelete={onPressDelete}
        onPressArrowUp={(event, textarea) => onPressArrowUp(event, textarea)}
        onPressArrowDown={(event, textarea) =>
          onPressArrowDown(event, textarea)
        }
        customCss={props.customCss}
      />
    );
  }
);

import React from 'react';
/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/core';

import { Handler, Textarea, IME_ENTER_KEY_CODE } from './Textarea';

export type Props = {
  title: string;
  editTitle: (comment: string) => void;
  onPressEnter: () => void;
  onPressTab: () => void;
  onPressDelete: () => void;
  customCss?: SerializedStyles;
};

export const TaskTextarea = React.forwardRef<Handler, Props>((props, ref) => {
  const onPressEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey || event.keyCode === IME_ENTER_KEY_CODE) {
      return;
    }
    event.preventDefault();
    props.onPressEnter();
  };
  const onPressTab = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    props.onPressTab();
  };
  const onPressDelete = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const prevValue = (event.target as any).value;
    if (prevValue === '') {
      event.preventDefault();
      props.onPressDelete();
    }
  };
  return (
    <Textarea
      placeholder={'Input Task'}
      value={props.title}
      ref={ref}
      changeValue={value => props.editTitle(value)}
      onPressEnter={onPressEnter}
      onPressTab={onPressTab}
      onPressDelete={onPressDelete}
      customCss={props.customCss}
    />
  );
});

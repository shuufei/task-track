import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export const INITIAL_HEIGHT = '27px';
const IME_ENTER_KEY_CODE = 229;

export type Key = 'Enter' | 'Tab' | 'Backspace' | 'ArrowUp' | 'ArrowDown';

export type Props = {
  customCss?: SerializedStyles;
  placeholder?: string;
  value?: string;
  changeValue?: (value: string) => void;
  onPressEnter?: () => void;
  onPressTab?: () => void;
  onPressDelete?: (prevValue: string) => void;
  onPressArrowUp?: () => void;
  onPressArrowDown?: () => void;
};

export type Handler = {
  focus: () => void;
  value: string;
};

export const Textarea = React.forwardRef<Handler, Props>((props, ref) => {
  const [localValue, setLocalValue] = useState('');

  const innerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (innerRef.current != null) {
        innerRef.current.focus();
      }
    },
    value: innerRef.current != null ? innerRef.current.value : ''
  }));

  const adjustHeight = () => {
    if (innerRef.current == null) {
      return;
    }
    innerRef.current.style.height = 'auto';
    innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  });

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isSelecting =
      innerRef.current?.selectionStart !== innerRef.current?.selectionEnd;
    switch (event.key as Key) {
      case 'Enter':
        if (
          event.shiftKey ||
          event.keyCode === IME_ENTER_KEY_CODE ||
          props.onPressEnter == null
        ) {
          return;
        }
        event.preventDefault();
        props.onPressEnter();
        break;
      case 'Tab':
        if (props.onPressTab == null) {
          return;
        }
        event.preventDefault();
        props.onPressTab();
        break;
      case 'Backspace':
        const prevValue = (event.target as any).value;
        if (props.onPressDelete == null) {
          return;
        }
        props.onPressDelete(prevValue);
        break;
      case 'ArrowUp':
        if (event.shiftKey || props.onPressArrowUp == null) {
          return;
        }
        // TODO: 実装を使う側にうつす
        if (innerRef.current != null && !isSelecting) {
          const currentLine = innerRef.current.value
            .substr(0, innerRef.current.selectionStart)
            .split('\n').length;
          if (currentLine <= 1) {
            props.onPressArrowUp();
          }
        }
        break;
      case 'ArrowDown':
        if (event.shiftKey || props.onPressArrowDown == null) {
          return;
        }
        // TODO: 実装を使う側にうつす
        if (innerRef.current != null && !isSelecting) {
          const totalLine = innerRef.current.value.split('\n').length;
          const currentLine = innerRef.current.value
            .substr(0, innerRef.current.selectionStart)
            .split('\n').length;
          if (totalLine === currentLine) {
            props.onPressArrowDown();
          }
        }
        break;
      default:
        break;
    }
  };

  return (
    <textarea
      ref={innerRef}
      value={props.value ?? localValue}
      onInput={() => adjustHeight()}
      onChange={event =>
        props.changeValue != null
          ? props.changeValue(event.target.value)
          : setLocalValue(event.target.value)
      }
      css={css`
        width: 100%;
        border: none;
        padding: 4px;
        resize: none;
        height: auto;
        box-sizing: border-box;
        border-radius: 3px;
        ${typography.base};
        :focus {
          outline: none;
          background-color: ${colors.black80};
        }
        ${props.customCss}
      `}
      placeholder={props.placeholder}
      rows={1}
      onKeyDown={event => onKeyDown(event)}
    />
  );
});

export const AdjustHeightToTextarea: React.FC<any> = props => {
  return (
    <div
      css={css`
        height: ${INITIAL_HEIGHT};
        display: inline-flex;
        align-items: center;
        line-height: 0;
      `}
      {...props}
    >
      {props.children}
    </div>
  );
};

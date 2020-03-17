import React, { useRef, useState } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export const INITIAL_HEIGHT = '27px';
const IME_ENTER_KEY_CODE = 229;

export type Key = 'Enter' | 'Tab' | 'Backspace';

export type Props = {
  customCss?: SerializedStyles;
  placeholder?: string;
  value?: string;
  changeValue?: (value: string) => void;
  onPressEnter?: () => void;
  onPressTab?: () => void;
  onPressDelete?: (prevValue: string) => void;
};

export const Textarea: React.FC<Props> = props => {
  const [localValue, setLocalValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = () => {
    if (ref.current == null) {
      return;
    }
    ref.current.style.height = 'auto';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      default:
        break;
    }
  };
  return (
    <textarea
      ref={ref}
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
};

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

import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export const INITIAL_HEIGHT = '27px';
export const IME_ENTER_KEY_CODE = 229;

export type Key = 'Enter' | 'Tab' | 'Backspace' | 'ArrowUp' | 'ArrowDown';

export type Props = {
  customCss?: SerializedStyles;
  placeholder?: string;
  value?: string;
  changeValue?: (value: string) => void;
  onPressEnter?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPressTab?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPressDelete?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPressArrowUp?: (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    ref: HTMLTextAreaElement
  ) => void;
  onPressArrowDown?: (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    ref: HTMLTextAreaElement
  ) => void;
};

export type Handler = {
  focus: () => void;
  value: string;
};

export const Textarea = React.forwardRef<Handler, Props>((props, ref) => {
  const [localValue, setLocalValue] = useState('');
  const [initialized, setInitialized] = useState(false);

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
    if (!initialized && props.value) {
      setLocalValue(props.value);
      setInitialized(true);
    }
    adjustHeight();
  }, [props.value, initialized]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key as Key) {
      case 'Enter':
        if (props.onPressEnter == null) {
          return;
        }
        props.onPressEnter(event);
        break;
      case 'Tab':
        if (props.onPressTab == null) {
          return;
        }
        event.preventDefault();
        props.onPressTab(event);
        break;
      case 'Backspace':
        if (props.onPressDelete == null) {
          return;
        }
        props.onPressDelete(event);
        break;
      case 'ArrowUp':
        if (props.onPressArrowUp == null || innerRef.current == null) {
          return;
        }
        props.onPressArrowUp(event, innerRef.current);
        break;
      case 'ArrowDown':
        if (props.onPressArrowDown == null || innerRef.current == null) {
          return;
        }
        props.onPressArrowDown(event, innerRef.current);
        break;
      default:
        break;
    }
  };

  return (
    <textarea
      ref={innerRef}
      value={localValue}
      onInput={() => adjustHeight()}
      onChange={event => {
        setLocalValue(event.target.value);
        if (props.changeValue != null) {
          props.changeValue(event.target.value);
        }
      }}
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
      spellCheck={false}
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

import React, { useRef, useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export const INITIAL_HEIGHT = '27px';

export type Props = {
  placeholder?: string;
  value?: string;
  changeValue?: (value: string) => void;
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
      `}
      {...props}
      rows={1}
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

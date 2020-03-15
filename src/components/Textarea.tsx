import React, { useRef } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export type Props = {
  placeholder?: string;
};

export const Textarea: React.FC<Props> = props => {
  const BORDER_HEIGHT = 1;
  const ref = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = () => {
    if (ref.current == null) {
      return;
    }
    ref.current.style.height = 'auto';
    ref.current.style.height = `${ref.current.scrollHeight + BORDER_HEIGHT}px`;
  };
  return (
    <textarea
      ref={ref}
      onInput={() => adjustHeight()}
      css={css`
        width: 100%;
        border: none;
        padding: 4px 6px;
        border-bottom: solid ${BORDER_HEIGHT}px rgba(0, 0, 0, 0);
        resize: none;
        height: auto;
        box-sizing: border-box;
        ${typography.base};
        :focus {
          outline: none;
          border-bottom: solid ${BORDER_HEIGHT}px ${colors.primary500};
        }
      `}
      {...props}
      rows={1}
    />
  );
};

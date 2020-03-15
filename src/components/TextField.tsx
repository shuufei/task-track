import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';

export type Props = {
  placeholder?: string;
  value?: string;
  changeValue?: (value: string) => void;
};

export const TextField: React.FC<Props> = props => {
  const [localValue, setLocalValue] = useState('');
  return (
    <input
      type="text"
      value={props.value ?? localValue}
      css={css`
        width: 100%;
        border: none;
        padding: 4px;
        border-radius: 3px;
        ${typography.base};
        :focus {
          outline: none;
          background-color: ${colors.black80};
        }
      `}
      {...props}
      onChange={event =>
        props.changeValue != null
          ? props.changeValue(event.target.value)
          : setLocalValue(event.target.value)
      }
    />
  );
};

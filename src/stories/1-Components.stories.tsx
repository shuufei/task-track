import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { action } from '@storybook/addon-actions';

import { TextField } from 'components/TextField';
import { Checkbox } from 'components/Checkbox';

export default {
  title: 'Components'
};

const ComponentWrap: React.FC = ({ children }) => (
  <div
    css={css`
      padding: 12px;
    `}
  >
    {children}
  </div>
);

export const _TextField = () => (
  <ComponentWrap>
    <TextField />
  </ComponentWrap>
);

export const _Checkbox = () => {
  const [isChecked, setChecked] = useState(false);
  return (
    <ComponentWrap>
      <Checkbox
        isChecked={isChecked}
        onToggle={isCheck => {
          action('checkbox click');
          setChecked(isCheck);
        }}
      />
    </ComponentWrap>
  );
};

import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { action } from '@storybook/addon-actions';

import { TextField } from 'components/TextField';
import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';
import { TimeField } from 'components/TimeField';

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
    <TextField
      css={css`
        display: block;
        margin: 12px;
      `}
      placeholder={'タスク名を入力'}
    />
    <TextField
      css={css`
        display: block;
        margin: 12px;
      `}
    />
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

export const _Icons = () => (
  <ComponentWrap>
    <div>
      <Icon
        iconName={'play'}
        css={css`
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconName={'pause'}
        css={css`
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconName={'close'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconName={'menu'}
        css={css`
          margin: 12px;
        `}
      ></Icon>
    </div>
    <div>
      <Icon
        iconName={'play'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconName={'pause'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconName={'close'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconName={'menu'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
    </div>
  </ComponentWrap>
);

export const _TimeField = () => (
  <ComponentWrap>
    <TimeField timeSec={360 * 2} />
  </ComponentWrap>
);

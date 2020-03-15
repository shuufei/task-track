import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { action } from '@storybook/addon-actions';

import { TextField } from 'components/TextField';
import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';
import { TimeField } from 'components/TimeField';
import { TimeControl } from 'components/TimeControl';
import { TimeControlPanel } from 'components/TImeControlPanel';
import { Menu } from 'components/Menu';
import { Comment } from 'components/Comment';
import { Textarea } from 'components/Textarea';

export default {
  title: 'Components'
};

const ComponentWrap: React.FC = props => (
  <div
    css={css`
      padding: 12px;
    `}
    {...props}
  >
    {props.children}
  </div>
);

export const _TextField = () => (
  <ComponentWrap>
    <TextField
      css={css`
        display: block;
        margin: 12px;
      `}
      placeholder={'Input Task'}
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
        iconname={'play'}
        css={css`
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'pause'}
        css={css`
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'close'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'menu'}
        css={css`
          margin: 12px;
        `}
      ></Icon>
    </div>
    <div>
      <Icon
        iconname={'play'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'pause'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'close'}
        css={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'menu'}
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
    <TimeField timesec={3600 * 2 + 99} />
  </ComponentWrap>
);

export const _TimeControlPanel = () => {
  const [timeSec, setTimeSec] = useState(7200);
  return (
    <ComponentWrap>
      <TimeControlPanel
        timesec={timeSec}
        addSec={(sec, current) => setTimeSec(current + sec)}
        subtractSec={(sec, current) => setTimeSec(current - sec)}
      />
    </ComponentWrap>
  );
};

export const _TimeControl = () => {
  const [timeSec, setTimeSec] = useState(7200);
  return (
    <ComponentWrap
      css={css`
        padding-left: 120px;
      `}
    >
      <TimeControl
        timesec={timeSec}
        addSec={(sec, current) => setTimeSec(current + sec)}
        subtractSec={(sec, current) => setTimeSec(current - sec)}
      />
    </ComponentWrap>
  );
};

export const _Menu = () => {
  const addComments = () => action('add comment');
  const deleteTask = () => action('delete');
  return (
    <ComponentWrap>
      <Menu addComment={() => addComments} delete={() => deleteTask()} />
    </ComponentWrap>
  );
};

export const _Comment = () => {
  return (
    <ComponentWrap>
      <Comment delete={() => action('comment delete')} />
    </ComponentWrap>
  );
};

export const _Textarea = () => {
  return <Textarea />;
};

import React, { useState, useEffect } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { action } from '@storybook/addon-actions';

import { TextField } from 'components/TextField';
import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';
import { TimeField } from 'components/TimeField';
import { TimeControl } from 'components/TimeControl';
import { TimeControlPanel } from 'components/TimeControlPanel';
import { Menu } from 'components/Menu';
import { Comment } from 'components/Comment';
import { Textarea } from 'components/Textarea';
import { Task as TaskComponent } from 'components/Task';
import { Task } from 'model/task';

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

export const _Task = () => {
  const initialTask: Task = {
    uuid: '0001',
    title: '',
    isDone: false,
    timesec: 0,
    isPlaying: false,
    startUnixtime: 0
  };
  const [task, setTask] = useState(initialTask);
  const setTimesec = (sec: number) => {
    setTask({
      ...task,
      timesec: sec
    });
  };
  const setIsDone = (isDone: boolean) => {
    setTask({
      ...task,
      isDone: isDone,
      isPlaying: false
    });
  };
  const setIsPlaying = (isPlaying: boolean) => {
    setTask({
      ...task,
      isPlaying: isPlaying
    });
  };
  const setTitle = (title: string) => {
    setTask({
      ...task,
      title
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (task.isPlaying) {
        setTask({
          ...task,
          timesec: task.timesec + 1
        });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [task]);
  return (
    <TaskComponent
      title={task.title}
      timesec={task.timesec}
      isDone={task.isDone}
      isPlaying={task.isPlaying}
      addSec={(sec, current) => setTimesec(current + sec)}
      subtractSec={(sec, current) => setTimesec(current - sec)}
      done={isDone => setIsDone(isDone)}
      play={() => setIsPlaying(true)}
      pause={() => setIsPlaying(false)}
      editTitle={value => setTitle(value)}
      addComment={() => {}}
      editComments={() => {}}
      delete={() => {}}
    />
  );
};

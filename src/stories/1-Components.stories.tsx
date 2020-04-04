import React, { useState, useEffect } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { action } from '@storybook/addon-actions';

import { TextField } from 'components/presentation/TextField';
import { Checkbox } from 'components/presentation/Checkbox';
import { Icon } from 'components/presentation/Icon';
import { TimeField } from 'components/presentation/TimeField';
import { TimeControl } from 'components/presentation/TimeControl';
import { TimeControlPanel } from 'components/presentation/TimeControlPanel';
import { Menu } from 'components/presentation/Menu';
import { Comment } from 'components/presentation/Comment';
import { Textarea } from 'components/presentation/Textarea';
import { Task as TaskComponent } from 'components/presentation/Task';
import { Task } from 'model/task';

export default {
  title: 'Components'
};

const ComponentWrap: React.FC = props => (
  <div
    css={css`
      padding: 12px;
    `}
  >
    {props.children}
  </div>
);

export const _TextField = () => (
  <ComponentWrap>
    <TextField
      customCss={css`
        display: block;
        margin: 12px;
      `}
      placeholder={'Input Task'}
    />
    <TextField
      customCss={css`
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
        customCss={css`
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'pause'}
        customCss={css`
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'close'}
        customCss={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'menu'}
        customCss={css`
          margin: 12px;
        `}
      ></Icon>
    </div>
    <div>
      <Icon
        iconname={'play'}
        customCss={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'pause'}
        customCss={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'close'}
        customCss={css`
          width: 20px;
          margin: 12px;
        `}
      ></Icon>
      <Icon
        iconname={'menu'}
        customCss={css`
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
  const [comment, setComment] = useState('');
  return (
    <ComponentWrap>
      <Comment
        comment={comment}
        editComment={v => setComment(v)}
        delete={() => action('comment delete')}
        generateNextComment={() => {}}
        toPrevComment={() => {}}
        toNextComment={() => {}}
      />
    </ComponentWrap>
  );
};

export const _Textarea = () => {
  return <Textarea />;
};

// export const _Task = () => {
//   const initialTask: Task = {
//     uuid: '0001',
//     title: '',
//     isDone: false,
//     timesec: 0,
//     isPlaying: false,
//     comments: [],
//     updatedAt: new Date()
//   };
//   const [task, setTask] = useState(initialTask);
//   const setTimesec = (sec: number) => {
//     setTask({
//       ...task,
//       timesec: sec
//     });
//   };
//   const setIsDone = (isDone: boolean) => {
//     setTask({
//       ...task,
//       isDone: isDone,
//       isPlaying: false
//     });
//   };
//   const setIsPlaying = (isPlaying: boolean) => {
//     setTask({
//       ...task,
//       isPlaying: isPlaying
//     });
//   };
//   const setTitle = (title: string) => {
//     setTask({
//       ...task,
//       title
//     });
//   };
//   const setComments = (comments: string[]) => {
//     setTask({
//       ...task,
//       comments
//     });
//   };
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (task.isPlaying) {
//         setTask({
//           ...task,
//           timesec: task.timesec + 1
//         });
//       }
//     }, 1000);
//     return () => {
//       clearInterval(interval);
//     };
//   }, [task]);
//   return (
//     <TaskComponent
//       title={task.title}
//       timesec={task.timesec}
//       isDone={task.isDone}
//       isPlaying={task.isPlaying}
//       comments={task.comments}
//       addSec={(sec, current) => setTimesec(current + sec)}
//       subtractSec={(sec, current) => setTimesec(current - sec)}
//       done={isDone => setIsDone(isDone)}
//       play={() => setIsPlaying(true)}
//       pause={() => setIsPlaying(false)}
//       editTitle={value => setTitle(value)}
//       addComment={() => {}}
//       editComments={comments => setComments(comments)}
//       delete={() => {}}
//       addTask={() => {}}
//     />
//   );
// };

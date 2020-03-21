import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { RootState, actionCreator } from 'store';
import { TaskContainer } from 'components/container/TaskContainer';

export const TasksPage: React.FC = () => {
  const taskUuids = useSelector((state: RootState) =>
    state.task.tasks.map(v => v.uuid)
  );
  const dispatch = useDispatch();
  return (
    <div
      css={css`
        padding: 12px 24px;
      `}
    >
      <h1>Task Page</h1>
      {taskUuids.map((uuid, i) => (
        <TaskContainer
          uuid={uuid}
          key={uuid}
          customCss={
            i > 0
              ? css`
                  margin-top: 6px;
                `
              : undefined
          }
        />
      ))}
      <button
        onClick={() => dispatch(actionCreator.task.addTask())}
        css={css`
          margin-top: 12px;
        `}
      >
        Add Task
      </button>
    </div>
  );
};

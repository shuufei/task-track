import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { RootState, actionCreator } from 'store';
import { TaskContainer } from 'components/container/TaskContainer';
import { Icon } from 'components/presentation/Icon';

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
      <DndProvider backend={Backend}>
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
      </DndProvider>
      <div
        onClick={() => dispatch(actionCreator.task.addTask())}
        css={css`
          margin-top: 12px;
          padding: 4px;
          display: inline-block;
          cursor: pointer;
        `}
      >
        <Icon iconname={'plus'} />
      </div>
    </div>
  );
};

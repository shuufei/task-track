import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { RootState, actionCreator } from 'store';
import { TaskContainer } from 'components/container/TaskContainer';
import { Icon } from 'components/presentation/Icon';
import * as typography from 'styles/typography';
import { colors } from 'styles/color';

export const TasksPage: React.FC = () => {
  const taskUuids = useSelector((state: RootState) =>
    state.task.tasks.map(v => v.uuid)
  );
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (initialized) {
      return;
    }
    dispatch(actionCreator.task.updateFocusTaskUuid({ uuid: undefined }));
    setInitialized(true);
  }, [dispatch, initialized, setInitialized]);

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
      {taskUuids.length === 0 && (
        <p
          css={css`
            ${typography.base}
            color: ${colors.black400};
            margin: 0;
          `}
        >
          Add a Task!
        </p>
      )}
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

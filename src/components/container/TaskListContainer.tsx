import React, { useContext } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { TaskContainer } from './TaskContainer';
import { Icon } from 'components/presentation/Icon';
import { useDispatch } from 'react-redux';
import { actionCreator } from 'store';
import { SectionIdContext } from 'pages/TasksPage';

export type Props = {
  uuids: string[];
  customCss?: SerializedStyles;
};

export const TaskListContainer: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const sectionId = useContext(SectionIdContext);
  return (
    <div css={props.customCss}>
      <DndProvider backend={Backend}>
        {props.uuids.map((uuid, i) => (
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
        onClick={() =>
          sectionId != null
            ? dispatch(actionCreator.task.addTaskToSection({ sectionId }))
            : dispatch(actionCreator.task.addTask())
        }
        css={css`
          margin-top: 6px;
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

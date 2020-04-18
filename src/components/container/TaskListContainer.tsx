import React, { useContext, useRef } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import { DndProvider, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { TaskContainer } from './TaskContainer';
import { Icon } from 'components/presentation/Icon';
import { useDispatch } from 'react-redux';
import { actionCreator } from 'store';
import { SectionIdContext } from 'pages/TasksPage';
import { DRAG_TYPE_TASK, DragObjectType } from 'hooks/task-drag-and-drop';
import { colors } from 'styles/color';

export type Props = {
  uuids: string[];
  customCss?: SerializedStyles;
};

export const TaskListContainer: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const sectionId = useContext(SectionIdContext);
  const lastUuid = props.uuids[props.uuids.length - 1];

  const taskDropRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, connectTaskDrop] = useDrop({
    accept: DRAG_TYPE_TASK,
    drop: (v: DragObjectType) => {
      dispatch(
        actionCreator.task.moveTask({
          draggedTaskUuid: v.uuid,
          droppedTaskUuid: lastUuid,
          direction: 'next'
        })
      );
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });
  connectTaskDrop(taskDropRef);

  return (
    <div css={props.customCss}>
      <DndProvider backend={Backend}>
        {props.uuids.map((uuid, i) => (
          <TaskContainer
            uuid={uuid}
            prevTaskUuid={i !== 0 ? props.uuids[i - 1] : undefined}
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
        <div
          ref={taskDropRef}
          css={css`
            height: 8px;
            width: 100%;
            margin-top: 12px;
            background-color: ${colors.transparent};
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
        >
          <div
            css={css`
              width: 100%;
              height: 2px;
              background-color: ${isOver
                ? colors.primary400
                : colors.transparent};
            `}
          ></div>
        </div>
      </DndProvider>
      <div
        onClick={() =>
          sectionId != null
            ? dispatch(actionCreator.task.addTaskToSection({ sectionId }))
            : dispatch(actionCreator.task.addTask({}))
        }
        css={css`
          margin-top: 4px;
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

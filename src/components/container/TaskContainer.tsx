import React, { useEffect, useCallback, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { Task } from 'components/presentation/Task';
import { RootState, actionCreator } from 'store';
import { Task as TaskType } from 'model/task';
import { SectionIdContext } from 'pages/TasksPage';
import { useTaskDrop, useTaskDrag } from 'hooks/task-drag-and-drop';
import { colors } from 'styles/color';

export type Props = {
  uuid: string;
  prevTaskUuid?: string;
  customCss?: SerializedStyles;
};

export const TaskContainer: React.FC<Props> = props => {
  const [isDragging, setIsDragging] = useState(false);

  const taskIndex = useSelector((state: RootState) =>
    state.task.tasks.findIndex(v => v.uuid === props.uuid)
  );
  const task = useSelector((state: RootState) => state.task.tasks[taskIndex]);
  const focusUuid = useSelector((state: RootState) => state.task.focusUuid);
  const dispatch = useDispatch();
  const sectionId = useContext(SectionIdContext);

  const isHaveSubtasks = !!(
    task &&
    task.subTaskUuids &&
    task.subTaskUuids.length > 0
  );
  const isRootTask = !task?.parentTaskUuid;

  const updateTask = useCallback(
    (task: TaskType) => {
      task.updatedAt = new Date();
      dispatch(
        actionCreator.task.updateTask({
          task
        })
      );
    },
    [dispatch]
  );
  const updateTimesec = (sec: number) => {
    if (task == null) {
      return;
    }
    updateTask({
      ...task,
      timesec: sec,
      timesecUpdatedTimestamp: new Date().valueOf()
    });
  };
  const updateIsDone = (isDone: boolean) => {
    if (task == null) {
      return;
    }
    updateTask({
      ...task,
      isDone: isDone,
      isPlaying: false
    });
  };
  const updateIsPlaying = (isPlaying: boolean) => {
    if (task == null) {
      return;
    }
    if (isPlaying) {
      // 一度に記録可能なタスクは一つなので、一回全てのタスクを一時停止
      dispatch(actionCreator.task.pauseAllTask());
    }
    updateTask({
      ...task,
      isPlaying: isPlaying,
      timesecUpdatedTimestamp: isPlaying ? new Date().valueOf() : undefined
    });
  };
  const updateTitle = (title: string) => {
    if (task == null) {
      return;
    }
    updateTask({
      ...task,
      title
    });
  };
  const updateComments = (comments: string[]) => {
    if (task == null) {
      return;
    }
    updateTask({
      ...task,
      comments
    });
  };
  const deleteTask = () => {
    dispatch(actionCreator.task.deleteTask({ uuid: props.uuid, sectionId }));
  };
  const addTask = () => {
    sectionId != null
      ? dispatch(
          actionCreator.task.addTaskByUuidToSection({
            uuid: props.uuid,
            sectionId,
            parentTaskUuid: task?.parentTaskUuid
          })
        )
      : dispatch(
          actionCreator.task.addTaskByUuid({
            uuid: props.uuid,
            parentTaskUuid: task?.parentTaskUuid
          })
        );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (task == null) {
        return;
      }
      if (!task.isPlaying || task.timesecUpdatedTimestamp == null) {
        return;
      }
      const diffSec =
        (new Date().valueOf() - task.timesecUpdatedTimestamp) / 1000;
      const timesec = task.timesec + diffSec;
      updateTask({
        ...task,
        timesec,
        timesecUpdatedTimestamp: new Date().valueOf()
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [task, updateTask]);
  const moveTask = useCallback(
    (
      draggedTaskUuid: string,
      isOverLowerBody: boolean,
      isOverSubTaskArea: boolean
    ) => {
      if (props.uuid === draggedTaskUuid) {
        return;
      }
      if (isHaveSubtasks && isOverLowerBody) {
        // サブタスク持ちでした方向へのドロップの場合は無効にする。
        // この条件でドロップすると、ドロップされる位置がHover位置と異なるため混乱する。
        return;
      }
      dispatch(
        actionCreator.task.moveTask({
          draggedTaskUuid: draggedTaskUuid,
          droppedTaskUuid: props.uuid,
          direction: isOverLowerBody ? 'next' : 'prev'
        })
      );
      if (isOverLowerBody && isOverSubTaskArea) {
        dispatch(
          actionCreator.task.moveToSubTask({
            parentTaskUuid: props.uuid,
            taskUuid: draggedTaskUuid
          })
        );
      }
    },
    [dispatch, props.uuid, isHaveSubtasks]
  );
  // const moveToSubTask = () => {
  //   if (props.prevTaskUuid == null || task == null) {
  //     return;
  //   }
  //   dispatch(
  //     actionCreator.task.moveToSubTask({
  //       parentTaskUuid: props.prevTaskUuid,
  //       task
  //     })
  //   );
  // };
  const addSubTask = () => {
    if (task == null) {
      return;
    }
    dispatch(actionCreator.task.addSubTask({ uuid: task.uuid }));
  };

  const [
    dropRef,
    draggedItem,
    ,
    isOverUpperBody,
    isOverLowerBody,
    isOverSubTaskArea
  ] = useTaskDrop(moveTask);
  const [handleRef, previewRef] = useTaskDrag(props.uuid, setIsDragging);

  return (
    <div
      css={css`
        position: relative;
        opacity: ${isDragging ? 0.4 : 1};
        padding: ${isRootTask && isHaveSubtasks ? '6px 0' : 0};
        ${props.customCss};
      `}
      ref={previewRef}
    >
      <div ref={dropRef}>
        <Task
          ref={handleRef}
          uuid={task?.uuid || ''}
          title={task?.title || ''}
          timesec={task?.timesec || 0}
          isDone={task?.isDone || false}
          isPlaying={task?.isPlaying || false}
          comments={task?.comments || []}
          subTaskUuids={task?.subTaskUuids || []}
          addSec={(sec, current) => updateTimesec(current + sec)}
          subtractSec={(sec, current) => updateTimesec(current - sec)}
          done={isDone => updateIsDone(isDone)}
          play={() => updateIsPlaying(true)}
          pause={() => updateIsPlaying(false)}
          editTitle={value => updateTitle(value)}
          editComments={comments => updateComments(comments)}
          delete={() => deleteTask()}
          addTask={addTask}
          // moveToSubtask={moveToSubTask}
          addSubtask={addSubTask}
          focus={focusUuid === props.uuid}
        />
      </div>
      <div
        css={css`
          position: absolute;
          top: ${isRootTask && isHaveSubtasks ? '0px' : '-4px'};
          left: 0;
          height: 1.5px;
          width: 100%;
          background-color: ${isOverUpperBody &&
          draggedItem?.uuid !== props.uuid &&
          draggedItem?.uuid !== task?.parentTaskUuid
            ? colors.primary400
            : colors.transparent};
        `}
      ></div>
      {!isHaveSubtasks && (
        <div
          css={css`
            position: absolute;
            bottom: ${isRootTask ? '-4px' : '-6px'};
            left: 0;
            height: 2.5px;
            width: calc(100% - 24px);
            margin-left: ${isOverSubTaskArea ? '24px;' : ''};
            background-color: ${isOverLowerBody &&
            draggedItem?.uuid !== props.uuid &&
            draggedItem?.uuid !== task?.parentTaskUuid
              ? colors.primary400
              : colors.transparent};
          `}
        ></div>
      )}
      {task?.subTaskUuids &&
        task.subTaskUuids.map((uuid, i) => (
          <TaskContainer
            uuid={uuid}
            prevTaskUuid={i !== 0 ? task.subTaskUuids![i - 1] : undefined}
            key={uuid}
            customCss={css`
              margin-top: 6px;
              margin-left: 24px;
            `}
          />
        ))}
    </div>
  );
};

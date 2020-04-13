import React, { useEffect, useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { Task } from 'components/presentation/Task';
import { RootState, actionCreator } from 'store';
import { Task as TaskType, findTask } from 'model/task';
import { SectionIdContext } from 'pages/TasksPage';

export type Props = {
  uuid: string;
  prevTaskUuid?: string;
  parentTaskUuids: string[];
  customCss?: SerializedStyles;
};

export const TaskContainer: React.FC<Props> = props => {
  const task = useSelector((state: RootState) =>
    findTask(props.uuid, state.task.tasks, props.parentTaskUuids)
  );
  const focusUuid = useSelector((state: RootState) => state.task.focusUuid);
  const dispatch = useDispatch();
  const sectionId = useContext(SectionIdContext);

  const updateTask = useCallback(
    (task: TaskType) => {
      task.updatedAt = new Date();
      dispatch(
        actionCreator.task.updateTask({
          task,
          parentTaskUuids: props.parentTaskUuids
        })
      );
    },
    [dispatch, props.parentTaskUuids]
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
            sectionId
          })
        )
      : dispatch(actionCreator.task.addTaskByUuid({ uuid: props.uuid }));
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
    (draggedTaskUuid: string) => {
      if (props.uuid === draggedTaskUuid) {
        return;
      }
      dispatch(
        actionCreator.task.moveDragTask({
          draggedTaskUuid: draggedTaskUuid,
          droppedTaskUuid: props.uuid
        })
      );
    },
    [dispatch, props.uuid]
  );
  const moveToSubTask = () => {
    if (props.prevTaskUuid == null || task == null) {
      return;
    }
    console.log('--- dispatch movetosubtask: ', props.prevTaskUuid, task);
    dispatch(
      actionCreator.task.moveToSubTask({
        parentTaskUuid: props.prevTaskUuid,
        task
      })
    );
  };

  return (
    <div css={props.customCss}>
      <Task
        uuid={task?.uuid || ''}
        title={task?.title || ''}
        timesec={task?.timesec || 0}
        isDone={task?.isDone || false}
        isPlaying={task?.isPlaying || false}
        comments={task?.comments || []}
        addSec={(sec, current) => updateTimesec(current + sec)}
        subtractSec={(sec, current) => updateTimesec(current - sec)}
        done={isDone => updateIsDone(isDone)}
        play={() => updateIsPlaying(true)}
        pause={() => updateIsPlaying(false)}
        editTitle={value => updateTitle(value)}
        addComment={() => {}}
        editComments={comments => updateComments(comments)}
        delete={() => deleteTask()}
        onHover={moveTask}
        addTask={addTask}
        moveToSubtask={moveToSubTask}
        focus={focusUuid === props.uuid}
      />
      {task?.subTasks &&
        task.subTasks.map((subTask, i) => (
          <TaskContainer
            uuid={subTask.uuid}
            prevTaskUuid={i !== 0 ? task.subTasks![i - 1].uuid : undefined}
            parentTaskUuids={[...props.parentTaskUuids, task.uuid]}
            key={subTask.uuid}
            customCss={css`
              margin-top: 6px;
              margin-left: 24px;
            `}
          />
        ))}
    </div>
  );
};

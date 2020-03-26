import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Task } from 'components/presentation/Task';
import { RootState, actionCreator } from 'store';
import { Task as TaskType } from 'model/task';
import { SerializedStyles } from '@emotion/core';

export type Props = {
  uuid: string;
  customCss?: SerializedStyles;
};

export const TaskContainer: React.FC<Props> = props => {
  const task = useSelector((state: RootState) =>
    state.task.tasks.find(v => v.uuid === props.uuid)
  );
  const dispatch = useDispatch();

  const updateTask = useCallback(
    (task: TaskType) => {
      dispatch(actionCreator.task.updateTask({ task }));
    },
    [dispatch]
  );
  const updateTimesec = (sec: number) => {
    if (task == null) {
      return;
    }
    updateTask({
      ...task,
      timesec: sec
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
      isPlaying: isPlaying
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
    dispatch(actionCreator.task.deleteTask({ uuid: props.uuid }));
  };
  useEffect(() => {
    // TODO: isPlaying === true の時だけintervalをset
    const interval = setInterval(() => {
      if (task == null) {
        return;
      }
      if (task.isPlaying) {
        updateTask({
          ...task,
          timesec: task.timesec + 1
        });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [task, updateTask]);
  return (
    <Task
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
      customCss={props.customCss}
    />
  );
};

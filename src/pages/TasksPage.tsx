import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState, actionCreator } from 'store';
import { Task } from 'components/Task';

export const TasksPage: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Task Page</h1>
      {tasks.map(task => (
        <Task
          title={task.title}
          timesec={task.timesec}
          isDone={task.isDone}
          isPlaying={task.isPlaying}
          comments={task.comments}
          addSec={(sec, current) => {}}
          subtractSec={(sec, current) => {}}
          done={isDone => {}}
          play={() => {}}
          pause={() => {}}
          editTitle={value => {}}
          addComment={() => {}}
          editComments={comments => {}}
          delete={() => {}}
        />
      ))}
      <button onClick={() => dispatch(actionCreator.task.addTask())}>
        Add Task
      </button>
    </div>
  );
};

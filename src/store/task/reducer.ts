import produce from 'immer';

import { Actions } from './actions';
import { State, initState } from '.';
import { generateTask } from 'model/task';

export const reducer = (state: State = initState, action: Actions) => {
  switch (action.type) {
    case 'ADD_TASK':
      return produce(state, draft => {
        const task = generateTask();
        draft.tasks.push(task);
        draft.focusUuid = task.uuid;
      });
    case 'ADD_TASK_BY_UUID':
      return produce(state, draft => {
        const task = generateTask();
        const index = draft.tasks.findIndex(
          v => v.uuid === action.payload.uuid
        );
        if (index === -1) {
          draft.tasks.push(task);
        } else {
          draft.tasks.splice(index + 1, 0, task);
        }
        draft.focusUuid = task.uuid;
      });
    case 'UPDATE_TASK':
      return produce(state, draft => {
        const index = draft.tasks.findIndex(
          v => v.uuid === action.payload.task.uuid
        );
        if (index !== -1) {
          draft.tasks[index] = action.payload.task;
        }
      });
    case 'DELETE_TASK':
      return produce(state, draft => {
        const index = draft.tasks.findIndex(
          v => v.uuid === action.payload.uuid
        );
        if (index !== -1) {
          draft.tasks.splice(index, 1);
        }
      });
    default:
      return state;
  }
};

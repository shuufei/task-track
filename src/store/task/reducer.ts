import produce from 'immer';

import { Actions } from './actions';
import { State, initState } from '.';
import { generateTask } from 'model/task';

export const reducer = (state: State = initState, action: Actions) => {
  switch (action.type) {
    case 'ADD_TASK':
      return produce(state, draft => {
        draft.tasks.push(generateTask());
      });
    default:
      return state;
  }
};

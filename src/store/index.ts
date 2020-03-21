import { combineReducers, createStore } from 'redux';

import * as Task from './task';

export type RootState = {
  task: Task.State;
};

export const rootReducer = combineReducers({
  task: Task.reducer
});

export const actionCreator = {
  task: Task.actionCreator
};

export const store = createStore(rootReducer);

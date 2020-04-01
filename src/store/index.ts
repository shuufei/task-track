import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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

const perisistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(perisistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);

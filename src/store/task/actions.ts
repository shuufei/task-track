import { Action } from 'redux';

export interface AddTaskAction extends Action {
  type: 'ADD_TASK';
}

export const addTask = (): AddTaskAction => ({
  type: 'ADD_TASK'
});

export type Actions = AddTaskAction;

export const actionCreator = {
  addTask
};

import { Action } from 'redux';
import { Task } from 'model/task';

/** Action Definitions */
export interface AddTaskAction extends Action {
  type: 'ADD_TASK';
}
export interface UpdateTaskAction extends Action {
  type: 'UPDATE_TASK';
  payload: { task: Task };
}
export type Actions = AddTaskAction | UpdateTaskAction;

/** Action Creators */
export const addTask = (): AddTaskAction => ({
  type: 'ADD_TASK'
});
export const updateTask = (
  payload: UpdateTaskAction['payload']
): UpdateTaskAction => ({
  type: 'UPDATE_TASK',
  payload
});
export const actionCreator = {
  addTask,
  updateTask
};

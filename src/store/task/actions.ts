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
export interface DeleteTaskAction extends Action {
  type: 'DELETE_TASK';
  payload: { uuid: string };
}
export type Actions = AddTaskAction | UpdateTaskAction | DeleteTaskAction;

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
export const deleteTask = (
  payload: DeleteTaskAction['payload']
): DeleteTaskAction => ({
  type: 'DELETE_TASK',
  payload
});
export const actionCreator = {
  addTask,
  updateTask,
  deleteTask
};

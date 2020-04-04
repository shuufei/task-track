import { Action } from 'redux';
import { Task } from 'model/task';

/** Action Definitions */
export interface AddTaskAction extends Action {
  type: 'ADD_TASK';
}
export interface AddTaskByUuidAction extends Action {
  type: 'ADD_TASK_BY_UUID';
  payload: { uuid: string };
}
export interface UpdateTaskAction extends Action {
  type: 'UPDATE_TASK';
  payload: { task: Task };
}
export interface DeleteTaskAction extends Action {
  type: 'DELETE_TASK';
  payload: { uuid: string };
}
export interface SetHoverTaskUuidAction extends Action {
  type: 'SET_HOVER_TASK_UUID';
  payload: { uuid: string | undefined };
}
export interface MoveDragTaskAction extends Action {
  type: 'MOVE_TASK';
  payload: { draggedTaskUuid: string; droppedTaskUuid: string };
}
export type Actions =
  | AddTaskAction
  | AddTaskByUuidAction
  | UpdateTaskAction
  | DeleteTaskAction
  | SetHoverTaskUuidAction
  | MoveDragTaskAction;

/** Action Creators */
export const addTask = (): AddTaskAction => ({
  type: 'ADD_TASK'
});
export const addTaskByUuid = (
  payload: AddTaskByUuidAction['payload']
): AddTaskByUuidAction => ({
  type: 'ADD_TASK_BY_UUID',
  payload
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
export const setHoverTaskUuid = (
  payload: SetHoverTaskUuidAction['payload']
): SetHoverTaskUuidAction => ({
  type: 'SET_HOVER_TASK_UUID',
  payload
});
export const moveDragTask = (
  payload: MoveDragTaskAction['payload']
): MoveDragTaskAction => ({
  type: 'MOVE_TASK',
  payload
});
export const actionCreator = {
  addTask,
  addTaskByUuid,
  updateTask,
  deleteTask,
  setHoverTaskUuid,
  moveDragTask
};

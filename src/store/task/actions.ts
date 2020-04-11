import { Action } from 'redux';
import { Task } from 'model/task';
import { Section } from 'model/section';

/** Action Definitions */
export interface AddTaskAction extends Action {
  type: 'ADD_TASK';
}
export interface AddTaskToSectionAction extends Action {
  type: 'ADD_TASK_TO_SECTION';
  payload: { sectionId: string };
}
export interface AddTaskByUuidAction extends Action {
  type: 'ADD_TASK_BY_UUID';
  payload: { uuid: string };
}
export interface AddTaskByUuidToSectionAction extends Action {
  type: 'ADD_TASK_BY_UUID_TO_SECTION';
  payload: { uuid: string; sectionId: string };
}
export interface UpdateTaskAction extends Action {
  type: 'UPDATE_TASK';
  payload: { task: Task };
}
export interface DeleteTaskAction extends Action {
  type: 'DELETE_TASK';
  payload: { uuid: string; sectionId?: string };
}
export interface MoveDragTaskAction extends Action {
  type: 'MOVE_TASK';
  payload: { draggedTaskUuid: string; droppedTaskUuid: string };
}
export interface UpdateFocusTaskUuidAction extends Action {
  type: 'UPDATE_FOCUS_TASK_UUID';
  payload: { uuid: string | undefined };
}
export interface AddSectionAction extends Action {
  type: 'ADD_SECTION';
}
export interface UpdateSectionTitleAction extends Action {
  type: 'UPDATE_SECTION_TITLE';
  payload: Section;
}
export interface DeleteSectionAction extends Action {
  type: 'DELETE_SECTION';
  payload: { sectionId: string };
}
export interface MoveDragSectionAction extends Action {
  type: 'MOVE_DRAG_SECTION';
  payload: { draggedSectionId: string; droppedSectionId: string };
}
export type Actions =
  | AddTaskAction
  | AddTaskToSectionAction
  | AddTaskByUuidAction
  | AddTaskByUuidToSectionAction
  | UpdateTaskAction
  | DeleteTaskAction
  | MoveDragTaskAction
  | UpdateFocusTaskUuidAction
  | AddSectionAction
  | UpdateSectionTitleAction
  | DeleteSectionAction
  | MoveDragSectionAction;

/** Action Creators */
export const addTask = (): AddTaskAction => ({
  type: 'ADD_TASK'
});
export const addTaskToSection = (
  payload: AddTaskToSectionAction['payload']
): AddTaskToSectionAction => ({
  type: 'ADD_TASK_TO_SECTION',
  payload
});
export const addTaskByUuid = (
  payload: AddTaskByUuidAction['payload']
): AddTaskByUuidAction => ({
  type: 'ADD_TASK_BY_UUID',
  payload
});
export const addTaskByUuidToSection = (
  payload: AddTaskByUuidToSectionAction['payload']
): AddTaskByUuidToSectionAction => ({
  type: 'ADD_TASK_BY_UUID_TO_SECTION',
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
export const moveDragTask = (
  payload: MoveDragTaskAction['payload']
): MoveDragTaskAction => ({
  type: 'MOVE_TASK',
  payload
});
export const updateFocusTaskUuid = (
  payload: UpdateFocusTaskUuidAction['payload']
): UpdateFocusTaskUuidAction => ({
  type: 'UPDATE_FOCUS_TASK_UUID',
  payload
});
export const addSection = (): AddSectionAction => ({
  type: 'ADD_SECTION'
});
export const updateSectionTitle = (
  payload: UpdateSectionTitleAction['payload']
): UpdateSectionTitleAction => ({ type: 'UPDATE_SECTION_TITLE', payload });
export const deleteSection = (
  payload: DeleteSectionAction['payload']
): DeleteSectionAction => ({ type: 'DELETE_SECTION', payload });
export const moveDragSection = (
  payload: MoveDragSectionAction['payload']
): MoveDragSectionAction => ({ type: 'MOVE_DRAG_SECTION', payload });
export const actionCreator = {
  addTask,
  addTaskToSection,
  addTaskByUuid,
  addTaskByUuidToSection,
  updateTask,
  deleteTask,
  moveDragTask,
  updateFocusTaskUuid,
  addSection,
  updateSectionTitle,
  deleteSection,
  moveDragSection
};

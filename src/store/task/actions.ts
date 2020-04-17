import { Action } from 'redux';
import { Task } from 'model/task';
import { Section } from 'model/section';

export type MoveDirection = 'prev' | 'next';

/** Action Definitions */
export interface AddTaskAction extends Action {
  type: 'ADD_TASK';
  payload: { parentTaskUuid?: string };
}
export interface AddTaskToSectionAction extends Action {
  type: 'ADD_TASK_TO_SECTION';
  payload: { sectionId: string; parentTaskUuid?: string };
}
export interface AddTaskByUuidAction extends Action {
  type: 'ADD_TASK_BY_UUID';
  payload: { uuid: string; parentTaskUuid?: string };
}
export interface AddTaskByUuidToSectionAction extends Action {
  type: 'ADD_TASK_BY_UUID_TO_SECTION';
  payload: { uuid: string; sectionId: string; parentTaskUuid?: string };
}
export interface UpdateTaskAction extends Action {
  type: 'UPDATE_TASK';
  payload: { task: Task };
}
export interface DeleteTaskAction extends Action {
  type: 'DELETE_TASK';
  payload: { uuid: string; sectionId?: string };
}
export interface MoveTaskAction extends Action {
  type: 'MOVE_TASK';
  payload: {
    draggedTaskUuid: string;
    droppedTaskUuid: string;
    direction: MoveDirection;
  };
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
export interface MoveToSubTaskAction extends Action {
  type: 'MOVE_TO_SUB_TASK';
  payload: { parentTaskUuid: string; task: Task };
}
export interface PauseAllTaskAction extends Action {
  type: 'PAUSE_ALL_TASK';
}
export type Actions =
  | AddTaskAction
  | AddTaskToSectionAction
  | AddTaskByUuidAction
  | AddTaskByUuidToSectionAction
  | UpdateTaskAction
  | DeleteTaskAction
  | MoveTaskAction
  | UpdateFocusTaskUuidAction
  | AddSectionAction
  | UpdateSectionTitleAction
  | DeleteSectionAction
  | MoveDragSectionAction
  | MoveToSubTaskAction
  | PauseAllTaskAction;

/** Action Creators */
export const addTask = (payload: AddTaskAction['payload']): AddTaskAction => ({
  type: 'ADD_TASK',
  payload
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
export const moveTask = (
  payload: MoveTaskAction['payload']
): MoveTaskAction => ({
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
export const moveToSubTask = (
  payload: MoveToSubTaskAction['payload']
): MoveToSubTaskAction => ({ type: 'MOVE_TO_SUB_TASK', payload });
export const pauseAllTask = (): PauseAllTaskAction => ({
  type: 'PAUSE_ALL_TASK'
});
export const actionCreator = {
  addTask,
  addTaskToSection,
  addTaskByUuid,
  addTaskByUuidToSection,
  updateTask,
  deleteTask,
  moveTask,
  updateFocusTaskUuid,
  addSection,
  updateSectionTitle,
  deleteSection,
  moveDragSection,
  moveToSubTask,
  pauseAllTask
};

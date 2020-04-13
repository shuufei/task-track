import produce from 'immer';

import { Actions } from './actions';
import { State, initState } from '.';
import { generateTask, findTask } from 'model/task';
import { generateSection } from 'model/section';

export const reducer = (state: State = initState, action: Actions) => {
  switch (action.type) {
    case 'ADD_TASK':
      return produce(state, draft => {
        const task = generateTask();
        draft.tasks.push(task);
        draft.focusUuid = task.uuid;
      });
    case 'ADD_TASK_TO_SECTION':
      return produce(state, draft => {
        const task = generateTask();
        draft.tasks.push({ ...task, sectionId: action.payload.sectionId });
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
    case 'ADD_TASK_BY_UUID_TO_SECTION':
      return produce(state, draft => {
        const task = { ...generateTask(), sectionId: action.payload.sectionId };
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
        // const index = draft.tasks.findIndex(
        //   v => v.uuid === action.payload.task.uuid
        // );
        // if (index !== -1) {
        //   draft.tasks[index] = action.payload.task;
        // }
        const updateTask = findTask(
          action.payload.task.uuid,
          draft.tasks,
          action.payload.parentTaskUuids
        );
        if (updateTask != null) {
          Object.assign(updateTask, action.payload.task);
        }
      });
    case 'DELETE_TASK':
      return produce(state, draft => {
        const index = draft.tasks.findIndex(
          v => v.uuid === action.payload.uuid
        );
        const sectionTasks = draft.tasks.filter(
          v => v.sectionId === action.payload.sectionId
        );
        const indexOfSection = sectionTasks.findIndex(
          v => v.uuid === action.payload.uuid
        );
        if (index !== -1) {
          draft.tasks.splice(index, 1);
        }

        if (indexOfSection > 0) {
          const prevTaskOfSection = sectionTasks[indexOfSection - 1];
          draft.focusUuid = prevTaskOfSection.uuid;
        }
      });
    case 'MOVE_TASK':
      return produce(state, draft => {
        const droppedTaskIndex = draft.tasks.findIndex(
          v => v.uuid === action.payload.droppedTaskUuid
        );
        if (droppedTaskIndex === -1) {
          return;
        }
        const moveTaskIndex = draft.tasks.findIndex(
          v => v.uuid === action.payload.draggedTaskUuid
        );
        if (moveTaskIndex === -1) {
          return;
        }

        // ドロップ先のsectionに変更する
        draft.tasks[moveTaskIndex].sectionId =
          draft.tasks[droppedTaskIndex].sectionId;

        // 移動先のindex。移動もとのtaskはまだ削除していないので、移動もとより後方にある場合は、1プラスする
        const distIndex =
          droppedTaskIndex > moveTaskIndex
            ? droppedTaskIndex + 1
            : droppedTaskIndex;
        draft.tasks.splice(distIndex, 0, draft.tasks[moveTaskIndex]);
        const draggedTaskIndex = draft.tasks.findIndex(
          (v, i) => v.uuid === action.payload.draggedTaskUuid && i !== distIndex
        );
        if (draggedTaskIndex === -1) {
          return;
        }
        draft.tasks.splice(draggedTaskIndex, 1);
      });
    case 'UPDATE_FOCUS_TASK_UUID':
      return produce(state, draft => {
        draft.focusUuid = action.payload.uuid;
      });
    case 'ADD_SECTION':
      return produce(state, draft => {
        draft.sections.push(generateSection());
      });
    case 'UPDATE_SECTION_TITLE':
      return produce(state, draft => {
        const section = draft.sections.find(v => v.id === action.payload.id);
        if (section == null) {
          return;
        }
        section.title = action.payload.title;
      });
    case 'DELETE_SECTION':
      return produce(state, draft => {
        const index = draft.sections.findIndex(
          v => v.id === action.payload.sectionId
        );
        if (index === -1) {
          return;
        }
        draft.sections.splice(index, 1);
        const sectionTasks = draft.tasks.filter(
          v => v.sectionId === action.payload.sectionId
        );
        sectionTasks.forEach(v => {
          const taskIndex = draft.tasks.findIndex(t => t.uuid === v.uuid);
          if (taskIndex === -1) {
            return;
          }
          draft.tasks.splice(taskIndex, 1);
        });
      });
    case 'MOVE_DRAG_SECTION':
      return produce(state, draft => {
        const droppedSectionIndex = draft.sections.findIndex(
          v => v.id === action.payload.droppedSectionId
        );
        if (droppedSectionIndex === -1) {
          return;
        }
        const moveSectionIndex = draft.sections.findIndex(
          v => v.id === action.payload.draggedSectionId
        );
        if (moveSectionIndex === -1) {
          return;
        }

        // 移動先のindex。移動もとのsectionはまだ削除していないので、移動下より後方にある場合は、1プラスする。
        const distIndex =
          droppedSectionIndex > moveSectionIndex
            ? droppedSectionIndex + 1
            : droppedSectionIndex;
        draft.sections.splice(distIndex, 0, draft.sections[moveSectionIndex]);
        const draggedSectionIndex = draft.sections.findIndex(
          (v, i) => v.id === action.payload.draggedSectionId && i !== distIndex
        );
        if (draggedSectionIndex === -1) {
          return;
        }
        draft.sections.splice(draggedSectionIndex, 1);
      });
    case 'MOVE_TO_SUB_TASK':
      return produce(state, draft => {
        const parent = draft.tasks.find(
          v => v.uuid === action.payload.parentTaskUuid
        );
        if (parent == null) {
          return;
        }
        const movedTask = { ...action.payload.task };
        movedTask.sectionId = parent.sectionId;
        parent.subTasks != null
          ? parent.subTasks.push(movedTask)
          : (parent.subTasks = [movedTask]);
        const movedTaskIndex = draft.tasks.findIndex(
          v => v.uuid === movedTask.uuid
        );
        if (movedTaskIndex === -1) {
          return;
        }
        draft.tasks.splice(movedTaskIndex, 1);
      });
    default:
      return state;
  }
};

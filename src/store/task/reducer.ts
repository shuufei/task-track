import produce from 'immer';

import { Actions, MoveDirection } from './actions';
import { State, initState } from '.';
import { generateTask, Task } from 'model/task';
import { generateSection } from 'model/section';

export const removeSubTaskFromParent = (
  tasks: Task[],
  parentTaskUuid: string,
  childTaskUuid: string
) => {
  const parentTask = tasks.find(v => v.uuid === parentTaskUuid);
  if (parentTask == null || parentTask.subTaskUuids == null) {
    return;
  }
  const subTaskIndex = parentTask.subTaskUuids.findIndex(
    v => v === childTaskUuid
  );
  if (subTaskIndex !== -1) {
    parentTask.subTaskUuids.splice(subTaskIndex, 1);
  }
};

export const getParentTaskAndChildIndex = (
  tasks: Task[],
  parentTaskUuid: string,
  childTaskUuid?: string
): [Task | undefined, number | undefined] => {
  const parentTask = tasks.find(v => v.uuid === parentTaskUuid);
  if (parentTask == null || parentTask.subTaskUuids == null) {
    return [undefined, undefined];
  }
  const childTaskIndex = parentTask.subTaskUuids.findIndex(
    v => v === childTaskUuid
  );
  return childTaskIndex !== -1
    ? [parentTask, childTaskIndex]
    : [parentTask, undefined];
};

export const addSubTaskToParent = (
  tasks: Task[],
  parentTaskUuid: string,
  childTaskUuid: string,
  prevTaskUuid?: string
) => {
  const [parentTask, prevTaskIndex] = getParentTaskAndChildIndex(
    tasks,
    parentTaskUuid,
    prevTaskUuid
  );
  if (parentTask == null || parentTask.subTaskUuids == null) {
    return;
  }
  if (prevTaskIndex == null) {
    parentTask.subTaskUuids.push(childTaskUuid);
  } else {
    parentTask.subTaskUuids.splice(prevTaskIndex + 1, 0, childTaskUuid);
  }
};

// サブタスク間での移動
const moveSubTaskToSubTask = (
  tasks: Task[],
  draggedTask: Task,
  droppedTask: Task,
  direction: MoveDirection
) => {
  if (
    droppedTask.parentTaskUuid == null ||
    draggedTask.parentTaskUuid == null
  ) {
    return;
  }

  const [parent, droppedSubTaskIndex] = getParentTaskAndChildIndex(
    tasks,
    droppedTask.parentTaskUuid,
    droppedTask.uuid
  );

  if (
    parent == null ||
    droppedSubTaskIndex == null ||
    parent.subTaskUuids == null
  ) {
    return;
  }

  const distIndex =
    direction === 'next' ? droppedSubTaskIndex + 1 : droppedSubTaskIndex;
  // 親のサブタスクに追加
  parent.subTaskUuids.splice(distIndex, 0, draggedTask.uuid);

  if (droppedTask.parentTaskUuid === draggedTask.parentTaskUuid) {
    // 親が同じ場合は、元の位置のサブタスクを削除
    const moveTaskDroppedIndex = parent.subTaskUuids.findIndex(
      (v, i) => v === draggedTask.uuid && i !== distIndex
    );
    parent.subTaskUuids.splice(moveTaskDroppedIndex, 1);
  } else {
    // 親が異なる場合は、単純に元の親から削除
    removeSubTaskFromParent(
      tasks,
      draggedTask.parentTaskUuid,
      draggedTask.uuid
    );
    draggedTask.parentTaskUuid = parent.uuid;
  }
};

// タスク間での移動
const moveTaskToTask = (
  tasks: Task[],
  draggedTask: Task,
  droppedTask: Task,
  direction: MoveDirection
) => {
  const droppedTaskIndex = tasks.findIndex(v => v.uuid === droppedTask.uuid);
  if (droppedTaskIndex === -1) {
    return;
  }
  const draggedTaskIndex = tasks.findIndex(v => v.uuid === draggedTask.uuid);
  if (draggedTaskIndex === -1) {
    return;
  }
  const distIndex =
    direction === 'next' ? droppedTaskIndex + 1 : droppedTaskIndex;

  // 移動さきに追加
  tasks.splice(distIndex, 0, tasks[draggedTaskIndex]);

  // 移動元の位置にあるタスクを削除
  const draggedTaskOldIndex = tasks.findIndex(
    (v, i) => v.uuid === draggedTask.uuid && i !== distIndex
  );
  if (draggedTaskOldIndex === -1) {
    return;
  }
  tasks.splice(draggedTaskOldIndex, 1);
};

// タスクをサブタスクに移動
const moveTaskToSubTask = (
  tasks: Task[],
  draggedTask: Task,
  droppedTask: Task,
  direction: MoveDirection
) => {
  if (droppedTask.parentTaskUuid == null) {
    return;
  }

  if (draggedTask.uuid === droppedTask.parentTaskUuid) {
    // ドラッグタスクのドロップ先が自身のサブタスクの場合は無効
    return;
  }
  const [parent, droppedSubTaskIndex] = getParentTaskAndChildIndex(
    tasks,
    droppedTask.parentTaskUuid,
    droppedTask.uuid
  );

  if (
    parent == null ||
    droppedSubTaskIndex == null ||
    parent.subTaskUuids == null
  ) {
    return;
  }

  const distIndex =
    direction === 'next' ? droppedSubTaskIndex + 1 : droppedSubTaskIndex;
  // 親のサブタスクに追加
  parent.subTaskUuids.splice(distIndex, 0, draggedTask.uuid);
  draggedTask.parentTaskUuid = parent.uuid;
};

// サブタスクをタスクに移動
const moveSubTaskToTask = (
  tasks: Task[],
  draggedTask: Task,
  droppedTask: Task,
  direction: MoveDirection
) => {
  if (draggedTask.parentTaskUuid == null) {
    return;
  }

  // 親のサブタスクから削除
  removeSubTaskFromParent(tasks, draggedTask.parentTaskUuid, draggedTask.uuid);

  const droppedTaskIndex = tasks.findIndex(v => v.uuid === droppedTask.uuid);
  if (droppedTaskIndex === -1) {
    return;
  }

  const distIndex =
    direction === 'next' ? droppedTaskIndex + 1 : droppedTaskIndex;
  // ドロップ先に追加
  tasks.splice(distIndex, 0, draggedTask);

  const draggedTaskIndex = tasks.findIndex(
    (v, i) => v.uuid === draggedTask.uuid && i !== distIndex
  );
  if (draggedTaskIndex === -1) {
    return;
  }
  // 移動元の位置にあるタスクを削除
  tasks.splice(draggedTaskIndex, 1);
  draggedTask.parentTaskUuid = undefined;
};

export const reducer = (state: State = initState, action: Actions) => {
  switch (action.type) {
    case 'ADD_TASK':
      return produce(state, draft => {
        const task = generateTask();

        // 親タスクに関連を追加
        if (action.payload.parentTaskUuid != null) {
          task.parentTaskUuid = action.payload.parentTaskUuid;
          addSubTaskToParent(
            draft.tasks,
            action.payload.parentTaskUuid,
            task.uuid
          );
        }

        draft.tasks.push(task);
        draft.focusUuid = task.uuid;
      });
    case 'ADD_TASK_TO_SECTION':
      return produce(state, draft => {
        const task = generateTask();

        // 親タスクに関連を追加
        if (action.payload.parentTaskUuid != null) {
          task.parentTaskUuid = action.payload.parentTaskUuid;
          addSubTaskToParent(
            draft.tasks,
            action.payload.parentTaskUuid,
            task.uuid
          );
        }

        draft.tasks.push({ ...task, sectionId: action.payload.sectionId });
        draft.focusUuid = task.uuid;
      });
    case 'ADD_TASK_BY_UUID':
      return produce(state, draft => {
        const task = generateTask();

        if (action.payload.parentTaskUuid != null) {
          // 親タスクに関連を追加
          task.parentTaskUuid = action.payload.parentTaskUuid;
          addSubTaskToParent(
            draft.tasks,
            action.payload.parentTaskUuid,
            task.uuid,
            action.payload.uuid
          );
          draft.tasks.push(task);
        } else {
          const index = draft.tasks.findIndex(
            v => v.uuid === action.payload.uuid
          );
          if (index === -1) {
            draft.tasks.push(task);
          } else {
            draft.tasks.splice(index + 1, 0, task);
          }
        }

        draft.focusUuid = task.uuid;
      });
    case 'ADD_TASK_BY_UUID_TO_SECTION':
      return produce(state, draft => {
        const task = { ...generateTask(), sectionId: action.payload.sectionId };

        if (action.payload.parentTaskUuid != null) {
          // 親タスクに関連を追加
          task.parentTaskUuid = action.payload.parentTaskUuid;
          addSubTaskToParent(
            draft.tasks,
            action.payload.parentTaskUuid,
            task.uuid,
            action.payload.uuid
          );
          draft.tasks.push(task);
        } else {
          const index = draft.tasks.findIndex(
            v => v.uuid === action.payload.uuid
          );
          if (index === -1) {
            draft.tasks.push(task);
          } else {
            draft.tasks.splice(index + 1, 0, task);
          }
        }
        draft.focusUuid = task.uuid;
      });
    case 'UPDATE_TASK':
      return produce(state, draft => {
        const index = draft.tasks.findIndex(
          v => v.uuid === action.payload.task.uuid
        );
        if (index !== -1) {
          draft.tasks[index] = action.payload.task;
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

        // 親タスクから関連を削除
        const deleteTask = draft.tasks[index];
        if (deleteTask.parentTaskUuid != null) {
          removeSubTaskFromParent(
            draft.tasks,
            deleteTask.parentTaskUuid,
            deleteTask.uuid
          );
        }

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
        const droppedTask = draft.tasks.find(
          v => v.uuid === action.payload.droppedTaskUuid
        );
        const moveTask = draft.tasks.find(
          v => v.uuid === action.payload.draggedTaskUuid
        );

        if (droppedTask == null || moveTask == null) {
          return;
        }

        // ドロップ先のsectionに変更する
        moveTask.sectionId = droppedTask.sectionId;

        if (
          // 両方サブタスクの場合
          droppedTask.parentTaskUuid != null &&
          moveTask.parentTaskUuid != null
        ) {
          moveSubTaskToSubTask(
            draft.tasks,
            moveTask,
            droppedTask,
            action.payload.direction
          );
        } else if (
          // 両方サブタスクでない場合
          droppedTask.parentTaskUuid == null &&
          moveTask.parentTaskUuid == null
        ) {
          moveTaskToTask(
            draft.tasks,
            moveTask,
            droppedTask,
            action.payload.direction
          );
        } else if (
          // ドロップ先のタスクがサブタスクの場合
          droppedTask.parentTaskUuid != null &&
          moveTask.parentTaskUuid == null
        ) {
          moveTaskToSubTask(
            draft.tasks,
            moveTask,
            droppedTask,
            action.payload.direction
          );
        } else if (
          // ドラッグ対象のタスクがサブタスクの場合
          droppedTask.parentTaskUuid == null &&
          moveTask.parentTaskUuid != null
        ) {
          moveSubTaskToTask(
            draft.tasks,
            moveTask,
            droppedTask,
            action.payload.direction
          );
        }
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

        // Sectionを合わせる
        const movedTask = { ...action.payload.task };
        movedTask.sectionId = parent.sectionId;

        // 親のタスクのsubTaskに追加
        if (parent.subTaskUuids == null) {
          parent.subTaskUuids = [];
        }
        parent.subTaskUuids.push(movedTask.uuid);
        const movedTaskIndex = draft.tasks.findIndex(
          v => v.uuid === movedTask.uuid
        );
        if (movedTaskIndex === -1) {
          return;
        }

        // 移動前の親タスクから関連を削除
        if (movedTask.parentTaskUuid != null) {
          removeSubTaskFromParent(
            draft.tasks,
            movedTask.parentTaskUuid,
            movedTask.uuid
          );
        }

        // 親タスクのuuidを保持
        draft.tasks[movedTaskIndex].parentTaskUuid = parent.uuid;
      });
    default:
      return state;
  }
};

import produce from 'immer';

import { Actions, MoveDirection } from './actions';
import { State, initState } from '.';
import { generateTask, Task } from 'model/task';
import { generateSection } from 'model/section';

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

export const removeSubTaskFromParent = (
  tasks: Task[],
  parentTaskUuid: string,
  childTaskUuid: string
) => {
  const [parentTask, childIndex] = getParentTaskAndChildIndex(
    tasks,
    parentTaskUuid,
    childTaskUuid
  );
  if (
    parentTask != null &&
    parentTask.subTaskUuids != null &&
    childIndex != null &&
    childIndex !== -1
  ) {
    parentTask.subTaskUuids.splice(childIndex, 1);
  }
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

const recursiveInvokeFnParentTask = (
  tasks: Task[],
  task: Task,
  fn: (parent: Task) => void
) => {
  let isExistParent = task.parentTaskUuid != null;
  let childTask = task;
  while (isExistParent) {
    const _childTask = childTask;
    const parentTask = tasks.find(v => v.uuid === _childTask.parentTaskUuid);
    if (
      parentTask == null ||
      (parentTask != null && parentTask.subTaskUuids == null)
    ) {
      return;
    }
    fn(parentTask);
    isExistParent = parentTask.parentTaskUuid != null;
    childTask = parentTask;
  }
};

const recursiveInvokeFnChildTask = (
  tasks: Task[],
  task: Task,
  fn: (child: Task) => void
) => {
  if (
    !(task != null && task.subTaskUuids != null && task.subTaskUuids.length > 0)
  ) {
    return;
  }

  let childTaskUuids = task.subTaskUuids;
  childTaskUuids?.forEach(uuid => {
    const childTask = tasks.find(v => v.uuid === uuid);
    if (childTask == null) {
      return;
    }
    fn(childTask);
    recursiveInvokeFnChildTask(tasks, childTask, fn);
  });
};

const updateParentTimesec = (tasks: Task[], parent: Task) => {
  const timesec = parent.subTaskUuids!.reduce((acc, curr) => {
    const task = tasks.find(v => v.uuid === curr);
    if (task == null) {
      return acc;
    }
    return acc + task.timesec;
  }, 0);
  parent.timesec = timesec;
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

        if (draft.tasks[index] == null) {
          return;
        }

        const isChangedTimesec =
          draft.tasks[index].timesec !== action.payload.task.timesec;
        const isChangedIsPlaying =
          draft.tasks[index].isPlaying !== action.payload.task.isPlaying;
        const isChangedIsDone =
          draft.tasks[index].isDone !== action.payload.task.isDone;

        if (index !== -1) {
          draft.tasks[index] = action.payload.task;
        }

        // 親タスクのtimesecを再帰的に更新する
        if (isChangedTimesec && action.payload.task.parentTaskUuid != null) {
          recursiveInvokeFnParentTask(
            draft.tasks,
            action.payload.task,
            parent => {
              updateParentTimesec(draft.tasks, parent);
            }
          );
        }

        // 親タスクの再生状態を再帰的に更新する
        if (isChangedIsPlaying && action.payload.task.parentTaskUuid != null) {
          recursiveInvokeFnParentTask(
            draft.tasks,
            action.payload.task,
            parent => {
              parent.isPlaying = action.payload.task.isPlaying;
            }
          );
        }

        // 子タスクの完了状態と再生状態を再帰的に更新する
        if (
          isChangedIsDone &&
          action.payload.task.subTaskUuids != null &&
          action.payload.task.subTaskUuids.length > 0 &&
          action.payload.task.isDone
        ) {
          recursiveInvokeFnChildTask(
            draft.tasks,
            action.payload.task,
            child => {
              child.isDone = true;
              child.isPlaying = false;
            }
          );
        }

        // 親タスクの完了状態を再帰的に更新する
        if (
          isChangedIsDone &&
          action.payload.task.parentTaskUuid != null &&
          !action.payload.task.isDone
        ) {
          recursiveInvokeFnParentTask(
            draft.tasks,
            action.payload.task,
            parent => {
              parent.isDone = false;
            }
          );
        }
      });
    case 'DELETE_TASK':
      return produce(state, draft => {
        const deleteTask = draft.tasks.find(
          v => v.uuid === action.payload.uuid
        );
        const sectionTasks = draft.tasks.filter(
          v => v.sectionId === action.payload.sectionId
        );

        if (deleteTask == null) {
          return;
        }

        // 再帰的にsubtaskを削除する
        recursiveInvokeFnChildTask(draft.tasks, deleteTask, child => {
          const childTaskIndex = draft.tasks.findIndex(
            v => v.uuid === child.uuid
          );
          if (childTaskIndex === -1) {
            return;
          }
          draft.tasks.splice(childTaskIndex, 1);
        });

        if (deleteTask.parentTaskUuid != null) {
          // 親タスクから関連を削除
          const [parent, childIndex] = getParentTaskAndChildIndex(
            draft.tasks,
            deleteTask.parentTaskUuid,
            deleteTask.uuid
          );
          if (
            parent != null &&
            parent.subTaskUuids != null &&
            childIndex != null
          ) {
            parent.subTaskUuids.splice(childIndex, 1);
            if (childIndex > 0) {
              draft.focusUuid = parent.subTaskUuids[childIndex - 1];
            }
          }
          // 削除されたタスクの親のtimeseを再帰的に更新
          recursiveInvokeFnParentTask(draft.tasks, deleteTask, parent => {
            updateParentTimesec(draft.tasks, parent);
          });
        } else {
          const taskIndexOfSection = sectionTasks.findIndex(
            v => v.uuid === action.payload.uuid && v.parentTaskUuid == null
          );
          if (taskIndexOfSection > 0) {
            const prevTaskOfSection = sectionTasks[taskIndexOfSection - 1];
            draft.focusUuid = prevTaskOfSection.uuid;
          }
        }

        const deleteTaskIndex = draft.tasks.findIndex(
          v => v.uuid === action.payload.uuid
        );

        if (deleteTaskIndex !== -1) {
          draft.tasks.splice(deleteTaskIndex, 1);
        }
      });
    case 'MOVE_TASK':
      return produce(state, draft => {
        const droppedTask = draft.tasks.find(
          v => v.uuid === action.payload.droppedTaskUuid
        );
        const draggedTask = draft.tasks.find(
          v => v.uuid === action.payload.draggedTaskUuid
        );

        if (droppedTask == null || draggedTask == null) {
          return;
        }

        // ドロップ先のsectionに変更する
        draggedTask.sectionId = droppedTask.sectionId;

        if (
          // 両方サブタスクの場合
          droppedTask.parentTaskUuid != null &&
          draggedTask.parentTaskUuid != null
        ) {
          const draggedTaskParentTask = draft.tasks.find(
            v => v.uuid === draggedTask.parentTaskUuid
          );
          moveSubTaskToSubTask(
            draft.tasks,
            draggedTask,
            droppedTask,
            action.payload.direction
          );

          // ドラッグされたタスクの親のtimesecを再帰的に更新
          updateParentTimesec(draft.tasks, draggedTaskParentTask!);
          recursiveInvokeFnParentTask(
            draft.tasks,
            draggedTaskParentTask!,
            parent => {
              updateParentTimesec(draft.tasks, parent);
            }
          );

          // ドロップされたタスクの親のtimeseを再帰的に更新
          recursiveInvokeFnParentTask(draft.tasks, draggedTask, parent => {
            updateParentTimesec(draft.tasks, parent);
          });
        } else if (
          // 両方サブタスクでない場合
          droppedTask.parentTaskUuid == null &&
          draggedTask.parentTaskUuid == null
        ) {
          moveTaskToTask(
            draft.tasks,
            draggedTask,
            droppedTask,
            action.payload.direction
          );
          recursiveInvokeFnParentTask(draft.tasks, draggedTask, parent => {
            updateParentTimesec(draft.tasks, parent);
          });
        } else if (
          // ドロップ先のタスクがサブタスクの場合
          droppedTask.parentTaskUuid != null &&
          draggedTask.parentTaskUuid == null
        ) {
          moveTaskToSubTask(
            draft.tasks,
            draggedTask,
            droppedTask,
            action.payload.direction
          );
          recursiveInvokeFnParentTask(draft.tasks, draggedTask, parent => {
            updateParentTimesec(draft.tasks, parent);
          });
        } else if (
          // ドラッグ対象のタスクがサブタスクの場合
          droppedTask.parentTaskUuid == null &&
          draggedTask.parentTaskUuid != null
        ) {
          const draggedTaskParentTask = draft.tasks.find(
            v => v.uuid === draggedTask.parentTaskUuid
          );
          moveSubTaskToTask(
            draft.tasks,
            draggedTask,
            droppedTask,
            action.payload.direction
          );
          // ドラッグされたタスクの親のtimesecを再帰的に更新
          updateParentTimesec(draft.tasks, draggedTaskParentTask!);
          recursiveInvokeFnParentTask(
            draft.tasks,
            draggedTaskParentTask!,
            parent => {
              updateParentTimesec(draft.tasks, parent);
            }
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

        // 対象Sectionのタスクを削除
        draft.tasks = draft.tasks.filter(
          v => v.sectionId !== action.payload.sectionId
        );
      });
    case 'MOVE_SECTION':
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

        const distIndex =
          action.payload.direction === 'next'
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
        const movedTask = draft.tasks.find(
          v => v.uuid === action.payload.taskUuid
        );
        if (parent == null || movedTask == null) {
          return;
        }

        // Sectionを合わせる
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

        // 親タスクのuuidを更新
        draft.tasks[movedTaskIndex].parentTaskUuid = parent.uuid;

        recursiveInvokeFnParentTask(
          draft.tasks,
          draft.tasks[movedTaskIndex],
          parent => {
            updateParentTimesec(draft.tasks, parent);
          }
        );
      });
    case 'PAUSE_ALL_TASK':
      return produce(state, draft => {
        draft.tasks.forEach(v => {
          v.isPlaying = false;
        });
      });
    case 'ADD_SUB_TASK':
      return produce(state, draft => {
        const taskIndex = draft.tasks.findIndex(
          v => v.uuid === action.payload.uuid
        );
        const task = draft.tasks[taskIndex];
        if (task == null) {
          return;
        }
        const subTask = {
          ...generateTask(),
          parentTaskUuid: task.uuid,
          sectionId: task.sectionId
        };
        draft.tasks.splice(taskIndex, 0, subTask);
        task.subTaskUuids =
          task.subTaskUuids != null
            ? [...task.subTaskUuids, subTask.uuid]
            : [subTask.uuid];
        draft.focusUuid = subTask.uuid;
      });
    case 'IMPORT_SECTIONS':
      return produce(state, draft => {
        draft.tasks = [...draft.tasks, ...action.payload.tasks];
        draft.sections = [...draft.sections, ...action.payload.sections];
      });
    case 'SET_SECTION_UNDO_STATE':
      return produce(state, draft => {
        draft.undoState = {};
        const sectionIndex = draft.sections.findIndex(
          v => v.id === action.payload.sectionId
        );
        if (sectionIndex === -1) {
          return;
        }
        const section = draft.sections[sectionIndex];
        const tasks = draft.tasks.filter(
          v => v.sectionId === action.payload.sectionId
        );
        draft.undoState.section = {
          section,
          tasks,
          insertIndex: sectionIndex
        };
      });
    case 'SET_TASK_UNDO_STATE':
      return produce(state, draft => {
        draft.undoState = {};
        const taskIndex = draft.tasks.findIndex(
          v => v.uuid === action.payload.uuid
        );
        const task = draft.tasks[taskIndex];
        if (task == null) {
          return;
        }
        const subTasks: Task[] = [];
        recursiveInvokeFnChildTask(draft.tasks, task, child => {
          subTasks.push(child);
        });
        let insertIndexForSubTask: number | undefined;
        if (task.parentTaskUuid != null) {
          const [, childIndex] = getParentTaskAndChildIndex(
            draft.tasks,
            task.parentTaskUuid,
            task.uuid
          );
          insertIndexForSubTask = childIndex;
        }
        draft.undoState.task = {
          task,
          subTasks,
          insertIndex: taskIndex,
          insertIndexForSubTask
        };
      });
    case 'SET_COMMENT_UNDO_STATE':
      return produce(state, draft => {
        draft.undoState = {};
        draft.undoState.comment = {
          taskUuid: action.payload.taskUuid,
          comments: action.payload.comments
        };
      });
    case 'UNDO':
      return produce(state, draft => {
        const undoState = draft.undoState;
        if (undoState.section != null) {
          draft.tasks = [...draft.tasks, ...undoState.section.tasks];
          draft.sections.splice(
            undoState.section.insertIndex,
            0,
            undoState.section.section
          );
        }
        if (undoState.task != null) {
          draft.tasks.splice(
            undoState.task.insertIndex,
            0,
            undoState.task.task
          );
          draft.tasks = [...draft.tasks, ...undoState.task.subTasks];
          if (undoState.task.insertIndexForSubTask != null) {
            const parent = draft.tasks.find(
              v => v.uuid === undoState.task!.task.parentTaskUuid
            );
            parent?.subTaskUuids?.splice(
              undoState.task.insertIndexForSubTask,
              0,
              undoState.task.task.uuid
            );
          }
        }
        if (undoState.comment != null) {
          const task = draft.tasks.find(
            v => v.uuid === undoState.comment!.taskUuid
          );
          if (task == null) {
            return;
          }
          task.comments = undoState.comment.comments;
        }
        draft.undoState = {};
      });
    case 'UNDO_CLEAR':
      return produce(state, draft => {
        draft.undoState = {};
      });
    default:
      return state;
  }
};

import { Task } from 'model/task';
import { Section } from 'model/section';

export type SectionUndoState = {
  section: Section;
  tasks: Task[];
  insertIndex: number;
};

export type TaskUndoState = {
  task: Task;
  subTasks: Task[];
  insertIndex: number;
  insertIndexForSubTask?: number;
};

export type CommentUndoState = {
  comments: string[];
  taskUuid: string;
};

export type UndoState = SectionUndoState | TaskUndoState | CommentUndoState;

export type State = {
  tasks: Task[];
  focusUuid?: string;
  sections: Section[];
  undoState: {
    section?: SectionUndoState;
    task?: TaskUndoState;
    comment?: CommentUndoState;
  };
};

export const initState: State = {
  tasks: [],
  sections: [],
  undoState: {}
};

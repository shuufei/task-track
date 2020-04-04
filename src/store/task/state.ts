import { Task } from 'model/task';

export type State = {
  tasks: Task[];
  focusUuid?: string;
  hoverTaskUuid?: string;
};

export const initState: State = {
  tasks: []
};

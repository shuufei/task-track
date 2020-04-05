import { Task } from 'model/task';

export type State = {
  tasks: Task[];
  focusUuid?: string;
};

export const initState: State = {
  tasks: []
};

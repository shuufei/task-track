import { Task } from 'model/task';

export type State = {
  tasks: Task[];
};

export const initState: State = {
  tasks: []
};

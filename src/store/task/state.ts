import { Task } from 'model/task';
import { Section } from 'model/section';

export type State = {
  tasks: Task[];
  focusUuid?: string;
  sections: Section[];
};

export const initState: State = {
  tasks: [],
  sections: []
};

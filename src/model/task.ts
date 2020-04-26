import { v4 as uuidv4 } from 'uuid';

export type Task = {
  uuid: string;
  title: string;
  isDone: boolean;
  timesec: number;
  sumSubTasksTimesec?: number;
  isPlaying: boolean;
  comments: string[];
  timesecUpdatedTimestamp?: number;
  updatedAt: Date;
  sectionId?: string;
  subTaskUuids?: string[];
  parentTaskUuid?: string;
};

export const generateTask = (): Task => ({
  uuid: uuidv4(),
  title: '',
  isDone: false,
  timesec: 0,
  isPlaying: false,
  comments: [],
  updatedAt: new Date(),
  subTaskUuids: []
});

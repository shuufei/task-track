import { v4 as uuidv4 } from 'uuid';

export type Task = {
  uuid: string;
  title: string;
  isDone: boolean;
  timesec: number;
  isPlaying: boolean;
  startUnixtime: number;
  comments: string[];
};

export const generateTask = () => ({
  uuid: uuidv4(),
  title: '',
  isDone: false,
  timesec: 0,
  isPlaying: false,
  startUnixtime: 0,
  comments: []
});

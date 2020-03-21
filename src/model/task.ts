import uuidv4 from 'uuid/v4';

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

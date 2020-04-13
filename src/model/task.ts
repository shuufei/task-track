import { v4 as uuidv4 } from 'uuid';

export type Task = {
  uuid: string;
  title: string;
  isDone: boolean;
  timesec: number;
  isPlaying: boolean;
  comments: string[];
  timesecUpdatedTimestamp?: number;
  updatedAt: Date;
  sectionId?: string;
  subTasks?: Task[];
};

export const generateTask = (): Task => ({
  uuid: uuidv4(),
  title: '',
  isDone: false,
  timesec: 0,
  isPlaying: false,
  comments: [],
  updatedAt: new Date()
});

export const findTask = (
  uuid: string,
  tasks: Task[],
  parentTaskUuids: string[]
): Task | undefined => {
  // if (parentTaskUuids.length === 0) {
  //   return tasks.find(v => v.uuid === uuid);
  // }
  // let nextFindTasks = tasks;
  // let parentTask: Task | undefined;
  // parentTaskUuids.forEach(parentUuid => {
  //   parentTask = nextFindTasks.find(v => v.uuid === parentUuid);
  //   if (parentTask == null) {
  //     return;
  //   }
  //   nextFindTasks = parentTask.subTasks || [];
  // });

  // if (parentTask == null || parentTask.subTasks == null) {
  //   return;
  // }
  // return parentTask.subTasks.find(v => v.uuid === uuid);
  const address = getTaskAddress(uuid, tasks, parentTaskUuids);
  let nextFindTasks = tasks;
  let task: Task | undefined;
  address.forEach(i => {
    task = nextFindTasks[i];
    nextFindTasks = task.subTasks || [];
  });
  console.log('--- task: ', task, address, parentTaskUuids);

  return task;
};

export const getTaskAddress = (
  uuid: string,
  tasks: Task[],
  parentTaskUuids: string[]
): number[] => {
  const address: number[] = [];
  if (parentTaskUuids.length === 0) {
    const index = tasks.findIndex(v => v.uuid === uuid);
    return index !== -1 ? [...address, index] : address;
  }
  let nextFindTasks = tasks;
  let parentTask: Task | undefined;
  parentTaskUuids.forEach(parentUuid => {
    const index = nextFindTasks.findIndex(v => v.uuid === parentUuid);
    console.log('--- parentTask: ', parentUuid, nextFindTasks, index);
    if (index === -1) {
      return;
    }
    parentTask = nextFindTasks[index];

    nextFindTasks = parentTask.subTasks || [];
    address.push(index);
  });

  if (parentTask == null || parentTask.subTasks == null) {
    return address;
  }
  const index = parentTask.subTasks.findIndex(v => v.uuid === uuid);
  return index !== -1 ? [...address, index] : address;
};

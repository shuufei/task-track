import { Section } from 'model/section';
import { Task } from 'model/task';

export const getArraySplitChar = (arr: string[]) => {
  if (arr.length === 0) {
    return '';
  }
  const SPLIT_CHARS = [
    ',',
    ':',
    ';',
    '.',
    '-',
    '=',
    '~',
    '¥',
    '*',
    '|',
    '<',
    '>',
    '/',
    '$',
    '%',
    '&',
    '+',
    '^'
  ];
  const splictChar = SPLIT_CHARS.find(char => {
    for (const value of arr) {
      if (value.includes(char)) {
        return false;
      }
    }
    return true;
  });
  // 分割に使える文字が見つからなかった場合は改行を分割文字とする。
  // 改行ぶ分割文字とした場合、コメント等で改行を使っていると分割されてしまう。
  return splictChar || '\n';
};

export type CSVHeaderKeys = (
  | keyof Task
  | 'section'
  | 'commentsSplitChar'
  | 'subTaskUUidsSplitChar'
)[];

export const convertSectionToCsvFromJson = (
  section: Section,
  tasks: Task[]
) => {
  const SPLIT_CHAR = ',';
  const headerKeys = [
    'uuid',
    'title',
    'isDone',
    'timesec',
    'isPlaying',
    'comments',
    'commentsSplitChar',
    'timesecUpdatedTimestamp',
    'updatedAt',
    'sectionId',
    'section',
    'subTaskUuids',
    'subTaskUUidsSplitChar',
    'parentTaskUuid'
  ] as CSVHeaderKeys;
  let commentsSplitChar = '';
  let subTaskUuidsSplitChar = '';
  const headerRow = headerKeys.join(SPLIT_CHAR) + '\n';
  const body = tasks
    .map(task =>
      headerKeys
        .map(key => {
          if (key === 'section') {
            return section.title;
          }
          if (key === 'commentsSplitChar') {
            return JSON.stringify(
              commentsSplitChar || getArraySplitChar(task.comments)
            );
          }
          if (key === 'subTaskUUidsSplitChar') {
            return JSON.stringify(
              subTaskUuidsSplitChar ||
                getArraySplitChar(task.subTaskUuids || [])
            );
          }
          if (key === 'comments') {
            commentsSplitChar = getArraySplitChar(task.comments);
            return JSON.stringify(task.comments.join(commentsSplitChar));
          }
          if (key === 'subTaskUuids') {
            subTaskUuidsSplitChar = getArraySplitChar(task.subTaskUuids || []);
            return JSON.stringify(
              (task.subTaskUuids || []).join(subTaskUuidsSplitChar)
            );
          }
          if (typeof task[key] === 'object' || typeof task[key] === 'string') {
            return JSON.stringify(task[key]);
          }
          return task[key] != null ? task[key]!.toString() : '';
        })
        .join(SPLIT_CHAR)
    )
    .join('\n');
  return headerRow + body;
};

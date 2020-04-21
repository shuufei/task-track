import { v4 as uuidv4 } from 'uuid';

import { Section } from 'model/section';
import { Task } from 'model/task';

export type CSVHeaderKeys = (
  | keyof Task
  | 'section'
  | 'commentsSplitChar'
  | 'subTaskUUidsSplitChar'
  | 'altCommaChar'
  | 'altNewLineCode'
)[];

const COMMA = ',';
const NEW_LINE_CODE = '\n';
const HEADER_KEYS = [
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
  'parentTaskUuid',
  'altCommaChar',
  'altNewLineCode'
] as CSVHeaderKeys;
const altCommaIndex = HEADER_KEYS.findIndex(v => v === 'altCommaChar');
const altNewLineCodeIndex = HEADER_KEYS.findIndex(v => v === 'altNewLineCode');

export const getNotIncludedChar = (rowValues: string[]) => {
  const SPLIT_CHARS = [':', ';', '<', '>', '/', '%', '&', '+', '¥', '-', '='];
  const c = SPLIT_CHARS.find(char => {
    for (const value of rowValues) {
      if (value.includes(char)) {
        return false;
      }
    }
    return true;
  });
  return c || uuidv4();
};

export const getArraySplitChar = (arr: string[]) => {
  if (arr.length === 0) {
    return '';
  }
  return getNotIncludedChar(arr);
};

export const convertSectionToCsvFromJson = (
  section: Section,
  tasks: Task[]
) => {
  let commentsSplitChar = '';
  let subTaskUuidsSplitChar = '';
  const headerRow = HEADER_KEYS.join(COMMA) + '\n';
  const body = tasks
    .map(task => {
      const rowValues: string[] = HEADER_KEYS.map(key => {
        if (key === 'altCommaChar' || key === 'altNewLineCode') {
          return '';
        }
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
            subTaskUuidsSplitChar || getArraySplitChar(task.subTaskUuids || [])
          );
        }
        if (key === 'comments') {
          commentsSplitChar = getArraySplitChar(task.comments);
          return task.comments.join(commentsSplitChar);
        }
        if (key === 'subTaskUuids') {
          subTaskUuidsSplitChar = getArraySplitChar(task.subTaskUuids || []);
          return (task.subTaskUuids || []).join(subTaskUuidsSplitChar);
        }
        if (typeof task[key] === 'string') {
          return task[key] as string;
        }
        return task[key] != null ? task[key]!.toString() : '';
      });
      const altCommaChar = getNotIncludedChar(rowValues);
      rowValues.splice(altCommaIndex, 1, altCommaChar);
      const altNewLineCode = getNotIncludedChar(rowValues);
      rowValues.splice(altNewLineCodeIndex, 1, altNewLineCode);
      return rowValues
        .map(v => {
          if (v == null) {
            return v;
          }
          return v
            .replace(new RegExp(COMMA, 'g'), altCommaChar)
            .replace(new RegExp(NEW_LINE_CODE, 'g'), altNewLineCode);
        })
        .join(COMMA);
    })
    .join('\n');
  return headerRow + body;
};

export const convertSectionToJsonFromCsv = (csv: string[]) => {
  if (csv.length <= 1) {
    // TODO: 取り込むデータがないメッセージを表示
    return;
  }
  try {
    const headerKeys = csv.shift()!.split(',');
    const tasks = csv.map(row => {
      console.log('--- split row: ', row.split(',').length);
      const rowValues = row.split(COMMA);
      const altCommaChar = rowValues[altCommaIndex];
      const altNewLineCode = rowValues[altNewLineCodeIndex];
      const replacedRowValues = rowValues.map(v =>
        v
          .replace(new RegExp(altCommaChar, 'g'), COMMA)
          .replace(new RegExp(altNewLineCode, 'g'), NEW_LINE_CODE)
      );
      return replacedRowValues;
      // headerKeys.forEach(key => {});
    });
    console.log('---tasks: ', tasks);
  } catch (error) {
    // TODO: フォーマットエラーのメッセージを表示
    console.error('--- format error');
  }
};

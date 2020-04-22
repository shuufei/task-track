import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

import { Section } from 'model/section';
import { Task } from 'model/task';

export type CSVHeaderKey =
  | keyof Task
  | 'section'
  | 'commentsSplitChar'
  | 'subTaskUuidsSplitChar'
  | 'altCommaChar'
  | 'altNewLineCode';

export type CSVHeaderKeys = CSVHeaderKey[];

const COMMA = ',';
const NEW_LINE_CODE = '\n';
const HEADER_KEYS: CSVHeaderKeys = [
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
  'subTaskUuidsSplitChar',
  'parentTaskUuid',
  'altCommaChar',
  'altNewLineCode'
];
const altCommaIndex = HEADER_KEYS.findIndex(v => v === 'altCommaChar');
const altNewLineCodeIndex = HEADER_KEYS.findIndex(v => v === 'altNewLineCode');

export const getNotIncludedChar = (rowValues: string[]) => {
  // 正規表現の特殊文字が含まれてると面倒い
  const SPLIT_CHARS = [':', ';', '<', '>', '/', '%', '&', '¥'];
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
          return commentsSplitChar || getArraySplitChar(task.comments);
        }
        if (key === 'subTaskUuidsSplitChar') {
          return (
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

const getColumnValue = (key: CSVHeaderKey, rowValues: string[]) => {
  const index = HEADER_KEYS.findIndex(v => v === key);
  return rowValues[index];
};

export const convertSectionToJsonFromCsv = (
  csv: string[]
): [Section[], Task[]] => {
  if (csv.length <= 1) {
    throw new NoRecordError();
  }
  try {
    const uuidv5name = new Date().toISOString();
    csv.shift(); // header情報を削除
    const tasks: Task[] = csv.map(row => {
      const rowValues = row.split(COMMA);
      const altCommaChar = rowValues[altCommaIndex];
      const altNewLineCode = rowValues[altNewLineCodeIndex];
      const replacedRowValues = rowValues.map(v =>
        v
          .replace(new RegExp(altCommaChar, 'g'), COMMA)
          .replace(new RegExp(altNewLineCode, 'g'), NEW_LINE_CODE)
      );
      const uuid = getColumnValue('uuid', replacedRowValues);
      const title = getColumnValue('title', replacedRowValues);
      const isDone = getColumnValue('isDone', replacedRowValues);
      const timesec = getColumnValue('timesec', replacedRowValues);
      const comments = getColumnValue('comments', replacedRowValues);
      const commentsSplitChar = getColumnValue(
        'commentsSplitChar',
        replacedRowValues
      );
      const timesecUpdatedTimestamp = getColumnValue(
        'timesecUpdatedTimestamp',
        replacedRowValues
      );
      const updatedAt = getColumnValue('updatedAt', replacedRowValues);
      const sectionId = getColumnValue('sectionId', replacedRowValues);
      const subTaskUuids = getColumnValue('subTaskUuids', replacedRowValues);
      const subTaskUuidsSplitChar = getColumnValue(
        'subTaskUuidsSplitChar',
        replacedRowValues
      );
      const parentTaskUuid = getColumnValue(
        'parentTaskUuid',
        replacedRowValues
      );
      return {
        uuid: uuidv5(uuidv5name, uuid),
        title,
        isDone: isDone === 'true',
        timesec: !isNaN(Number(timesec)) ? Number(timesec) : 0,
        isPlaying: false,
        comments: comments.split(commentsSplitChar),
        timesecUpdatedTimestamp: !isNaN(Number(timesecUpdatedTimestamp))
          ? Number(timesecUpdatedTimestamp)
          : undefined,
        updatedAt: new Date(updatedAt),
        sectionId: uuidv5(uuidv5name, sectionId),
        subTaskUuids: (subTaskUuids !== ''
          ? subTaskUuids.split(subTaskUuidsSplitChar)
          : []
        ).map(v => uuidv5(uuidv5name, v)),
        parentTaskUuid: parentTaskUuid
          ? uuidv5(uuidv5name, parentTaskUuid)
          : undefined
      };
    });
    const sections: Section[] = csv
      .map(row => {
        const rowValues = row.split(COMMA);
        const altCommaChar = rowValues[altCommaIndex];
        const altNewLineCode = rowValues[altNewLineCodeIndex];
        const replacedRowValues = rowValues.map(v =>
          v
            .replace(new RegExp(altCommaChar, 'g'), COMMA)
            .replace(new RegExp(altNewLineCode, 'g'), NEW_LINE_CODE)
        );
        const section = getColumnValue('section', replacedRowValues);
        const sectionId = getColumnValue('sectionId', replacedRowValues);
        return {
          id: uuidv5(uuidv5name, sectionId),
          title: section
        };
      })
      .filter(
        (section, i, self) => self.findIndex(v => v.id === section.id) === i
      );
    return [sections, tasks];
  } catch (error) {
    throw new FormatError();
  }
};

export class FormatError extends Error {}
export class NoRecordError extends Error {}

import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import { useSelector } from 'react-redux';

import { colors } from 'styles/color';
import { shadow } from 'styles/shadow';
import * as typography from 'styles/typography';
import { RootState } from 'store';
import { TaskReportContainer } from './TaskReportContainer';

export type Props = {
  sectionId: string;
  customCss?: SerializedStyles;
};

export const SectionReportContainer: React.FC<Props> = props => {
  const [isSortByTime, setIsSortByTime] = useState(false);
  const taskUuids = useSelector((state: RootState) => {
    const tasks = state.task.tasks
      .filter(v => v.sectionId === props.sectionId)
      .filter(v => v.timesec > 0 && v.parentTaskUuid == null);
    if (isSortByTime) {
      tasks.sort((v1, v2) => v2.timesec - v1.timesec);
    }
    return tasks.map(v => v.uuid);
  });
  const maxTimesec = useSelector((state: RootState) => {
    const timesecList = state.task.tasks
      .map(v => v.timesec)
      .sort((v1, v2) => v2 - v1);
    return timesecList[0];
  });
  const sectionTitle = useSelector((state: RootState) => {
    const section = state.task.sections.find(v => v.id === props.sectionId);
    if (section == null) {
      return;
    }
    return section.title;
  });
  return (
    <div
      css={css`
        padding: 12px 24px 24px;
        background-color: ${colors.white};
        border-radius: 5px;
        ${shadow};
        ${props.customCss};
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <p
          css={css`
            margin: 0;
            ${typography.base};
            font-weight: ${typography.weight.bold};
            color: ${colors.black400};
          `}
        >
          {sectionTitle}
        </p>
        <label
          css={css`
            ${typography.caption};
            color: ${colors.black400};
            cursor: pointer;
          `}
        >
          <input
            type="checkbox"
            onChange={event => setIsSortByTime(event.target.checked)}
          />
          Sort by time
        </label>
      </div>
      <div
        css={css`
          display: flex;
          align-items: stretch;
          margin-top: 8px;
        `}
      >
        {taskUuids.length === 0 ? (
          <p
            css={css`
              ${typography.base};
              color: ${colors.black400};
              margin: 0;
            `}
          >
            No tracking record.
          </p>
        ) : (
          <React.Fragment>
            <div
              css={css`
                width: 1px;
                background-color: ${colors.black350};
              `}
            />
            <div
              css={css`
                flex: 1;
                padding: 0 0 16px;
              `}
            >
              {taskUuids.map((uuid, i) => (
                <TaskReportContainer
                  uuid={uuid}
                  key={uuid + i + isSortByTime}
                  maxTimesec={maxTimesec}
                  isSortByTime={isSortByTime}
                  customCss={
                    i > 0
                      ? css`
                          margin-top: 16px;
                        `
                      : undefined
                  }
                />
              ))}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

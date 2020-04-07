import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useSelector } from 'react-redux';

import { colors } from 'styles/color';
import { TaskReportContainer } from 'components/container/TaskReportContainer';
import { RootState } from 'store';

export const ReportPage: React.FC = () => {
  const taskUuids = useSelector((state: RootState) =>
    state.task.tasks
      .filter(v => v.timesec > 0)
      // .sort((v1, v2) => v2.timesec - v1.timesec)
      .map(v => v.uuid)
  );
  const maxTimesec = useSelector((state: RootState) => {
    const timesecList = state.task.tasks
      .map(v => v.timesec)
      .sort((v1, v2) => v2 - v1);
    return timesecList[0];
  });

  return (
    <div
      css={css`
        display: flex;
        align-items: stretch;
        padding: 12px 16px;
      `}
    >
      <div
        css={css`
          width: 1px;
          background-color: ${colors.black300};
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
            key={uuid}
            maxTimesec={maxTimesec}
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
    </div>
  );
};

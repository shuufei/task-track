import React, { useState } from 'react';
import { useSelector } from 'react-redux';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { TaskReport } from 'components/presentation/TaskReport';
import { RootState } from 'store';
import { colors } from 'styles/color';
import * as typography from 'styles/typography';
import { Icon } from 'components/presentation/Icon';

export type Props = {
  uuid: string;
  maxTimesec: number;
  isSubTask?: boolean;
  isSortByTime?: boolean;
  customCss?: SerializedStyles;
};

export const TaskReportContainer: React.FC<Props> = props => {
  const task = useSelector((state: RootState) =>
    state.task.tasks.find(v => v.uuid === props.uuid)
  );
  const subTasks = useSelector((state: RootState) => {
    const tasks = state.task.tasks.filter(v =>
      task?.subTaskUuids?.includes(v.uuid)
    );
    if (props.isSortByTime) {
      tasks.sort((v1, v2) => v2.timesec - v1.timesec);
    }
    return tasks;
  });
  const [isShowSubtasks, setIsShowSubtasks] = useState(true);
  return (
    <div css={props.customCss}>
      <TaskReport
        title={task?.title || ''}
        comments={task?.comments || []}
        timesec={task?.timesec || 0}
        maxTimesec={props.maxTimesec}
        isSubTask={props.isSubTask}
        customCss={props.customCss}
      />
      {subTasks.length > 0 && (
        <React.Fragment>
          <p
            css={css`
              ${typography.caption};
              color: ${!props.isSubTask ? colors.primary400 : colors.black350};
              cursor: pointer;
              text-decoration: underline;
              margin: 8px 0 0 8px;
            `}
            onClick={() => setIsShowSubtasks(!isShowSubtasks)}
          >
            {isShowSubtasks ? 'Hidden Sub-Tasks' : 'Show Sub-Tasks'}
            <Icon
              iconname={!props.isSubTask ? 'arrowDownPrimary400' : 'arrowDown'}
              customCss={css`
                width: 9px;
                margin-left: 6px;
                transform: ${isShowSubtasks ? 'rotate(180deg)' : 'none'};
              `}
            />
          </p>
          {isShowSubtasks && (
            <div
              css={css`
                display: flex;
                align-items: stretch;
                padding-left: 16px;
                margin-top: 8px;
              `}
            >
              <div
                css={css`
                  width: 1px;
                  background-color: ${colors.black200};
                `}
              ></div>
              <div
                css={css`
                  padding: 0 0 16px;
                  width: 100%;
                `}
              >
                {subTasks.map((v, i) => (
                  <TaskReportContainer
                    uuid={v.uuid}
                    maxTimesec={props.maxTimesec}
                    isSubTask={true}
                    isSortByTime={props.isSortByTime}
                    key={v.uuid}
                    customCss={css`
                      margin-top: ${i > 0 ? `8px` : 0};
                    `}
                  />
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

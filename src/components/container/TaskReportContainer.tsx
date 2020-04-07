import React from 'react';
import { useSelector } from 'react-redux';
import { SerializedStyles } from '@emotion/core';

import { TaskReport } from 'components/presentation/TaskReport';
import { RootState } from 'store';

export type Props = {
  uuid: string;
  maxTimesec: number;
  customCss?: SerializedStyles;
};

export const TaskReportContainer: React.FC<Props> = props => {
  const task = useSelector((state: RootState) =>
    state.task.tasks.find(v => v.uuid === props.uuid)
  );
  return (
    <TaskReport
      title={task?.title || ''}
      comments={task?.comments || []}
      timesec={task?.timesec || 0}
      maxTimesec={props.maxTimesec}
      customCss={props.customCss}
    />
  );
};

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { RootState, actionCreator } from 'store';
import { SectionContainer } from 'components/container/SectionContainer';
import { TaskListContainer } from 'components/container/TaskListContainer';

export const SectionIdContext = React.createContext<string | undefined>(
  undefined
);

export const TasksPage: React.FC = () => {
  const taskUuids = useSelector((state: RootState) =>
    state.task.tasks.filter(v => v.sectionId == null).map(v => v.uuid)
  );
  const sectionIds = useSelector((state: RootState) =>
    state.task.sections.map(v => v.id)
  );
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (initialized) {
      return;
    }
    dispatch(actionCreator.task.updateFocusTaskUuid({ uuid: undefined }));
    setInitialized(true);
  }, [dispatch, initialized, setInitialized]);

  return (
    <div
      css={css`
        padding: 12px 24px;
      `}
    >
      <SectionIdContext.Provider value={undefined}>
        <TaskListContainer uuids={taskUuids} />
      </SectionIdContext.Provider>
      {sectionIds.map(v => (
        <SectionIdContext.Provider value={v} key={v}>
          <SectionContainer
            sectionId={v}
            customCss={css`
              margin-top: 24px;
            `}
          />
        </SectionIdContext.Provider>
      ))}
    </div>
  );
};

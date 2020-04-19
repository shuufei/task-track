import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { RootState, actionCreator } from 'store';
import { SectionContainer } from 'components/container/SectionContainer';
import * as typography from 'styles/typography';
import { colors } from 'styles/color';
import { useInit } from 'hooks/init';

export const SectionIdContext = React.createContext<string | undefined>(
  undefined
);

export const TasksPage: React.FC = () => {
  const sectionIds = useSelector((state: RootState) =>
    state.task.sections.map(v => v.id)
  );
  const dispatch = useDispatch();

  useInit(() => {
    dispatch(actionCreator.task.updateFocusTaskUuid({ uuid: undefined }));
    if (sectionIds.length === 0) {
      dispatch(actionCreator.task.addSection());
    }
  });

  return (
    <div
      css={css`
        padding: 12px 24px 24px;
      `}
    >
      <DndProvider backend={Backend}>
        {sectionIds.map((v, i) => (
          <SectionIdContext.Provider value={v} key={v}>
            <SectionContainer
              sectionId={v}
              customCss={css`
                margin-top: ${i === 0 ? '12px' : '24px'};
              `}
            />
          </SectionIdContext.Provider>
        ))}
      </DndProvider>
      <button
        css={css`
          margin-top: 32px;
          padding: 6px 12px;
          outline: none;
          border: none;
          border-radius: 3px;
          background-color: ${colors.black400};
          cursor: pointer;
          ${typography.caption};
          color: ${colors.white};
          font-weight: ${typography.weight.bold};
          :hover {
            filter: brightness(0.8);
          }
        `}
        onClick={() => dispatch(actionCreator.task.addSection())}
      >
        Add Section
      </button>
    </div>
  );
};

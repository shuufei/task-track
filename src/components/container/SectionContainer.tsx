import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { Textarea } from 'components/presentation/Textarea';
import * as typography from 'styles/typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, actionCreator } from 'store';
import { TaskListContainer } from './TaskListContainer';
import { Menu } from 'components/presentation/Menu';

export type Props = {
  sectionId: string;
  customCss?: SerializedStyles;
};

export const SectionContainer: React.FC<Props> = props => {
  const [isHoverSectionTitle, setIsHoverSectionTitle] = useState(false);
  const sectionTaskUuids = useSelector((state: RootState) =>
    state.task.tasks
      .filter(v => v.sectionId === props.sectionId)
      .map(v => v.uuid)
  );
  const section = useSelector((state: RootState) =>
    state.task.sections.find(v => v.id === props.sectionId)
  );
  const dispatcher = useDispatch();
  return (
    <div
      css={css`
        ${props.customCss}
      `}
      onMouseEnter={() => setIsHoverSectionTitle(true)}
      onMouseLeave={() => setIsHoverSectionTitle(false)}
    >
      <div
        css={css`
          position: relative;
          z-index: 10;
          line-height: 1;
          display: flex;
          align-items: center;
          transform: translateX(-20px);
        `}
      >
        <div
          css={css`
            display: inline-block;
            line-height: 0;
            padding: 4px;
            visibility: ${isHoverSectionTitle ? 'visible' : 'hidden'};
          `}
        >
          <Menu
            delete={() =>
              dispatcher(
                actionCreator.task.deleteSection({ sectionId: props.sectionId })
              )
            }
          />
        </div>
        <Textarea
          value={section?.title || ''}
          changeValue={value =>
            dispatcher(
              actionCreator.task.updateSectionTitle({
                id: props.sectionId,
                title: value
              })
            )
          }
          placeholder={'Enter Section Title'}
          customCss={css`
            ${typography.title};
            background-color: rgba(0, 0, 0, 0);
            margin-left: 4px;
            :focus {
              outline: none;
              background-color: rgba(0, 0, 0, 0);
            }
          `}
        />
      </div>
      <TaskListContainer
        uuids={sectionTaskUuids}
        customCss={css`
          margin-top: 4px;
          z-index: 1;
        `}
      />
    </div>
  );
};

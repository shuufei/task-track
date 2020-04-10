import React from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { Textarea } from 'components/presentation/Textarea';
import * as typography from 'styles/typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, actionCreator } from 'store';
import { TaskListContainer } from './TaskListContainer';

export type Props = {
  sectionId: string;
  customCss?: SerializedStyles;
};

export const SectionContainer: React.FC<Props> = props => {
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
    <div css={props.customCss}>
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
        placeholder={'Input Section Title'}
        customCss={css`
          ${typography.title};
          background-color: rgba(0, 0, 0, 0);
          :focus {
            outline: none;
            background-color: rgba(0, 0, 0, 0);
          }
        `}
      />
      <TaskListContainer uuids={sectionTaskUuids} />
    </div>
  );
};

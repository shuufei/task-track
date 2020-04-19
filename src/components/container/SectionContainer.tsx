import React, { useState, useRef, forwardRef } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { Textarea } from 'components/presentation/Textarea';
import * as typography from 'styles/typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, actionCreator } from 'store';
import { TaskListContainer } from './TaskListContainer';
import { Menu } from 'components/presentation/Menu';
import { useDrag, useDrop, DragObjectWithType } from 'react-dnd';
import { colors } from 'styles/color';

type SectionDropAreaProps = {
  isOver: boolean;
};
const SectionDropArea = forwardRef<HTMLDivElement, SectionDropAreaProps>(
  (props, dropRef) => {
    return (
      <div
        ref={dropRef}
        css={css`
          width: 100%;
          height: 24px;
          background-color: ${colors.transparent};
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={css`
            width: 100%;
            height: 3px;
            background-color: ${props.isOver
              ? colors.primary400
              : colors.transparent};
          `}
        ></div>
      </div>
    );
  }
);

export type Props = {
  sectionId: string;
  isFirst?: boolean;
  customCss?: SerializedStyles;
};

export const DRAG_TYPE_SECTION = 'SECTION';

type DragObjectType = DragObjectWithType & { id: string };

export const SectionContainer: React.FC<Props> = props => {
  const [isHoverSectionTitle, setIsHoverSectionTitle] = useState(false);
  const sectionTaskUuids = useSelector((state: RootState) =>
    state.task.tasks
      .filter(v => v.parentTaskUuid == null)
      .filter(v => v.sectionId === props.sectionId)
      .map(v => v.uuid)
  );
  const section = useSelector((state: RootState) =>
    state.task.sections.find(v => v.id === props.sectionId)
  );
  const dispatch = useDispatch();

  const handleRef = useRef<HTMLDivElement>(null);
  const dropNextSectionRef = useRef<HTMLDivElement>(null);
  const dropPrevSectionRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, connectDrag, previewRef] = useDrag({
    item: { id: props.sectionId, type: DRAG_TYPE_SECTION },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const [{ isOverNextSection }, connectDropNextSection] = useDrop({
    accept: DRAG_TYPE_SECTION,
    drop: (v: DragObjectType) => {
      if (v.id === props.sectionId) {
        return;
      }
      dispatch(
        actionCreator.task.moveSection({
          draggedSectionId: v.id,
          droppedSectionId: props.sectionId,
          direction: 'next'
        })
      );
    },
    collect: monitor => ({
      isOverNextSection: !!monitor.isOver()
    })
  });
  const [{ isOverPrevSection }, connectDropPrevSection] = useDrop({
    accept: DRAG_TYPE_SECTION,
    drop: (v: DragObjectType) => {
      if (v.id === props.sectionId) {
        return;
      }
      dispatch(
        actionCreator.task.moveSection({
          draggedSectionId: v.id,
          droppedSectionId: props.sectionId,
          direction: 'prev'
        })
      );
    },
    collect: monitor => ({
      isOverPrevSection: !!monitor.isOver()
    })
  });
  connectDrag(handleRef);
  connectDropNextSection(dropNextSectionRef);
  connectDropPrevSection(dropPrevSectionRef);

  return (
    <div
      ref={previewRef}
      css={css`
        opacity: ${isDragging ? 0.4 : 1};
        ${props.customCss};
      `}
      onMouseEnter={() => setIsHoverSectionTitle(true)}
      onMouseLeave={() => setIsHoverSectionTitle(false)}
    >
      {props.isFirst && (
        <SectionDropArea isOver={isOverPrevSection} ref={dropPrevSectionRef} />
      )}
      <div
        css={css`
          position: relative;
          z-index: 1;
          line-height: 1;
          display: flex;
          align-items: center;
          transform: translateX(-20px);
        `}
      >
        <div
          ref={handleRef}
          css={css`
            display: inline-block;
            line-height: 0;
            padding: 4px;
            visibility: ${isHoverSectionTitle ? 'visible' : 'hidden'};
          `}
        >
          <Menu
            delete={() =>
              dispatch(
                actionCreator.task.deleteSection({
                  sectionId: props.sectionId
                })
              )
            }
          />
        </div>
        <Textarea
          value={section?.title || ''}
          changeValue={value =>
            dispatch(
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
          margin-top: 8px;
          z-index: 0;
        `}
      />
      <SectionDropArea isOver={isOverNextSection} ref={dropNextSectionRef} />
    </div>
  );
};

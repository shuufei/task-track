import React, { useState, useEffect, useRef } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { colors } from 'styles/color';
import { shadow } from 'styles/shadow';
import { Checkbox } from './Checkbox';
import { TimeControl } from './TimeControl';
import { Menu } from './Menu';
import { Icon } from './Icon';
import { AdjustHeightToTextarea, Handler } from './Textarea';
import { Comment } from './Comment';
import { TaskTextarea } from './TaskTextare';

export const DRAG_TYPE_TASK = 'TASK';

export type Props = {
  uuid: string;
  title: string;
  timesec: number;
  isDone: boolean;
  isPlaying: boolean;
  comments: string[];
  addComment: () => void;
  delete: () => void;
  addSec: (sec: number, current: number) => void;
  subtractSec: (sec: number, current: number) => void;
  play: () => void;
  pause: () => void;
  editTitle: (title: string) => void;
  editComments: (comments: string[]) => void;
  done: (isDone: boolean) => void;
  addTask: () => void;
  moveToSubtask: () => void;
  customCss?: SerializedStyles;
  focus?: boolean;
};

export const Task = React.forwardRef<HTMLDivElement, Props>(
  (props, handleRef) => {
    const [focusCommentIndex, setFocusCommentIndex] = useState<number | null>(
      null
    );
    const [beforeFocus, setBeforeFocus] = useState(false);
    const innerRef = useRef<Handler>(null);
    useEffect(() => {
      if (props.focus != null && props.focus !== beforeFocus) {
        setBeforeFocus(props.focus);
        if (props.focus && innerRef.current != null) {
          innerRef.current.focus();
        }
      }
    }, [beforeFocus, props.focus]);
    const deleteComment = (index: number) => {
      const comments = [...props.comments];
      comments.splice(index, 1);
      props.editComments([...comments]);
      setFocusCommentIndex(index === 0 ? 0 : index - 1);
    };
    const addComment = (index: number) => {
      const comments = [...props.comments];
      comments.splice(index, 0, '');
      props.editComments([...comments]);
      setFocusCommentIndex(index);
    };
    const editComment = (comment: string, index: number) => {
      const comments = [...props.comments];
      comments[index] = comment;
      props.editComments([...comments]);
      setFocusCommentIndex(index);
    };
    const focusPrevComment = (currentIndex: number) => {
      setFocusCommentIndex(currentIndex === 0 ? 0 : currentIndex - 1);
    };
    const focusNextComment = (currentIndex: number) => {
      setFocusCommentIndex(
        currentIndex === props.comments.length - 1
          ? currentIndex
          : currentIndex + 1
      );
    };

    return (
      <div
        css={css`
          position: relative;
          background-color: ${colors.white};
          padding: 6px 16px 6px 10px;
          border-radius: 3px;
          border: solid 1px
            ${props.isPlaying ? colors.primary500 : 'rgba(0,0,0,0)'};
          ${shadow};
          ${props.customCss};
        `}
      >
        <div
          css={css`
            position: relative;
            display: flex;
            align-items: flex-start;
          `}
        >
          <AdjustHeightToTextarea>
            <div
              ref={handleRef}
              css={css`
                display: inline-block;
              `}
            >
              <Menu
                addComment={() => addComment(props.comments.length)}
                delete={() => props.delete()}
              />
            </div>
          </AdjustHeightToTextarea>
          <AdjustHeightToTextarea>
            <Checkbox
              isChecked={props.isDone}
              onToggle={() => {
                props.done(!props.isDone);
              }}
              customCss={css`
                margin-left: 10px;
              `}
            />
          </AdjustHeightToTextarea>
          <TaskTextarea
            title={props.title}
            ref={innerRef}
            editTitle={props.editTitle}
            onPressEnter={props.addTask}
            onPressTab={props.moveToSubtask}
            onPressDelete={props.delete}
            customCss={css`
              margin-left: 6px;
              text-decoration: ${props.isDone ? 'line-through' : 'unset'};
              color: ${props.isDone ? 'rgba(0,0,0,0.3)' : colors.black500};
            `}
          />
          <AdjustHeightToTextarea
            css={css`
              margin-left: 8px;
            `}
          >
            <TimeControl
              timesec={props.timesec}
              isPlaying={props.isPlaying}
              addSec={(sec, currentSec) => props.addSec(sec, currentSec)}
              subtractSec={(sec, currentSec) =>
                props.subtractSec(sec, currentSec)
              }
            />
          </AdjustHeightToTextarea>
          <AdjustHeightToTextarea
            css={css`
              text-align: center;
            `}
            onClick={() => (props.isPlaying ? props.pause() : props.play())}
          >
            <Icon
              iconname={!props.isPlaying ? 'play' : 'pause'}
              customCss={css`
                cursor: pointer;
                width: 12px;
                margin-left: 12px;
                visibility: ${props.isDone ? 'hidden' : 'visible'};
              `}
            />
          </AdjustHeightToTextarea>
        </div>
        {props.comments.length > 0 ? (
          <React.Fragment>
            <hr
              css={css`
                background-color: ${colors.black100};
                border: none;
                height: 1px;
                margin: 8px 0 0;
              `}
            />
            <div
              css={css`
                padding: 6px 8px 0 24px;
              `}
            >
              {props.comments.map((comment, i) => (
                <div
                  css={css`
                    margin-top: ${i !== 0 ? '2px' : 0};
                  `}
                  key={i}
                >
                  <Comment
                    comment={comment}
                    editComment={comment => editComment(comment, i)}
                    delete={() => deleteComment(i)}
                    generateNextComment={() => addComment(i + 1)}
                    toPrevComment={() => focusPrevComment(i)}
                    toNextComment={() => focusNextComment(i)}
                    focus={i === focusCommentIndex}
                  />
                </div>
              ))}
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }
);

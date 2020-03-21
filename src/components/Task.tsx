import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { colors } from 'styles/color';
import { shadow } from 'styles/shadow';
import { Checkbox } from './Checkbox';
import { TimeControl } from './TimeControl';
import { Menu } from './Menu';
import { Icon } from './Icon';
import { Textarea, AdjustHeightToTextarea } from './Textarea';
import { Comment } from './Comment';

export type Props = {
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
  customCss?: SerializedStyles;
};

export const Task: React.FC<Props> = props => {
  const [focusCommentIndex, setFocusCommentIndex] = useState<number | null>(
    null
  );
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
        background-color: ${colors.white};
        padding: 6px 16px 6px 10px;
        border-radius: 3px;
        border: solid 1px
          ${props.isPlaying ? colors.primary500 : 'rgba(0,0,0,0)'};
        ${shadow}
        ${props.customCss}
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: flex-start;
        `}
      >
        <AdjustHeightToTextarea>
          <Menu
            addComment={() => addComment(props.comments.length)}
            delete={() => props.delete()}
          />
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
        <Textarea
          placeholder={'Input Task'}
          value={props.title}
          changeValue={value => props.editTitle(value)}
          customCss={css`
            margin-left: 6px;
            text-decoration: ${props.isDone ? 'line-through' : 'unset'};
            color: ${props.isDone ? colors.black350 : colors.black500};
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
              padding: 8px 8px 4px 24px;
            `}
          >
            {props.comments.map((comment, i) => (
              <div
                css={css`
                  margin-top: ${i !== 0 ? '4px' : 0};
                `}
                key={i}
              >
                <Comment
                  comment={comment}
                  editComment={comment => editComment(comment, i)}
                  delete={() => deleteComment(i)}
                  onPressEnter={() => addComment(i + 1)}
                  onPressArrowUp={() => focusPrevComment(i)}
                  onPressArrowDown={() => focusNextComment(i)}
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
};

import React, { useState, useEffect, useRef } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import { v4 as uuidv4 } from 'uuid';

import { colors } from 'styles/color';
import { shadow } from 'styles/shadow';
import { Checkbox } from './Checkbox';
import { TimeControl } from './TimeControl';
import { Menu } from './Menu';
import { Icon } from './Icon';
import { AdjustHeightToTextarea, Handler } from './Textarea';
import { Comment } from './Comment';
import { TaskTextarea } from './TaskTextare';
import { useDebounce } from 'hooks/debounce';
import { useInit } from 'hooks/init';

type Comment = {
  id: string;
  text: string;
};

export type Props = {
  uuid: string;
  title: string;
  timesec: number;
  isDone: boolean;
  isPlaying: boolean;
  comments: string[];
  subTaskUuids: string[];
  delete: () => void;
  addSec: (sec: number, current: number) => void;
  subtractSec: (sec: number, current: number) => void;
  play: () => void;
  pause: () => void;
  editTitle: (title: string) => void;
  editComments: (comments: string[]) => void;
  done: (isDone: boolean) => void;
  addTask: () => void;
  // moveToSubtask: () => void;
  addSubtask: () => void;
  customCss?: SerializedStyles;
  focus?: boolean;
};

export const Task = React.forwardRef<HTMLDivElement, Props>(
  (props, handleRef) => {
    const [isHover, setIsHover] = useState(false);
    const [focusCommentIndex, setFocusCommentIndex] = useState<number | null>(
      null
    );
    const [beforeFocus, setBeforeFocus] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const innerRef = useRef<Handler>(null);

    useInit(() => {
      setComments(props.comments.map(v => ({ id: uuidv4(), text: v })));
    });

    useEffect(() => {
      if (props.focus != null && props.focus !== beforeFocus) {
        setBeforeFocus(props.focus);
        if (props.focus && innerRef.current != null) {
          innerRef.current.focus();
        }
      }
    }, [beforeFocus, props.focus, props.comments]);

    const focusPrevComment = (currentIndex: number) => {
      setFocusCommentIndex(currentIndex === 0 ? 0 : currentIndex - 1);
    };
    const focusNextComment = (currentIndex: number) => {
      setFocusCommentIndex(
        currentIndex === comments.length - 1 ? currentIndex : currentIndex + 1
      );
    };

    // パフォーマンスを考慮し、タイトル編集時に毎回props.editTitleを実行しない。
    // 変更イベントから500ms以内に次のイベントが発生しなかった場合に、props.editTitleを実行する。
    const [invokeEmitEditTitle] = useDebounce(500);
    const editTitle = (value: string) => {
      invokeEmitEditTitle(() => {
        props.editTitle(value);
      });
    };

    // const moveToSubtask = () => {
    //   // タイトル編集処理が残ってる場合は、終わるのを待ってから処理する
    //   if (isRemainsEmitEditTitle) {
    //     setTimeout(() => {
    //       props.moveToSubtask();
    //     }, 500);
    //   } else {
    //     props.moveToSubtask();
    //   }
    // };

    // パフォーマンスを考慮し、コメント編集時に毎回props.editCommentを実行しない。
    // 変更イベントから500ms以内に次のイベントが発生しなかった場合に、props.editCommentを実行する。
    const [invokeEmitEditComments] = useDebounce(500);
    const editComment = (comment: string, index: number) => {
      const tmpComments = [...comments];
      tmpComments[index].text = comment;
      setComments(tmpComments);
      setFocusCommentIndex(index);
      invokeEmitEditComments(() => {
        props.editComments(tmpComments.map(v => v.text));
      });
    };
    const deleteComment = (index: number) => {
      const tmpComments = [...comments];
      tmpComments.splice(index, 1);
      setComments(tmpComments);
      setFocusCommentIndex(index === 0 ? 0 : index - 1);
      invokeEmitEditComments(() => {
        props.editComments(tmpComments.map(v => v.text));
      });
    };
    const addComment = (index: number) => {
      const tmpComments = [...comments];
      tmpComments.splice(index, 0, { id: uuidv4(), text: '' });
      setComments(tmpComments);
      setFocusCommentIndex(index);
      invokeEmitEditComments(() => {
        props.editComments(tmpComments.map(v => v.text));
      });
    };

    return (
      <div
        css={css`
          position: relative;
          background-color: ${colors.white};
          padding: 6px 16px 6px 10px;
          border-radius: 3px;
          border: solid 1px
            ${props.isPlaying
              ? colors.primary500
              : isHover
              ? colors.black500
              : colors.transparent};
          ${shadow};
          ${props.customCss};
        `}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
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
                addComment={() => addComment(comments.length)}
                addSubTask={props.addSubtask}
                delete={props.delete}
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
            editTitle={editTitle}
            onPressEnter={props.addTask}
            // onPressTab={moveToSubtask}
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
              readonly={props.subTaskUuids.length > 0}
            />
          </AdjustHeightToTextarea>
          <AdjustHeightToTextarea
            css={css`
              text-align: center;
              opacity: ${props.subTaskUuids.length > 0 || props.isDone ? 0 : 1};
              pointer-events: ${props.subTaskUuids.length > 0 || props.isDone
                ? 'none'
                : 'all'};
            `}
            onClick={() => (props.isPlaying ? props.pause() : props.play())}
          >
            <Icon
              iconname={!props.isPlaying ? 'play' : 'pause'}
              customCss={css`
                cursor: pointer;
                width: 12px;
                margin-left: 12px;
              `}
            />
          </AdjustHeightToTextarea>
        </div>
        {comments.length > 0 ? (
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
              {comments.map((comment, i) => (
                <div
                  css={css`
                    margin-top: ${i !== 0 ? '2px' : 0};
                  `}
                  key={`${i}-${comment.id}`}
                >
                  <Comment
                    comment={comment.text}
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

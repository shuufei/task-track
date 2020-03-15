import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors } from 'styles/color';
import { shadow } from 'styles/shadow';
import { Checkbox } from './Checkbox';
import { TimeControl } from './TimeControl';
import { Menu } from './Menu';
import { Icon } from './Icon';
import { Textarea, AdjustHeightToTextarea } from './Textarea';

export type Props = {
  title: string;
  timesec: number;
  isDone: boolean;
  isPlaying: boolean;
  addComment: () => void;
  delete: () => void;
  addSec: (sec: number, current: number) => void;
  subtractSec: (sec: number, current: number) => void;
  play: () => void;
  pause: () => void;
  editTitle: (title: string) => void;
  editComments: (comments: string[]) => void;
  done: (isDone: boolean) => void;
};

export const Task: React.FC<Props> = props => {
  return (
    <div
      css={css`
        display: flex;
        align-items: flex-start;
        background-color: ${colors.white};
        padding: 6px 16px 6px 12px;
        border-radius: 3px;
        border: solid 1px
          ${props.isPlaying ? colors.primary500 : 'rgba(0,0,0,0)'};
        ${shadow}
      `}
    >
      <AdjustHeightToTextarea>
        <Menu addComment={() => {}} delete={() => {}} />
      </AdjustHeightToTextarea>
      <AdjustHeightToTextarea>
        <Checkbox
          isChecked={props.isDone}
          onToggle={() => {
            props.done(!props.isDone);
          }}
          css={css`
            margin-left: 10px;
          `}
        />
      </AdjustHeightToTextarea>
      <Textarea
        placeholder={'Input Task'}
        value={props.title}
        changeValue={value => props.editTitle(value)}
        css={css`
          margin-left: 4px;
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
          subtractSec={(sec, currentSec) => props.subtractSec(sec, currentSec)}
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
          css={css`
            cursor: pointer;
            width: 12px;
            margin-left: 12px;
            visibility: ${props.isDone ? 'hidden' : 'visible'};
          `}
        />
      </AdjustHeightToTextarea>
    </div>
  );
};

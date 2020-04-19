import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { TimeField } from './TimeField';
import { PopupContainer } from './PopupContainer';
import { TimeControlPanel } from './TimeControlPanel';
import { colors } from 'styles/color';

export type Props = {
  timesec: number;
  isPlaying?: boolean;
  readonly?: boolean;
  addSec: (sec: number, currentSec: number) => void;
  subtractSec: (sec: number, currentSec: number) => void;
};

export const TimeControl: React.FC<Props> = props => {
  const readonlyStyle = css`
    background-color: ${colors.transparent};
    cursor: unset;
    :hover {
      background-color: ${colors.transparent};
    }
  `;
  const playingStyle = props.readonly
    ? css`
        color: ${colors.primary500};
        :focus {
          color: ${colors.primary500};
        }
      `
    : css`
        background-color: ${colors.primary500};
        color: ${colors.white};
        :hover {
          background-color: ${colors.primary500};
        }
        :focus {
          color: ${colors.white};
        }
      `;
  const timeFieldRender = () => (
    <TimeField
      timesec={props.timesec}
      customCss={css`
        ${props.isPlaying ? playingStyle : undefined};
        ${props.readonly ? readonlyStyle : undefined};
      `}
    />
  );
  const timeControlPanelRender = () => <TimeControlPanel {...props} />;
  return (
    <PopupContainer
      popupTriger={timeFieldRender()}
      popup={timeControlPanelRender()}
      keep={true}
      readonly={props.readonly}
    />
  );
};

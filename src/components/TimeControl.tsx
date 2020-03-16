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
  addSec: (sec: number, currentSec: number) => void;
  subtractSec: (sec: number, currentSec: number) => void;
};

export const TimeControl: React.FC<Props> = props => {
  const timeFieldStyles = props.isPlaying
    ? css`
        background-color: ${colors.primary500};
        color: ${colors.white};
        :hover {
          background-color: ${colors.primary500};
        }
        :focus {
          color: ${colors.white};
        }
      `
    : css``;
  const timeFieldRender = () => (
    <TimeField timesec={props.timesec} customCss={timeFieldStyles} />
  );
  const timeControlPanelRender = () => <TimeControlPanel {...props} />;
  return (
    <PopupContainer
      popupTriger={timeFieldRender()}
      popup={timeControlPanelRender()}
      keep={true}
    />
  );
};

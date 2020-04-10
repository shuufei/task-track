import React from 'react';
/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/core';

export const ICONS = {
  play: 'icons/play.svg',
  pause: 'icons/pause.svg',
  menu: 'icons/menu.svg',
  close: 'icons/close.svg',
  plus: 'icons/plus.svg',
  arrowUp: 'icons/arrow-up.svg',
  arrowDown: 'icons/arrow-down.svg'
};

export type Props = {
  iconname: keyof typeof ICONS;
  customCss?: SerializedStyles;
};

export const Icon: React.FC<Props> = props => (
  <img src={ICONS[props.iconname]} alt={props.iconname} css={props.customCss} />
);

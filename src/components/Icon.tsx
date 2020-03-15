import React from 'react';

export const ICONS = {
  play: 'icons/play.svg',
  pause: 'icons/pause.svg',
  menu: 'icons/menu.svg',
  close: 'icons/close.svg'
};

export type Props = {
  iconname: keyof typeof ICONS;
};

export const Icon: React.FC<Props> = props => (
  <img src={ICONS[props.iconname]} alt={props.iconname} {...props} />
);

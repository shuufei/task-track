import React from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import { PopupContainer } from './PopupContainer';
import { Icon } from './Icon';
import { MenuPanel } from './MenuPanel';

export type Props = {
  addComment?: () => void;
  delete?: () => void;
  customCss?: SerializedStyles;
};

export const Menu: React.FC<Props> = props => {
  const menuIconRender = () => (
    <Icon
      iconname={'menu'}
      customCss={css`
        cursor: pointer;
        display: inline-block;
        line-height: 0;
      `}
    />
  );
  const menuPanelRender = () => (
    <MenuPanel addComments={props.addComment} delete={props.delete} />
  );
  return (
    <PopupContainer
      popupTriger={menuIconRender()}
      popup={menuPanelRender()}
      position={'left'}
      custonCss={props.customCss}
    />
  );
};

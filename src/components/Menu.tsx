import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { PopupContainer } from './PopupContainer';
import { Icon } from './Icon';
import { MenuPanel } from './MenuPanel';

export type Props = {
  addComment: () => void;
  delete: () => void;
};

export const Menu: React.FC<Props> = props => {
  const menuIconRender = () => (
    <Icon
      iconname={'menu'}
      css={css`
        cursor: pointer;
      `}
    />
  );
  const menuPanelRender = () => (
    <MenuPanel
      addComments={() => props.addComment()}
      delete={() => props.delete()}
    />
  );
  return (
    <PopupContainer
      popupTriger={menuIconRender()}
      popup={menuPanelRender()}
      position={'left'}
    />
  );
};

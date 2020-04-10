import React from 'react';

import { PopupContainer } from './PopupContainer';
import { Icon } from './Icon';
import { AddItemPanel } from './AddItemPanel';

export type Props = {
  addTask: () => void;
  addSection: () => void;
};

export const AddItem: React.FC<Props> = props => {
  const addItemIconRender = () => <Icon iconname={'plus'} />;
  const addItemPanelRender = () => (
    <AddItemPanel addTask={props.addTask} addSection={props.addSection} />
  );
  return (
    <PopupContainer
      popupTriger={addItemIconRender()}
      popup={addItemPanelRender()}
      position={'left'}
    />
  );
};

import React from 'react';

import { TimeField } from './TimeField';
import { PopupContainer } from './PopupContainer';
import { TimeControlPanel } from './TImeControlPanel';

export type Props = {
  timesec: number;
  addSec: (sec: number, currentSec: number) => void;
  subtractSec: (sec: number, currentSec: number) => void;
};

export const TimeControl: React.FC<Props> = props => {
  const timeFieldRender = () => <TimeField timesec={props.timesec} />;
  const timeControlPanelRender = () => <TimeControlPanel {...props} />;
  return (
    <PopupContainer
      popupTriger={timeFieldRender()}
      popup={timeControlPanelRender()}
      keep={true}
    />
  );
};

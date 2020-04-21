import React, { useRef } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import * as typography from 'styles/typography';
import { colors } from 'styles/color';
import { Icon } from 'components/presentation/Icon';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { convertSectionToCsvFromJson } from 'util/csvConverter';

export type Props = {
  sectinId: string;
  customCss?: SerializedStyles;
};

export const ArchiveSectionContainer: React.FC<Props> = props => {
  const section = useSelector((state: RootState) =>
    state.task.sections.find(v => v.id === props.sectinId)
  );
  const tasks = useSelector((state: RootState) =>
    state.task.tasks.filter(v => v.sectionId === props.sectinId)
  );
  const ref = useRef<HTMLAnchorElement>(null);
  const archive = () => {
    if (section == null || tasks.length === 0) {
      return;
    }
    const csv = convertSectionToCsvFromJson(section, tasks);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    if (ref.current == null) {
      return;
    }
    ref.current.setAttribute('href', url);
    ref.current.setAttribute(
      'download',
      `tasktrack-${section.title}-${new Date().toISOString()}.csv`
    );
    ref.current.click();
  };

  return (
    <div
      onClick={archive}
      css={css`
        position: relative;
        display: ${tasks.length === 0 ? 'none' : 'flex'};
        align-items: center;
        cursor: pointer;
        ${props.customCss};
      `}
    >
      <span
        css={css`
          ${typography.caption};
          color: ${colors.black350};
        `}
      >
        Archive
      </span>
      <Icon
        iconname={'archive'}
        customCss={css`
          margin-left: 4px;
        `}
      />
      <a
        ref={ref}
        href="./"
        css={css`
          position: absolute;
          left: 0;
          top: 0;
          height: 0;
          width: 0;
          visibility: hidden;
          pointer-events: none;
        `}
      >
        archive file
      </a>
    </div>
  );
};

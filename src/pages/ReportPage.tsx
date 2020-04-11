import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { SectionReportContainer } from 'components/container/SectionReportContainer';

export const ReportPage: React.FC = () => {
  const sectionIds = useSelector((state: RootState) =>
    state.task.sections.map(v => v.id)
  );

  return (
    <div
      css={css`
        padding: 12px 0 24px;
      `}
    >
      {sectionIds.map((v, i) => (
        <SectionReportContainer
          key={v}
          sectionId={v}
          customCss={css`
            margin-top: ${i !== 0 ? '16px' : '0'};
          `}
        />
      ))}
    </div>
  );
};

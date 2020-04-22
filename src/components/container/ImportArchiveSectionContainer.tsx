import React, { useRef, useState } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';

import * as typography from 'styles/typography';

import {
  convertSectionToJsonFromCsv,
  FormatError,
  NoRecordError
} from 'util/csvConverter';
import { useDispatch } from 'react-redux';
import { actionCreator } from 'store/task';
import { colors } from 'styles/color';

export type Props = {
  sectionId: string;
  customCss?: SerializedStyles;
};

export const ImportArchiveSectionContainer: React.FC<Props> = props => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const importSection = (csv: string[]) => {
    try {
      const [sections, tasks] = convertSectionToJsonFromCsv(csv);
      dispatch(
        actionCreator.importSections({
          sections,
          tasks,
          importedSectionId: props.sectionId
        })
      );
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof FormatError) {
        setErrorMessage('Format Error');
      } else if (error instanceof NoRecordError) {
        setErrorMessage('No Record');
      } else {
        setErrorMessage('Unexpected Error');
      }
    }
  };
  const onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null || event.target.files?.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        return;
      }
      importSection(reader.result.split('\n'));
    });
  };
  return (
    <div
      css={css`
        position: relative;
        ${props.customCss}
      `}
    >
      <input
        ref={ref}
        type="file"
        accept=".csv"
        onChange={onChanged}
        css={css`
          position: absolute;
          left: 0;
          top: 0;
          height: 0;
          width: 0;
          visibility: hidden;
        `}
      />
      {errorMessage && (
        <p
          css={css`
            ${typography.base};
            color: ${colors.red500};
            margin: 0;
            margin-bottom: 8px;
          `}
        >
          {errorMessage}
        </p>
      )}
      <span
        css={css`
          ${typography.base};
          color: ${colors.black350};
          cursor: pointer;
          text-decoration: underline;
        `}
        onClick={() => ref.current?.click()}
      >
        Import Section
      </span>
    </div>
  );
};

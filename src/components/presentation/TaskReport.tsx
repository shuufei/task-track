import React, { useState } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles, keyframes } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';
import { convertToTimeFormatFromSec } from 'util/time';

export type Props = {
  title: string;
  comments: string[];
  timesec: number;
  maxTimesec: number;
  customCss?: SerializedStyles;
};

export const TaskReport: React.FC<Props> = props => {
  const [isHover, setIsHover] = useState(false);
  const width = (props.timesec / props.maxTimesec) * 100;
  const time = convertToTimeFormatFromSec(props.timesec);
  const ANIMATION_DURATION_SEC = 0.8;
  const ANIMATION_DELAY_SEC = 0.4;
  return (
    <div
      css={props.customCss}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <span
        css={css`
          ${typography.caption};
          margin-left: 6px;
        `}
      >
        {props.title}
      </span>
      <div
        css={css`
          width: ${width > 1 ? width : 1}%;
          height: 24px;
          margin-top: 4px;
          position: relative;
        `}
      >
        <div
          css={css`
            width: 0%;
            height: 100%;
            border-radius: 0 2px 2px 0;
            background-color: ${isHover
              ? colors.primaryDark
              : colors.primary400};
            animation: ${stretch} ${ANIMATION_DURATION_SEC}s
              ${ANIMATION_DELAY_SEC}s ease-out forwards;
          `}
        ></div>
        <label
          css={css`
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(calc(100% + 8px), -50%);
            ${typography.caption};
            font-weight: ${isHover
              ? typography.weight.bold
              : typography.weight.regular};
            color: ${isHover ? colors.primaryDark : colors.black300};
            opacity: 0;
            animation: ${fadeIn} 0.2s
              ${ANIMATION_DURATION_SEC + ANIMATION_DELAY_SEC}s ease-out forwards;
          `}
        >
          {time}
        </label>
      </div>
    </div>
  );
};

const stretch = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

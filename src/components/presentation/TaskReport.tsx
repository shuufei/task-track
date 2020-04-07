import React, { useState, useRef, useEffect } from 'react';
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
  const ANIMATION_DURATION_SEC = 0.8;
  const ANIMATION_DELAY_SEC = 0.4;
  const TIME_LABEL_SIDE_MARGIN = 8;
  const CHART_BAR_MIN_WIDTH_PX = 5;

  const [isHover, setIsHover] = useState(false);
  const [widthPx, setWidthPx] = useState(0);
  const selfRef = useRef<HTMLDivElement>(null);
  const timeLabelRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (selfRef.current == null || selfRef.current == null) {
      return;
    }
    const selfRect = selfRef.current.getBoundingClientRect();
    const timeLabelRect = timeLabelRef.current?.getBoundingClientRect();
    const maxWidthPx =
      selfRect.width - (timeLabelRect!.width + TIME_LABEL_SIDE_MARGIN * 2);
    setWidthPx((props.timesec / props.maxTimesec) * maxWidthPx);
  }, [widthPx, setWidthPx, props.maxTimesec, props.timesec]);

  const time = convertToTimeFormatFromSec(props.timesec);
  return (
    <div
      ref={selfRef}
      css={css`
        ${props.customCss};
      `}
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
          width: ${widthPx > CHART_BAR_MIN_WIDTH_PX || widthPx === 0
            ? widthPx
            : CHART_BAR_MIN_WIDTH_PX}px;
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
          ref={timeLabelRef}
          css={css`
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(
              calc(100% + ${TIME_LABEL_SIDE_MARGIN}px),
              -50%
            );
            ${typography.caption};
            color: ${isHover ? colors.black500 : colors.black300};
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

import React, { useState, useRef, useEffect } from 'react';
/** @jsx jsx */
import { jsx, css, SerializedStyles, keyframes } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';
import { convertToTimeFormatFromSec } from 'util/time';
import { Icon } from './Icon';

export type Props = {
  title: string;
  comments: string[];
  timesec: number;
  maxTimesec: number;
  isSubTask?: boolean;
  customCss?: SerializedStyles;
};

export const TaskReport: React.FC<Props> = props => {
  const ANIMATION_DURATION_SEC = 0.8;
  const ANIMATION_DELAY_SEC = 0.4;
  const TIME_LABEL_SIDE_MARGIN = 8;
  const CHART_BAR_MIN_WIDTH_PX = 5;

  const [isHover, setIsHover] = useState(false);
  const [widthPx, setWidthPx] = useState(0);
  const [isOpenComments, setIsOpenComments] = useState(false);
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
      <div>
        <span
          css={css`
            ${typography.caption};
            margin-left: 6px;
          `}
        >
          {props.title}
        </span>
        {props.comments.length > 0 && (
          <div
            css={css`
              display: inline-block;
              cursor: pointer;
            `}
            onClick={() => setIsOpenComments(!isOpenComments)}
          >
            <span
              css={css`
                margin-left: 16px;
                ${typography.caption};
                color: ${colors.black300};
              `}
            >
              {isOpenComments ? 'Hidden Comments' : 'Show Comments'}
            </span>
            <Icon
              iconname={'arrowDown'}
              customCss={css`
                width: 9px;
                margin-left: 4px;
                transform: ${isOpenComments ? 'rotate(180deg)' : 'none'};
              `}
            />
          </div>
        )}
      </div>
      {isOpenComments && (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            padding: 0 6px;
            ${typography.caption};
            color: ${colors.black400};
          `}
        >
          {props.comments.map((v, i) => (
            <div
              css={css`
                display: flex;
                align-items: flex-start;
                margin-top: 6px;
              `}
              key={i}
            >
              <span>・</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}
      <div
        css={css`
          width: ${widthPx > CHART_BAR_MIN_WIDTH_PX || widthPx === 0
            ? widthPx
            : CHART_BAR_MIN_WIDTH_PX}px;
          height: 24px;
          margin-top: 6px;
          position: relative;
        `}
      >
        <div
          css={css`
            width: 0%;
            height: 100%;
            border-radius: 0 2px 2px 0;
            background-color: ${!props.isSubTask
              ? isHover
                ? colors.primaryDark
                : colors.primary400
              : isHover
              ? colors.black350
              : colors.black300};
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
            color: ${isHover ? colors.black500 : colors.black350};
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

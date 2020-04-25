import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core';

import { colors } from 'styles/color';
import * as typography from 'styles/typography';
import { shadow } from 'styles/shadow';
import { RootState } from 'store';
import { actionCreator } from 'store/task';
import { zindex } from 'styles/fixed-zindex';

export const UndoContainer: React.FC = () => {
  const [invokedFirstUndo, setInvokedFirstUndo] = useState(false);
  const [timeoutProcess, setTimeoutProcess] = useState<NodeJS.Timeout | null>(
    null
  );
  const undoState = useSelector((state: RootState) => state.task.undoState);
  const dispatch = useDispatch();
  const existUndoState =
    undoState.section != null ||
    undoState.task != null ||
    undoState.comment != null;

  useEffect(() => {
    if (existUndoState) {
      if (!invokedFirstUndo) {
        setInvokedFirstUndo(true);
      }
      if (timeoutProcess != null) {
        clearTimeout(timeoutProcess);
      }
      setTimeoutProcess(
        setTimeout(() => {
          dispatch(actionCreator.undoClear());
        }, 5000)
      );
    }
  }, [
    undoState,
    dispatch,
    invokedFirstUndo,
    setInvokedFirstUndo,
    existUndoState,
    timeoutProcess
  ]);
  return (
    <button
      onClick={() => {
        if (timeoutProcess != null) {
          clearTimeout(timeoutProcess);
        }
        dispatch(actionCreator.undo());
      }}
      css={css`
        display: ${invokedFirstUndo ? 'inline-block' : 'none'};
        padding: 6px 24px;
        ${typography.caption};
        background-color: ${colors.black500};
        color: ${colors.white};
        border: none;
        border-radius: 2px;
        ${shadow};
        cursor: pointer;
        position: fixed;
        top: 16px;
        right: 24px;
        ${zindex.undo};
        visibility: ${existUndoState ? 'visible' : 'hidden'};
        height: ${existUndoState ? 'auto' : 0};
        animation: ${!invokedFirstUndo
            ? ''
            : existUndoState
            ? fadeInRight
            : fadeOutRight}
          0.2s ease-out forwards;
        :focus {
          outline: none;
        }
      `}
    >
      Undo
    </button>
  );
};

const fadeInRight = keyframes`
  0% {
    visibility: hidden;
    opacity: 0;
    height: auto;
  }
  1% {
    opacity: 0;
    transform: translateX(4px);
    height: auto;
  }
  100% {
    visibility: visible;
    opacity: 1;
    transform: translateX(0);

  }
`;

const fadeOutRight = keyframes`
  0% {
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
    height: auto;
  }
  99% {
    opacity: 0;
    transform: translateX(4px);
    height: auto;
  }
  100% {
    visibility: hidden;
    opacity: 0;
    transform: translateX(4px);
    height: 0;
  }
`;

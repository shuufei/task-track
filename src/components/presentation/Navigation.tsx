import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Link, useRouteMatch } from 'react-router-dom';

import * as typography from 'styles/typography';
import { colors } from 'styles/color';
import { shadow } from 'styles/shadow';
import { zindex } from 'styles/fixed-zindex';

export const NAVIGATION_HEIGHT = 47;

const navItemStyles = css`
  width: 75px;
  padding: 6px;
  border-radius: 3px;
  text-align: center;
  background-color: ${colors.white};
`;
const activeNavItemStyles = css`
  ${navItemStyles};
  background: ${colors.black500};
`;
const navItemTextStyles = css`
  text-decoration: none;
  ${typography.base};
`;
const activeNavItemTextStyles = css`
  ${navItemTextStyles};
  color: ${colors.white};
`;

export const Navigation: React.FC = () => {
  const tasksMatch = useRouteMatch('/tasks');
  const reportMatch = useRouteMatch('/report');

  return (
    <nav
      css={css`
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${colors.white};
        border-radius: 0 0 4px 4px;
        ${shadow};
        ${zindex.nav};
      `}
    >
      <ul
        css={css`
          display: flex;
          padding: 8px;
          margin: 0;
          list-style: none;
        `}
      >
        <li css={tasksMatch != null ? activeNavItemStyles : navItemStyles}>
          <Link
            to="/tasks"
            css={
              tasksMatch != null ? activeNavItemTextStyles : navItemTextStyles
            }
          >
            Tasks
          </Link>
        </li>
        <li css={reportMatch != null ? activeNavItemStyles : navItemStyles}>
          <Link
            to="/report"
            css={
              reportMatch != null ? activeNavItemTextStyles : navItemTextStyles
            }
          >
            Report
          </Link>
        </li>
      </ul>
    </nav>
  );
};

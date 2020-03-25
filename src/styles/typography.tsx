import { css } from '@emotion/core';

import { colors } from './color';

const lato = '"Lato", sans-serif';
const weight = {
  light: 300,
  regular: 400,
  bold: 700,
  black: 900
};
const size = {
  m: '14px',
  s: '12px',
  ss: '9px'
};

export const base = css`
  font-family: ${lato};
  font-weight: ${weight.regular};
  font-size: ${size.m};
  letter-spacing: 0.5px;
  line-height: 1.4;
  color: ${colors.black500};
`;

export const caption = css`
  ${base};
  font-size: ${size.s};
`;

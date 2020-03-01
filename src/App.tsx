import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import logo from './logo.svg';
import './App.css';

const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit
        {' '}
        <code>src/App.tsx</code>
        {' '}
        and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      <p css={css`
        color: #fff;
        margin-top: 12px;
      `}
      >
        task track
      </p>
    </header>
  </div>
);

export default App;

const buttonStyle = css`
  padding: 6px 12px;
  border-radius: 3px;
`
export const Button: React.FC<> = () => (
  <button css={buttonStyle}>button</button>
);

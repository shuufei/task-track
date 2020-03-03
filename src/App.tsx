import React, { useRef, useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import logo from './logo.svg';
import './App.css';

const App: React.FC = () => (
  <div className="App">
    <TextInputWithFocusButton />
  </div>
);

export default App;

const buttonStyle = css`
  padding: 6px 12px;
  border-radius: 3px;
`;
export const Button: React.FC = () => <button css={buttonStyle}>button</button>;

export const TextInputWithFocusButton: React.FC = () => {
  // const inputEl = useRef<HTMLInputElement>(null);
  // const onButtonClick = () => {
  //   console.log(inputEl);
  //   inputEl?.current?.focus();
  // };
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const onButtonClick = () => {
    inputRef?.focus();
  };
  return (
    <React.Fragment>
      {/* <input type="text" ref={inputEl} /> */}
      <TextInput inputRef={el => setInputRef(el)} />
      <button onClick={onButtonClick}>Focus the input</button>
    </React.Fragment>
  );
};

type TextInputPros = {
  inputRef: (el: HTMLInputElement) => void;
};

export const TextInput: React.FC<TextInputPros> = ({ inputRef }) => {
  return <input type="text" ref={inputRef} />;
};

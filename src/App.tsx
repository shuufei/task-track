import React, { useRef, useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  document.addEventListener('dragenter', function(e) {
    console.log(
      '--- dragenter: ',
      (e.target as any).className.indexOf('dropzone')
    );
    if ((e.target as any).className.indexOf('dropzone') >= 0) {
      (e.target as any).style.background = 'blue';
    }
    if ((e.target as any).className.indexOf('parent') >= 0) {
      (e.target as any).style.background = 'red';
    }
  });
  return (
    <div className="App">
      <TextInputWithFocusButton />
      <DraggableContent uuid={'0'} />
      <DropZone />
      <DraggableContent uuid={'1'} />
      <DropZone />
      <DraggableContent uuid={'2'} />
    </div>
  );
};

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
  const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('--- event: ', e.keyCode, e.key, e);
  };
  return <input type="text" ref={inputRef} onKeyDown={e => keyPress(e)} />;
};

export const DraggableContent: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [draggable, setDraggable] = useState(false);
  const dragstart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', uuid);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div
      css={css`
        background: #a0a0a0;
        padding: 8px 12px;
        margin: 12px;
        width: 200px;
        height: 40px;
        box-sizing: border-box;
      `}
      id={uuid}
      className="parent"
      draggable={draggable}
      onDragEnd={() => setDraggable(false)}
    >
      <div
        css={css`
          width: 20px;
          height: 20px;
          background-color: #000;
        `}
        onMouseDown={() => setDraggable(true)}
        onMouseUp={() => setDraggable(false)}
        onDragStart={event => dragstart(event)}
      ></div>
    </div>
  );
};

export const DropZone: React.FC = () => (
  <div
    css={css`
      width: 200px;
      height: 5px;
      background: #ccc;
      margin: 8px 12px;
    `}
    className="dropzone"
  ></div>
);

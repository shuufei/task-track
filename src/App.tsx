import React, { useRef, useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

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
  const [list, setList] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 }
  ]);
  return (
    <div className="App">
      <TextInputWithFocusButton />
      <DraggableContent uuid={'0'} />
      <DropZone />
      <DraggableContent uuid={'1'} />
      <DropZone />
      <DraggableContent uuid={'2'} />
      <div
        css={css`
          margin-top: 32px;
        `}
      >
        <DndProvider backend={Backend}>
          {list.map(v => {
            return (
              <SimpleDragAndDropComponent
                itemId={v.id}
                sort={(src, dist) => {
                  console.log('--- sort: ', src, dist);
                  const l = [...list];
                  const srcIndex = l.findIndex(v => v.id === src);
                  const distIndex = l.findIndex(v => v.id === dist);
                  l.splice(srcIndex, 1);
                  l.splice(distIndex, 0, { id: src });
                  setList(l);
                }}
              />
            );
          })}
        </DndProvider>
      </div>
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

export const SimpleDragAndDropComponent: React.FC<{
  itemId: number;
  sort: (src: number, dist: number) => void;
}> = props => {
  const [isDragging, setIsDragging] = useState(false);
  const dragref = useRef(null);
  const dropref = useRef(null);
  const dropref2 = useRef(null);
  const [o, connectDrag, preview] = useDrag({
    item: { id: props.itemId, type: 'SIMPLE_COMPONENT', created: '10:06' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });
  const [{ isOver }, connectDrop] = useDrop({
    accept: 'SIMPLE_COMPONENT',
    hover(item) {
      // console.log('Hovering item.id: ', item);
    },
    drop: v => {
      // console.log('--- dopr: ', props.itemId);
      props.sort((v as any).id, props.itemId);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });
  const [o2, connectDrop2] = useDrop({
    accept: 'SIMPLE_COMPONENT',
    hover(item) {
      // console.log('Hovering item.id: ', item);
    },
    drop: v => {
      // console.log('--- dopr: ', props.itemId);
      props.sort((v as any).id, props.itemId);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  connectDrag(dragref);
  connectDrop(dropref);
  connectDrop2(dropref2);

  return (
    <div
      ref={isDragging ? preview : dropref}
      css={css`
        /* background-color: ${isOver ? 'blue' : '#333'}; */
        background-color: #333;
        position: relative;
        display: flex;
      `}
    >
      <span
        ref={dragref}
        css={css`
          width: 20px;
          height: 20px;
          background: red;
          display: inline-block;
          cursor: pointer;
        `}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onDragEnd={() => setIsDragging(false)}
      ></span>
      Item: {props.itemId}, {isDragging ? 'dragging' : 'none'}
      <div
        ref={dropref2}
        css={css`
          position: absolute;
          bottom: 0;
          height: 5px;
          width: 100%;
          background-color: ${(isOver && o2.isOver) || isOver ? 'red' : '#333'};
        `}
      ></div>
    </div>
  );
};

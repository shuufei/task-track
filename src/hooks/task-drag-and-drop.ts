import {
  DragObjectWithType,
  DragElementWrapper,
  DragPreviewOptions,
  useDrag,
  useDrop
} from 'react-dnd';
import { useRef, useState } from 'react';

export const DRAG_TYPE_TASK = 'TASK';

export type DragObjectType = DragObjectWithType & { uuid: string };

export const useTaskDrag = (
  taskUuid: string,
  setIsDragging: (isDragging: boolean) => void
): [
  React.RefObject<HTMLDivElement>,
  DragElementWrapper<DragPreviewOptions>
] => {
  const handleRef = useRef<HTMLDivElement>(null);
  const [, connectDrag, previewRef] = useDrag({
    item: { uuid: taskUuid, type: DRAG_TYPE_TASK },
    begin: () => {
      setIsDragging(true);
    },
    end: () => {
      setIsDragging(false);
    }
  });

  connectDrag(handleRef);
  return [handleRef, previewRef];
};

export const useTaskDrop = (
  dropCallback: (
    isDraggedTaskUuid: string,
    isOverLowerBody: boolean,
    isOverSubTaskArea: boolean
  ) => void
): [
  React.RefObject<HTMLDivElement>,
  DragObjectType,
  boolean,
  boolean,
  boolean,
  boolean
] => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [isOverUpperBody, setIsOverUpperBody] = useState(false);
  const [isOverLowerBody, setIsOverLowerBody] = useState(false);
  const [isOverSubTaskArea, setIsOverSubTaskArea] = useState(false);
  const [{ draggedItem, isOver }, connectDrop] = useDrop({
    accept: DRAG_TYPE_TASK,
    drop: (v: DragObjectType) => {
      dropCallback(v.uuid, isOverLowerBody, isOverSubTaskArea);
      setIsOverUpperBody(false);
      setIsOverLowerBody(false);
    },
    hover: (_, monitor) => {
      if (dropRef.current == null) {
        return;
      }
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (clientOffset == null) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      setIsOverUpperBody(hoverClientY < hoverMiddleY);
      setIsOverLowerBody(hoverClientY > hoverMiddleY);
      setIsOverSubTaskArea(hoverClientX > 24);
    },
    collect: monitor => {
      return {
        draggedItem: monitor.getItem() as DragObjectType,
        isOver: !!monitor.isOver()
      };
    }
  });
  connectDrop(dropRef);
  return [
    dropRef,
    draggedItem,
    isOver,
    isOver && isOverUpperBody,
    isOver && isOverLowerBody,
    isOver && isOverSubTaskArea
  ];
};

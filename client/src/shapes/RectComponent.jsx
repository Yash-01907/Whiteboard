import React from "react";
import { Rect } from "react-konva";

const RectComponent = ({
  x,
  y,
  width,
  height,
  rotation=0,
  stroke="black",
  fill="",
  key,
strokeWidth,
onClick,
draggable,

}) => {
  return (
    <Rect
    key={key}
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      stroke={stroke}
      fill={fill}
      strokeWidth={strokeWidth}
      onClick={onClick}
      draggable={draggable}
    />
  );
};

export default RectComponent;

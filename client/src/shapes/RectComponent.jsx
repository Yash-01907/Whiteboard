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
}) => {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      stroke={stroke}
      fill={fill}
    />
  );
};

export default RectComponent;

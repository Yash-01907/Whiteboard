import React from "react";
import { Ellipse } from "react-konva";

const EllipseComponent = ({
  x,
  y,
  radiusX,
  radiusY,
  rotation = 0,
  stroke = "black",
  fill = "",
  strokeWidth,
  draggable,
  onClick,
}) => {
  return (
    <Ellipse
      x={x}
      y={y}
      radiusX={radiusX}
      radiusY={radiusY}
      rotation={rotation}
      stroke={stroke}
      fill={fill}
      strokeWidth={strokeWidth}
      draggable={draggable}
      onClick={onClick}
    />
  );
};

export default EllipseComponent;

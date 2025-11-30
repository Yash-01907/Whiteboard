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
      draggable
    />
  );
};

export default EllipseComponent;

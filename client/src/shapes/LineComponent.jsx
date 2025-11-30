import React from "react";
import { Line } from "react-konva";

const LineComponent = ({ points, stroke = "black", strokeWidth = 2,draggable,onClick }) => {
  return (
    <Line
      points={points} 
      stroke={stroke}
      strokeWidth={strokeWidth}
      tension={0.2}
      lineCap="round"
      lineJoin="round"
      draggable={draggable}
      onClick={onClick}
    />
  );
};

export default LineComponent;

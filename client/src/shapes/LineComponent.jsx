import React from "react";
import { Line } from "react-konva";

const LineComponent = ({ points, stroke = "#fff", strokeWidth = 2 }) => {
  return (
    <Line
      points={points} 
      stroke={stroke}
      strokeWidth={strokeWidth}
      tension={0.2}
      lineCap="round"
      lineJoin="round"
    />
  );
};

export default LineComponent;

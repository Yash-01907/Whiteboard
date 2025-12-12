import React from "react";
import { Line } from "react-konva";

const LineComponent = (props) => {
  return (
    <Line
      // Default styles for lines
      tension={0.2}
      lineCap="round"
      lineJoin="round"
      
      // Spread EVERYTHING else (points, stroke, strokeWidth, draggable, events, AND ID)
      {...props} 
    />
  );
};

export default LineComponent;
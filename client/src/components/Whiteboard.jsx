import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import RectComponent from "../shapes/RectComponent";
import EllipseComponent from "../shapes/EllipseComponent.jsx";
import LineComponent from "../shapes/LineComponent.jsx";
import { v4 as uuidv4 } from "uuid";
import { updateStrategies } from "../utils/shapeLogic.js";

const Whiteboard = ({ tool, shapes, setShapes }) => {
  const [newShape, setNewShape] = useState(null);
  const isDrawing = useRef(false);

  // const handleMouseDown = (e) => {
  //   isDrawing.current = true;
  //   const pos = e.target.getStage().getPointerPosition();

  //   // Standard default props
  //   const commonProps = {
  //     id: uuidv4(),
  //     tool,
  //     stroke: "#fff"
  //   };

  //   // SPECIAL LOGIC FOR LINE
  //   if (tool === 'line') {
  //     setNewShape({
  //       ...commonProps,
  //       x: 0, // Crucial: Line points are absolute, so shape position is 0
  //       y: 0,
  //       points: [pos.x, pos.y], // Start with the first point
  //     });
  //   }

  //   else {
  //     setNewShape({
  //       ...commonProps,
  //       x: pos.x,
  //       y: pos.y,
  //       startX: pos.x, // Needed for your Ellipse math
  //       startY: pos.y,
  //     });
  //   }
  // };

  const handleMouseDown = (e) => {
    isDrawing.current = true;

    const pos = e.target.getStage().getPointerPosition();

    setNewShape({
      tool,
      id: uuidv4(),
      x: pos.x,
      y: pos.y,
      startX: pos.x,
      startY: pos.y,
    });
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current || !newShape) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    const updatedStrategy = updateStrategies[tool];
    const startPos = { x: newShape.startX, y: newShape.startY };
    const currentPos = { x: point.x, y: point.y };
    const newAttr = updatedStrategy(startPos, currentPos, newShape?.points);
    setNewShape((prev) => ({ ...prev, ...newAttr }));
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    setShapes((prev) => [...prev, newShape]);
    setNewShape(null);
  };

  const shapeRegistry = {
    rect: (props) => <RectComponent {...props} />,
    ellipse: (props) => <EllipseComponent {...props} />,
    line: (props) => <LineComponent {...props} />,
  };

  return (
    <div>
      {/* The Canvas Area */}
      <Stage
        className="bg-[#1A1A1A]"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown} // Logic for mobile
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        // style={{ border: "2px solid #333", backgroundColor: "#f0f0f0" }}
      >
        <Layer>{shapes.map((shape) => shapeRegistry[shape.tool](shape))}</Layer>
        <Layer>{newShape && shapeRegistry[tool](newShape)}</Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;

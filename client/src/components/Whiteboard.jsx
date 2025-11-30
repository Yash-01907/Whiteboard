import React, { useState, useRef } from "react";
import { Stage, Layer, Arrow, Text } from "react-konva"; // Import Arrow and Text
import { v4 as uuidv4 } from "uuid";


// Shape Components
import RectComponent from "../shapes/RectComponent";
import EllipseComponent from "../shapes/EllipseComponent";
import LineComponent from "../shapes/LineComponent";
import { updateStrategies } from "../utils/shapeLogic.js";
import TextComponent from "../shapes/TextComponent.jsx";
import ArrowComponent from "../shapes/ArrowComponent.jsx";
function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const Whiteboard = ({
  tool,
  shapes,
  setShapes,
  currentColor,
  currentWidth,
}) => {
  const [newShape, setNewShape] = useState(null);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  // --- 1. MOUSE DOWN (Start Drawing) ---
  const handleMouseDown = (e) => {
    // If we are in "Select" or "Eraser" mode, do not start drawing a new shape
    if (tool === "select" || tool === "eraser") return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const id = uuidv4();

    // Base properties shared by most shapes
    // We use the 'currentColor' and 'currentWidth' props here
    setNewShape( {
      id,
      tool,
      x: pos.x,
      y: pos.y,
      stroke: currentColor,
      strokeWidth: currentWidth,
      startX: pos.x,
      startY: pos.y,
    });

    // Specific Init Logic for different tools
    if (tool === "text") {
      setNewShape(prev=>({
        ...prev,
        text: "Double click to edit", // Placeholder text
        fontSize: 20,
        fill: currentColor, // Text uses 'fill' for color, not 'stroke'
      }));
    } else if (tool === "line" || tool === "arrow") {
      setNewShape(prev=>({
        ...prev,
        fill: currentColor, // Arrow head color
      }));
    } 
    console.log(newShape)
  };

  // --- 2. MOUSE MOVE (Preview Drawing) ---
  const handleMouseMove = (e) => {
    if (!isDrawing.current || !newShape) return;
    console.log(newShape);

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // Helper: Arrows behave exactly like Lines during creation
    // We check if the tool is arrow, if so, use the 'line' strategy
   

    // Text doesn't resize on drag, so we skip it
    if (tool !== "text" && updateStrategies[tool]) {
      const updatedAttr = updateStrategies[tool](
        { x: newShape.startX, y: newShape.startY }, // Start
        point, // Current
        newShape?.points // Previous Points (for lines)
      );
      setNewShape((prev) => ({ ...prev, ...updatedAttr }));
    }
  };

  // --- 3. MOUSE UP (Finalize Drawing) ---
  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (newShape) {
      setShapes((prev) => [...prev, newShape]);
      setNewShape(null);
    }
  };

  // --- 4. ERASER LOGIC ---
  const handleShapeClick = (shapeId) => {
    if (tool === "eraser") {
      // Remove the clicked shape from the state
      setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    }
  };

  // --- RENDER HELPER ---
  // We use a function instead of a simple object map so we can inject
  // common props (like onClick) to every shape easily.
  const renderShape = (shape) => {
    const key = shape.id
    const commonProps = {
      id: shape.id,
      // Listen for clicks to handle Erasing
      onClick: () => handleShapeClick(shape.id),
      onTap: () => handleShapeClick(shape.id),
      // Only allow dragging if the Select tool is active
      draggable: tool === "select",
       
    };

    switch (shape.tool) {
      case "rect":
        return <RectComponent {...shape} {...commonProps} key={key}/>;
      case "ellipse":
        return <EllipseComponent {...shape} {...commonProps} key={key}/>;
      case "line":
        return <LineComponent {...shape} {...commonProps} key={key}/>;
      case "arrow":
       return <ArrowComponent commonProps={commonProps} shape={shape} key={key}/>;
      case "text":
        return <TextComponent commonProps={commonProps} shape={shape} key={key}/>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="bg-transparent" 
        ref={stageRef}
      >
        <Layer>
          {shapes.map((shape) => renderShape(shape))}
          {newShape && renderShape(newShape)}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;

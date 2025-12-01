import React, { useState, useRef,useEffect } from "react";
import { Stage, Layer, Arrow, Text } from "react-konva"; // Import Arrow and Text
import { v4 as uuidv4 } from "uuid";
import socket from "../utils/socket.js"


// Shape Components
import RectComponent from "../shapes/RectComponent";
import EllipseComponent from "../shapes/EllipseComponent";
import LineComponent from "../shapes/LineComponent";
import { updateStrategies } from "../utils/shapeLogic.js";
import TextComponent from "../shapes/TextComponent.jsx";
import ArrowComponent from "../shapes/ArrowComponent.jsx";


const Whiteboard = ({
  tool,
  shapes,
  setShapes,
  currentColor,
  currentWidth,
  isGuest,
  boardId,
}) => {
  const [newShape, setNewShape] = useState(null);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const [editingText, setEditingText] = useState(null);
  const textareaRef = useRef(null);
  // --- 1. MOUSE DOWN (Start Drawing) ---
  const handleMouseDown = (e) => {
    // If we are in "Select" or "Eraser" mode, do not start drawing a new shape
    if (editingText) return;
    if (tool === "select" || tool === "eraser") return;

    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) return;

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
        fill: currentColor,
        // Text uses 'fill' for color, not 'stroke'
      }));
    } else if (tool === "line") {
      setNewShape(prev=>({
        ...prev,
        fill: currentColor, // Arrow head color
      }));
    } else if(tool==="straightLine" || tool==="arrow"){
      setNewShape(prev=>({
        ...prev,
        points: [pos.x, pos.y,pos.x,pos.y],
        fill: currentColor,
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
      // A. Update My Screen
      setShapes((prev) => [...prev, newShape]);

      // B. Update Everyone Else's Screen
      // Only emit if I am logged in and on a real board
      if (!isGuest && boardId) {
          socket.emit("draw_stroke", {
              boardId: boardId,
              shape: newShape
          });
      }

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

  const handleTextDblClick = (e, shapeId, currentText) => {
    const textNode = e.target;
    // Get absolute position relative to the window
    const stageBox = textNode.getStage().container().getBoundingClientRect();
    const textPosition = textNode.getAbsolutePosition();
    
    // Calculate position for the textarea
    const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
    };

    setEditingText({
      id: shapeId,
      text: currentText,
      x: areaPosition.x,
      y: areaPosition.y,
      color: textNode.fill(),
      fontSize: textNode.fontSize(),
      width: textNode.width(),
      height: textNode.height()
    });
  };

  // B. Save Edit
  const handleTextEditComplete = (e) => {
    // Update the specific shape in the array
    setShapes(shapes.map(shape => {
        if (shape.id === editingText.id) {
            return { ...shape, text: editingText.text };
        }
        return shape;
    }));
    setEditingText(null);
  };

  useEffect(() => {
    if (editingText && textareaRef.current) {
        textareaRef.current.focus();
    }
  }, [editingText]);

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
        return <TextComponent commonProps={commonProps} shape={shape} key={key} handleTextDblClick={handleTextDblClick} editingText={editingText}/>;
      case "straightLine":
        return <LineComponent {...shape} {...commonProps} key={key}/>;
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
      {editingText && (
        <textarea
            ref={textareaRef}
            value={editingText.text}
            onChange={(e) => setEditingText({...editingText, text: e.target.value})}
            onBlur={handleTextEditComplete}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    handleTextEditComplete();
                }
            }}
            style={{
                position: 'fixed', // Use fixed to match window coordinates
                top: editingText.y,
                left: editingText.x,
                fontSize: `${editingText.fontSize}px`,
                lineHeight: `${editingText.fontSize}px`,
                color: editingText.color,
                border: 'none',
                padding: '0px',
                margin: '0px',
                background: 'transparent',
                outline: '1px dashed #3b82f6', // Helper outline
                resize: 'none',
                overflow: 'hidden',
                whiteSpace: 'pre', // Keep formatting
                minWidth: '100px', // Fallback width
                zIndex: 9999, // Ensure it's on top
            }}
        />
      )}
    </div>
  );
};

export default Whiteboard;

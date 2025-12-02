import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Arrow, Text } from "react-konva"; // Import Arrow and Text
import { v4 as uuidv4 } from "uuid";
import socket from "../utils/socket.js";

// Shape Components
import RectComponent from "../shapes/RectComponent";
import EllipseComponent from "../shapes/EllipseComponent";
import LineComponent from "../shapes/LineComponent";
import { updateStrategies } from "../utils/shapeLogic.js";
import TextComponent from "../shapes/TextComponent.jsx";
import ArrowComponent from "../shapes/ArrowComponent.jsx";
import { throttle } from "../utils/throttle.js";
import UserCursor from "./UserCursor.jsx";

const Whiteboard = ({
  tool,
  shapes,
  setShapes,
  currentColor,
  currentWidth,
  isGuest,
  boardId,
  liveShapes,
  user,
}) => {
  const [newShape, setNewShape] = useState(null);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const [cursors, setCursors] = useState({});

  const [editingText, setEditingText] = useState(null);
  const textareaRef = useRef(null);

  const emitLiveUpdate = useRef(
    throttle((data) => {
      socket.emit("drawing_move", data);
    }, 50)
  ).current;

  const emitCursorMove = useRef(
    throttle((data) => {
      socket.emit("cursor_move", data);
    }, 50)
  ).current;

  useEffect(() => {
    if (!isGuest && boardId) {
      socket.on("cursor_move", (data) => {
        setCursors((prev) => ({
          ...prev,
          [data.userId]: data, // Update position for this specific user
        }));
      });
    }
    return () => {
      socket.off("cursor_move");
    };
  }, [isGuest, boardId]);

  const handleMouseDown = (e) => {
    if (editingText) return;
    if (tool === "select" || tool === "eraser") return;

    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const id = uuidv4();

    setNewShape({
      id,
      tool,
      x: pos.x,
      y: pos.y,
      stroke: currentColor,
      strokeWidth: currentWidth,
      startX: pos.x,
      startY: pos.y,
    });

    if (tool === "text") {
      setNewShape((prev) => ({
        ...prev,
        text: "Double click to edit",
        fontSize: 20,
        fill: currentColor,
      }));
    } else if (tool === "line") {
      setNewShape((prev) => ({
        ...prev,
        fill: currentColor,
      }));
    } else if (tool === "straightLine" || tool === "arrow") {
      setNewShape((prev) => ({
        ...prev,
        points: [pos.x, pos.y, pos.x, pos.y],
        fill: currentColor,
      }));
    }
    console.log(newShape);
  };

  // --- 2. MOUSE MOVE (Preview Drawing) ---
  const handleMouseMove = (e) => {
    if (!isDrawing.current || !newShape) return;
    console.log(newShape);

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool !== "text" && updateStrategies[tool]) {
      const updatedAttr = updateStrategies[tool](
        { x: newShape.startX, y: newShape.startY },
        point,
        newShape?.points
      );
      setNewShape((prev) => ({ ...prev, ...updatedAttr }));
      const shapeToSend = { ...newShape, ...updatedAttr };
      if (!isGuest && boardId) {
        emitLiveUpdate({
          boardId,
          shape: shapeToSend,
        });
      }

      if (!isGuest && boardId && user) {
        emitCursorMove({
          boardId,
          userId: user._id, // Or user.id
          username: user.username,
          x: point.x,
          y: point.y,
        });
      }
    }
  };

  // --- 3. MOUSE UP (Finalize Drawing) ---
  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (newShape) {
      setShapes((prev) => [...prev, newShape]);

      if (!isGuest && boardId) {
        socket.emit("draw_stroke", {
          boardId: boardId,
          shape: newShape,
        });
      }

      setNewShape(null);
    }
  };

  // --- 4. ERASER LOGIC ---
  const handleShapeClick = (shapeId) => {
    if (tool === "eraser") {
      setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    }
  };

  const handleTextDblClick = (e, shapeId, currentText) => {
    const textNode = e.target;
    const stageBox = textNode.getStage().container().getBoundingClientRect();
    const textPosition = textNode.getAbsolutePosition();

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
      height: textNode.height(),
    });
  };

  const handleTextEditComplete = (e) => {
    setShapes(
      shapes.map((shape) => {
        if (shape.id === editingText.id) {
          return { ...shape, text: editingText.text };
        }
        return shape;
      })
    );
    setEditingText(null);
  };

  useEffect(() => {
    if (editingText && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingText]);

  // --- RENDER HELPER ---
  // We use a function instead of a simple object map so we can inject
  const renderShape = (shape) => {
    const key = shape.id;
    const commonProps = {
      id: shape.id,
      onClick: () => handleShapeClick(shape.id),
      onTap: () => handleShapeClick(shape.id),
      draggable: tool === "select",
    };

    switch (shape.tool) {
      case "rect":
        return <RectComponent {...shape} {...commonProps} key={key} />;
      case "ellipse":
        return <EllipseComponent {...shape} {...commonProps} key={key} />;
      case "line":
        return <LineComponent {...shape} {...commonProps} key={key} />;
      case "arrow":
        return (
          <ArrowComponent commonProps={commonProps} shape={shape} key={key} />
        );
      case "text":
        return (
          <TextComponent
            commonProps={commonProps}
            shape={shape}
            key={key}
            handleTextDblClick={handleTextDblClick}
            editingText={editingText}
          />
        );
      case "straightLine":
        return <LineComponent {...shape} {...commonProps} key={key} />;
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
          {Object.values(liveShapes).map((shape) => renderShape(shape))}
          {newShape && renderShape(newShape)}
          {Object.values(cursors).map((cursor) => (
             <UserCursor key={cursor.userId} cursor={cursor} />
          ))}
        </Layer>
      </Stage>
      {editingText && (
        <textarea
          ref={textareaRef}
          value={editingText.text}
          onChange={(e) =>
            setEditingText({ ...editingText, text: e.target.value })
          }
          onBlur={handleTextEditComplete}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleTextEditComplete();
            }
          }}
          style={{
            position: "fixed", // Use fixed to match window coordinates
            top: editingText.y,
            left: editingText.x,
            fontSize: `${editingText.fontSize}px`,
            lineHeight: `${editingText.fontSize}px`,
            color: editingText.color,
            border: "none",
            padding: "0px",
            margin: "0px",
            background: "transparent",
            outline: "1px dashed #3b82f6", // Helper outline
            resize: "none",
            overflow: "hidden",
            whiteSpace: "pre", // Keep formatting
            minWidth: "100px", // Fallback width
            zIndex: 9999, // Ensure it's on top
          }}
        />
      )}
    </div>
  );
};

export default Whiteboard;

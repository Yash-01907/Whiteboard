import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';

const Whiteboard = () => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div>
      {/* Simple Toolbar */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setTool('pen')}>Pen</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
      </div>

      {/* The Canvas Area */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown} // Logic for mobile
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ border: '2px solid #333', backgroundColor: '#f0f0f0' }}
      >
        <Layer>
          <Text text="Click and drag to draw" x={10} y={10} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;
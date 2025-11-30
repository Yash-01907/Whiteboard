import React from "react";
import { Palette, Layers, MinusCircle } from "lucide-react";

const COLORS = [
  "#000000",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
];
const BACKGROUNDS = [
  "#ffffff",
  "#f9fafb",
  "#f3f4f6",
  "#fff1f2",
  "#ecfdf5",
  "#eff6ff",
];

const PropertiesPanel = ({
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  canvasColor,
  setCanvasColor,
  activeTool,
}) => {
  // Hide panel if Eraser or Select is active
  if (activeTool === "select" || activeTool === "eraser") return null;

  return (
    <div className="flex flex-col gap-5 p-5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl w-64">
      {/* 1. Stroke Color */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
          <Palette size={12} /> Stroke Color
        </div>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setStrokeColor(color)}
              className={`w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110 ${
                strokeColor === color
                  ? "ring-2 ring-offset-1 ring-blue-500 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          {/* Native Picker */}
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:scale-110 transition-transform">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="absolute -top-2 -left-2 w-10 h-10 p-0 border-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Stroke Width */}
      <div>
        <div className="flex items-center justify-between mb-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <MinusCircle size={12} /> Width
          </span>
          <span className="text-gray-600">{strokeWidth}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
        />
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 3. Canvas Background */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
          <Layers size={12} /> Canvas Color
        </div>
        <div className="flex flex-wrap gap-2">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg}
              onClick={() => setCanvasColor(bg)}
              className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 ${
                canvasColor === bg
                  ? "ring-2 ring-offset-1 ring-gray-400 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: bg }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;

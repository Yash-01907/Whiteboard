import React from "react";
import { 
  Square, 
  Circle, 
  Minus, 
  ArrowRight, 
  Type, 
  Eraser, 
  MousePointer2 
} from "lucide-react";

export const Toolbar = ({ activeTool, onToolChange }) => {
  
  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "ellipse", icon: Circle, label: "Ellipse" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" }, // NEW
    { id: "text", icon: Type, label: "Text" },         // NEW
    { id: "eraser", icon: Eraser, label: "Eraser" },   // NEW
  ];

  return (
    <div className="flex flex-col gap-2 p-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => onToolChange(t.id)}
          className={`p-3 rounded-lg transition-all duration-200 group relative
            ${activeTool === t.id 
              ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          title={t.label}
        >
          <t.icon size={20} />
          {/* Tooltip */}
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
};
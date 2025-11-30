import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Toolbar } from "../components/Toolbar";
import Whiteboard from "../components/Whiteboard";
import { getBoardById, saveBoard } from "../api/whiteboard";
import PropertiesPanel from "../components/PropertiesPanel";
// import _ from "lodash"; // Optional: for debounce (npm i lodash)

const WhiteBoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isGuest = !id || id === "demo";

  // LIFTED STATE: The Page owns the data, not the component
  const [shapes, setShapes] = useState([]);
  const [tool, setTool] = useState("rect");
  const [loading, setLoading] = useState(true);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [canvasColor, setCanvasColor] = useState("#ffffff");

  // 1. Load Board Data on Mount
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        if (isGuest) {
          const localData = localStorage.getItem("guest_whiteboard");
          if (localData) {
            setShapes(JSON.parse(localData));
          }
        } else {
          const response = await getBoardById(id);
          setShapes(response.whiteboard.elements); // Load shapes from DB
        }
      } catch (error) {
        console.error("Failed to load board", error.toJSON());
        alert("Could not load board. You might not have permission.");
        // navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [id, isGuest, navigate]);

  // 2. Save Function
  const handleSave = async () => {
    if (isGuest) {
      localStorage.setItem("guest_whiteboard", JSON.stringify(shapes));
    } else {
      try {
        await saveBoard(id, shapes);
      } catch (error) {
        console.error("Save failed", error);
      }
    }
    console.log("Saved successfully");
  };

  // Optional: Auto-save every 5 seconds if changed
  // (You can implement a proper debounce later)

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Canvas...
      </div>
    );

  return (
    <div
      className="relative w-screen h-screen overflow-hidden transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: canvasColor }}
    >
      {/* HEADER */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {/* Show a clear indicator for Guests */}
        {isGuest && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded border border-yellow-300">
            Guest Mode (Local Only)
          </span>
        )}

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          {isGuest ? "Save Locally" : "Save Board"}
        </button>

        <button
          onClick={() => navigate(isGuest ? "/login" : "/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
        >
          Exit
        </button>
      </div>

      {/* Toolbar & Whiteboard stay exactly the same */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
        <Toolbar activeTool={tool} onToolChange={setTool} />
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
        <PropertiesPanel
          strokeColor={strokeColor}
          setStrokeColor={setStrokeColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          canvasColor={canvasColor}
          setCanvasColor={setCanvasColor}
          activeTool={tool}
        />
      </div>
      <Whiteboard
        tool={tool}
        shapes={shapes}
        setShapes={setShapes}
        currentColor={strokeColor}
        currentWidth={strokeWidth}
      />
    </div>
  );
};

export default WhiteBoardPage;

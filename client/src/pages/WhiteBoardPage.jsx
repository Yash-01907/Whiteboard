import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Toolbar } from "../components/Toolbar";
import Whiteboard from "../components/Whiteboard"; // Your Konva Wrapper
import { getBoardById, saveBoard } from "../api/whiteboard"; // The API functions
// import _ from "lodash"; // Optional: for debounce (npm i lodash)

const WhiteBoardPage = () => {
  const { id } = useParams(); // Get "65a..." from URL
  const navigate = useNavigate();

  // LIFTED STATE: The Page owns the data, not the component
  const [shapes, setShapes] = useState([]); 
  const [tool, setTool] = useState("rect");
  const [loading, setLoading] = useState(true);

  // 1. Load Board Data on Mount
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await getBoardById(id);
        setShapes(response.whiteboard.elements); // Load shapes from DB
      } catch (error) {
        console.error("Failed to load board", error);
        alert("Could not load board. You might not have permission.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [id, navigate]);

  // 2. Save Function
  const handleSave = async () => {
      try {
          await saveBoard(id, shapes);
          console.log("Saved successfully");
      } catch (error) {
          console.error("Save failed", error);
      }
  };

  // Optional: Auto-save every 5 seconds if changed
  // (You can implement a proper debounce later)

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Canvas...</div>;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
      
      {/* HEADER / SAVE BUTTON */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Save Board
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
          >
            Exit
          </button>
      </div>

      {/* TOOLBAR */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Toolbar 
           activeTool={tool} 
           onToolChange={setTool} 
        />
      </div>

      {/* THE CANVAS */}
      {/* We pass shapes and setShapes DOWN to the component */}
      <Whiteboard 
          tool={tool} 
          shapes={shapes}       // <--- Data from DB
          setShapes={setShapes} // <--- Function to update state
      />
      
    </div>
  );
};

export default WhiteBoardPage;
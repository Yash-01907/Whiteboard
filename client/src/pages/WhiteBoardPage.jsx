import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Toolbar } from "../components/Toolbar";
import Whiteboard from "../components/Whiteboard";
import { getBoardById, saveBoard } from "../api/whiteboard";
import PropertiesPanel from "../components/PropertiesPanel";
import socket from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import { Download } from "lucide-react";
import Konva from "konva";

const WhiteBoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isGuest = !id || id === "demo";
  const { user } = useAuth();

  const [shapes, setShapes] = useState([]);
  const [tool, setTool] = useState("rect");
  const [loading, setLoading] = useState(true);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [liveShapes, setLiveShapes] = useState({});
  const stageRef=useRef(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [id, isGuest, navigate]);

  useEffect(() => {
    if (!isGuest && id) {
      socket.connect();
      socket.emit("join_room", id); // Tell server "I am on Board 123"
      console.log("Joined Room:", id);

      socket.on("receive_stroke", (finalShape) => {
        setShapes((prev) => [...prev, finalShape]);
        
        setLiveShapes((prev) => {
            const newLive = { ...prev };
            delete newLive[finalShape.id];
            return newLive;
        });
      });

      socket.on("drawing_move", (tempShape) => {
        setLiveShapes((prev) => ({
            ...prev,
            [tempShape.id]: tempShape 
        }));
      });
    }

    return () => {
      if (socket.connected) {
        socket.off("receive_stroke"); 
        socket.off("drawing_move"); 
        socket.disconnect();
      }
    };
  }, [id, isGuest]);


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

const handleDownload = () => {
    if (!stageRef.current) return;
    
    const stage = stageRef.current;
    
    const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        fill: canvasColor,
        listening: false,
    });

    const layer = stage.getLayers()[0];
    layer.add(background);
    background.moveToBottom(); 

    layer.draw();

    const uri = stage.toDataURL({
      mimeType: "image/png",
      quality: 1,
      pixelRatio: 2, 
    });

    background.destroy();
    layer.draw(); 

    const link = document.createElement("a");
    link.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="absolute top-4 right-4 z-20 flex gap-2">
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
            onClick={handleDownload}
            className="bg-white text-gray-700 p-2 rounded shadow hover:bg-gray-50 border border-gray-200"
            title="Download as Image"
          >
            <Download size={20} />
          </button>

        <button
          onClick={() => navigate(isGuest ? "/login" : "/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
        >
          Exit
        </button>
      </div>

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
      ref={stageRef}
        tool={tool}
        shapes={shapes}
        setShapes={setShapes}
        currentColor={strokeColor}
        currentWidth={strokeWidth}
        isGuest={isGuest}
        boardId={id}
        liveShapes={liveShapes}
        user={user}
      />
    </div>
  );
};

export default WhiteBoardPage;

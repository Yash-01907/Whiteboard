import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Toolbar } from "../components/Toolbar";
import Whiteboard from "../components/Whiteboard";
import { getBoardById, saveBoard, updateBoard } from "../api/whiteboard";
import PropertiesPanel from "../components/PropertiesPanel";
import socket from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import { Download, Share2, ArrowLeft, Save, Redo2, Undo2 } from "lucide-react";
import Konva from "konva";
import ShareModal from "../components/ShareModal";
import useHistory from "../utils/useHistory";

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
  const [boardData, setBoardData] = useState({
    title: "Untitled",
    owner: null,
    collaborators: [],
  });
  const [isShareOpen, setIsShareOpen] = useState(false);
  const stageRef = useRef(null);

  const {
    history,
    step,
    canUndo,
    canRedo,
    currentHistoryState,
    addToHistory,
    undo,
    redo,
  } = useHistory(shapes);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        if (isGuest) {
          const localData = localStorage.getItem("guest_whiteboard");
          if (localData) {
            setShapes(JSON.parse(localData));
            setBoardData({
              title: "Guest Session",
              owner: "guest",
              collaborators: [],
            });
          }
        } else {
          const response = await getBoardById(id);
          setShapes(response.whiteboard.elements);
          addToHistory(response.whiteboard.elements);
          setBoardData(response.whiteboard);
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

  const handleUndo = () => {
    const previousShapes = undo();
    if (previousShapes) {
      setShapes(previousShapes);
      //Add socket option
    }
  };

  const handleRedo = () => {
    const nextShapes = redo();
    if (nextShapes) {
      setShapes(nextShapes);
      //Add socket option
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        handleUndo();
      }
      if (e.key === "y" && (e.metaKey || e.ctrlKey)) {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    if (newTitle === boardData.title) return;

    setBoardData((prev) => ({ ...prev, title: newTitle }));

    if (!isGuest) {
      try {
        await updateBoard(id, { title: newTitle });
      } catch (err) {
        console.error("Rename failed");
      }
    }
  };

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
          [tempShape.id]: tempShape,
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

 // In WhiteBoardPage.jsx
const onShapeAdd = (update) => {
    // Check if it's a function (standard React state update)
    if (typeof update === "function") {
        setShapes((prev) => {
            const newState = update(prev);
            addToHistory(newState); // Snapshot the result
            return newState;
        });
    } else {
        // It's a direct array
        setShapes(update);
        addToHistory(update);
    }
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
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-sm p-2 rounded-xl pointer-events-auto border border-gray-200">
          <button
            onClick={() => navigate(isGuest ? "/login" : "/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          
          {/* Editable Title Input */}
          <div className="h-8 border-l border-gray-200 pl-3 flex items-center">
            <input
              type="text"
              className="bg-transparent font-bold text-gray-800 focus:outline-none focus:bg-gray-50 px-1 rounded truncate w-32 sm:w-64"
              defaultValue={boardData.title}
              onBlur={handleTitleChange} // Save when clicking away
              disabled={isGuest} // Guests can't rename
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2 pointer-events-auto">
          {/* Share Button (Only for Users) */}
          {!isGuest && (
            <button
              onClick={() => setIsShareOpen(true)}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 flex items-center gap-2 font-medium"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            <Save size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleDownload}
            className="bg-white text-gray-700 p-2 rounded-lg shadow hover:bg-gray-50 border border-gray-200"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* --- MODALS --- */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        boardId={id}
        collaborators={boardData.collaborators || []}
        ownerId={
          typeof boardData.owner === "object"
            ? boardData.owner?._id
            : boardData.owner
        }
        currentUserId={user?._id}
        onUpdate={(updatedBoard) => setBoardData(updatedBoard)}
      />
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
        setShapes={onShapeAdd}
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

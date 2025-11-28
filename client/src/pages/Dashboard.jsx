import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createBoard, getMyBoards } from "../api/whiteboard";
import { useAuth } from "../context/AuthContext"; // Assuming you have this

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getMyBoards();
        setBoards(data.whiteboards);
      } catch (error) {
        console.error("Failed to load boards", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  // 2. Handle Create New
  const handleCreate = async () => {
    try {
      const data = await createBoard("Untitled Board");
      // Redirect to the new board immediately
      navigate(`/board/${data.whiteboard._id}`);
    } catch (error) {
      console.error("Failed to create board", error);
    }
  };

  if (loading) return <div>Loading your workspace...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Whiteboards</h1>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Board
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div 
            key={board._id} 
            onClick={() => navigate(`/board/${board._id}`)}
            className="border rounded-lg p-6 cursor-pointer hover:shadow-lg transition bg-white"
          >
            <h3 className="font-semibold text-lg">{board.title}</h3>
            <p className="text-gray-500 text-sm mt-2">
              {board.owner === user?._id ? "Owner" : "Collaborator"}
            </p>
            <p className="text-gray-400 text-xs mt-4">
              Last updated: {new Date(board.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      
      {boards.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No boards found. Create one to get started!</p>
      )}
    </div>
  );
};

export default Dashboard;
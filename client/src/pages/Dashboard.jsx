import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { createBoard, getMyBoards } from "../api/whiteboard";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getMyBoards();
        setBoards(data.whiteboards);
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  // 2. Handle "Create New Board"
  const handleCreateNew = async () => {
    try {
      // Create board on backend
      const response = await createBoard("Untitled Board");

      // Redirect to the new dynamic route
      navigate(`/board/${response.whiteboard._id}`);
    } catch (error) {
      alert("Failed to create board");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading your workspace...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.username} 👋
        </h1>
        <button
          onClick={handleCreateNew}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
        >
          + Create New Board
        </button>

        <button onClick={logout} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium">
          Logout
        </button>
      </div>
      {/* Grid of Boards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Empty State */}
        {boards.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">
              You haven't created any whiteboards yet.
            </p>
            <button
              onClick={handleCreateNew}
              className="text-blue-600 font-medium hover:underline"
            >
              Start your first project
            </button>
          </div>
        )}

        {/* Board Cards */}
        {boards.map((board) => (
          <div
            key={board._id}
            onClick={() => navigate(`/board/${board._id}`)}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group"
          >
            <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-300">
              {/* Placeholder for thumbnail later */}
              <span>Preview</span>
            </div>

            <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition">
              {board.title}
            </h3>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>
                {board.owner === user?._id ? "Owner" : "Collaborator"}
              </span>
              <span>{new Date(board.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

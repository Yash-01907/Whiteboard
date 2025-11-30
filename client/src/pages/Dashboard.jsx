import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { createBoard, getMyBoards } from "../api/whiteboard";
import {
  Plus,
  LogOut,
  Search,
  MoreVertical,
  Layout,
  Loader2,
} from "lucide-react";

// Helper to generate initials from username
const getInitials = (name) => {
  return name ? name.substring(0, 2).toUpperCase() : "U";
};

// Helper for consistent date formatting
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredBoards =
    boards?.filter((b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleCreateNew = async () => {
    try {
      const response = await createBoard("Untitled Board");
      navigate(`/board/${response.whiteboard._id}`);
    } catch (error) {
      alert("Failed to create board");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium text-sm">
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900">
      {/* --- Navbar --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Brand & User */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
              W
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-none">
                Whiteboard.io
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {user?.username}'s Workspace
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center bg-gray-100/80 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 rounded-lg px-3 py-2 transition-all border border-transparent focus-within:border-blue-500 w-64">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {/* Profile & Logout */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                {getInitials(user?.username)}
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Recent Boards
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Pick up where you left off or start fresh.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md hover:shadow-blue-200 font-medium text-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Board
          </button>
        </div>

        {/* --- Boards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card (Quick Action) */}
          <div
            onClick={handleCreateNew}
            className="group cursor-pointer flex flex-col items-center justify-center h-60 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
              <Plus className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
            </div>
            <p className="font-medium text-gray-600 group-hover:text-blue-700">
              New Board
            </p>
          </div>

          {/* Board Cards */}
          {filteredBoards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/board/${board._id}`)}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-60 relative"
            >
              {/* Thumbnail Area */}
              <div className="h-32 w-full bg-gray-50 border-b border-gray-100 relative overflow-hidden group-hover:bg-gray-100/80 transition-colors">
                {/* Subtle Pattern */}
                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[16px_16px]"></div>

                {/* Placeholder Icon if no image */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                  <Layout className="w-16 h-16 text-gray-500" />
                </div>

                {/* Role Badge */}
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border shadow-sm ${
                    board.owner === user?._id
                      ? "bg-white text-blue-700 border-blue-100"
                      : "bg-white text-purple-700 border-purple-100"
                  }`}
                >
                  {board.owner === user?._id || board.owner === user?.id
                    ? "Owner"
                    : "Collab"}
                </span>
              </div>

              {/* Card Footer */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                    {board.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Updated {formatDate(board.updatedAt)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex -space-x-2">
                    {/* Fake Avatars for "Collaborators" visual */}
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-600 font-bold">
                      {getInitials(user?.username)}
                    </div>
                  </div>

                  <button className="text-gray-300 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredBoards.length === 0 && boards.length > 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">No boards found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Try searching for a different keyword.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

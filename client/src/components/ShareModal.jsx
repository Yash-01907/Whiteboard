import React, { useState } from "react";
import { X, UserPlus, Trash2, Shield, ShieldAlert } from "lucide-react";
import { updateBoard } from "../api/whiteboard";

const ShareModal = ({ isOpen, onClose, boardId, collaborators, onUpdate, ownerId, currentUserId }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isOwner = currentUserId === ownerId;

  // 1. Add Collaborator
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await updateBoard(boardId, { addCollaboratorEmail: email });
      onUpdate(res.whiteboard); // Update parent state with fresh data
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  // 2. Remove Collaborator
  const handleRemove = async (userId) => {
    if (!confirm("Remove this user?")) return;
    try {
      const res = await updateBoard(boardId, { removeCollaboratorId: userId });
      onUpdate(res.whiteboard);
    } catch (err) {
      alert("Failed to remove user");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg">Share Board</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Add User Form (Only for Owner) */}
          {isOwner && (
            <form onSubmit={handleAdd} className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Add by Email</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="friend@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  {loading ? "..." : "Invite"}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          )}

          {/* Collaborator List */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Who has access</label>
            <div className="space-y-3">
              
              {/* Owner Row */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    OWN
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Owner</p>
                    <p className="text-xs text-gray-500">Board Creator</p>
                  </div>
                </div>
                <Shield className="text-blue-500 w-4 h-4" />
              </div>

              {/* Collaborators List */}
              {collaborators.map((c) => (
                <div key={c.user._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {c.user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.user.username}</p>
                      <p className="text-xs text-gray-500">{c.user.email}</p>
                    </div>
                  </div>
                  
                  {isOwner ? (
                    <button 
                      onClick={() => handleRemove(c.user._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Remove User"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">Editor</span>
                  )}
                </div>
              ))}

              {collaborators.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-2">No collaborators yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
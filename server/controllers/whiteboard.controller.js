import whiteboardModel from "../models/whiteboard.model.js";
import User from "../models/user.model.js"; // <--- DONT FORGET THIS
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createWhiteboard = asyncHandler(async (req, res) => {
  const { title, elements } = req.body;

  const whiteboard = new whiteboardModel({
    title: title || "Untitled Board",
    owner: req.user._id,
    elements: elements || [],
  });
  await whiteboard.save();
  res.status(201).json({
    success: true,
    message: "Whiteboard created successfully",
    whiteboard,
  });
});

const deleteWhiteboard = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid whiteboard id" });
  }

  const userId = req.user._id;
  const whiteboard = await whiteboardModel.findById(id);

  if (!whiteboard) {
    return res
      .status(404)
      .json({ success: false, message: "Whiteboard not found" });
  }

  const isOwner = whiteboard.owner.toString() === userId.toString(); // Ensure string comparison
  if (!isOwner) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this whiteboard",
    });
  }

  await whiteboardModel.findByIdAndDelete(id);
  res
    .status(200)
    .json({ success: true, message: "Whiteboard deleted successfully" });
});

const getAllWhiteboards = asyncHandler(async (req, res) => {
  const id = req.user._id;

  // OPTIMIZATION: Fetch both Owned AND Collaborated boards in one query
  const whiteboards = await whiteboardModel
    .find({
      $or: [
        { owner: id },
        { "collaborators.user": id }, // Directly checks if 'id' exists in the array
      ],
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    message: "Whiteboards fetched successfully",
    whiteboards,
  });
});

const getWhiteboard = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid whiteboard id" });
  }

  const userId = req.user._id;
  const whiteboard = await whiteboardModel
    .findById(id)
    .populate("owner", "username email")
    .populate("collaborators.user", "username email"); // Good to see who owns it

  if (!whiteboard) {
    return res
      .status(404)
      .json({ success: false, message: "Whiteboard not found" });
  }

  const isOwner = whiteboard.owner._id.toString() === userId.toString();

  // FIX: Use .some() with string comparison for accurate checking
  const isCollaborator = whiteboard.collaborators.some(
    (collaborator) => collaborator.user?._id.toString() === userId.toString()
  );

  if (!isOwner && !isCollaborator) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to view this whiteboard",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Whiteboard fetched successfully",
    whiteboard,
  });
});

const updateWhiteboard = asyncHandler(async (req, res) => {
  const {
    title,
    elements,
    addCollaboratorEmail,
    removeCollaboratorId,
    updateRole,
  } = req.body;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid whiteboard id" });
  }

  const userId = req.user._id;
  const whiteboard = await whiteboardModel.findById(id);

  if (!whiteboard) {
    return res
      .status(404)
      .json({ success: false, message: "Whiteboard not found" });
  }

  const isOwner = whiteboard.owner.toString() === userId.toString();
  const currentUserCollaborator = whiteboard.collaborators.find(
    (c) => c.user.toString() === userId.toString()
  );

  // AUTH LOGIC
  if (!isOwner) {
    if (!currentUserCollaborator) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    // If trying to change admin settings (title/collaborators) -> Block
    if (addCollaboratorEmail || removeCollaboratorId || title || updateRole) {
      return res.status(403).json({
        success: false,
        message: "Only owner can manage collaborators or title",
      });
    }
    if (elements && currentUserCollaborator.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot edit the whiteboard",
      });
    }
    // If not even a collaborator -> Block completely
  }

  // UPDATE LOGIC
  if (title) whiteboard.title = title;
  if (elements) whiteboard.elements = elements;

  if (addCollaboratorEmail) {
    const userToAdd = await User.findOne({ email: addCollaboratorEmail });

    if (!userToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User with that email not found" });
    }

    const alreadyExists = whiteboard.collaborators.some(
      (c) => c.user.toString() === userToAdd._id.toString()
    );

    if (alreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a collaborator" });
    }

    if (userToAdd._id.toString() === whiteboard.owner.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You are already the owner" });
    }

    whiteboard.collaborators.push({ user: userToAdd._id, role: "editor" });
  }

  if (removeCollaboratorId) {
    whiteboard.collaborators = whiteboard.collaborators.filter(
      (collaborator) => collaborator.user.toString() !== removeCollaboratorId
    );
  }

  if (updateRole) {
    const { userId: targetUserId, role } = updateRole;

    // Validate Role
    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'editor' or 'viewer'",
      });
    }

    // Find the collaborator in the array
    const collaboratorIndex = whiteboard.collaborators.findIndex(
      (c) => c.user.toString() === targetUserId
    );

    if (collaboratorIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Collaborator not found" });
    }

    // Update the role
    whiteboard.collaborators[collaboratorIndex].role = role;
  }

  const updatedWhiteboard = await whiteboard.save();
  await updatedWhiteboard.populate("collaborators.user", "username email");

  return res.status(200).json({
    success: true,
    message: "Whiteboard updated successfully",
    whiteboard: updatedWhiteboard,
  });
});

export {
  createWhiteboard,
  deleteWhiteboard,
  getAllWhiteboards,
  getWhiteboard,
  updateWhiteboard,
};

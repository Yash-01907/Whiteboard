import { Schema, model } from "mongoose";

const whiteboardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Board",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The "Black Box" for shapes
    elements: [
      {
        type: Schema.Types.Mixed,
        required: true,
      },
    ],
    // NEW: Who else can edit this?
    // ADVANCED OPTION (Only use if you need roles)
    collaborators: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["editor", "viewer"], default: "editor" },
      },
    ],
  },
  { timestamps: true }
);

const Whiteboard = model("Whiteboard", whiteboardSchema);
export default Whiteboard;

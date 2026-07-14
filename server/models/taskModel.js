const { string } = require("joi");
const mongoose = require("mongoose");

const taskCommentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      ref: "AdminUsers",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const taskSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  taskNumber: { type: String, required: true },
  author: {
    type: String,
    ref: "AdminUsers",
    required: true,
  },
  recipients: {
    type: [
      {
        type: String,
        ref: "AdminUsers",
      },
    ],
    required: true,
    validate: {
      validator: (recipients) => recipients.length > 0,
      message: "At least one recipient is required.",
    },
  },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  priority: {
    type: String,
    required: true,
    enum: ["Haute", "Moyenne", "Basse"],
  },
  deadline: { type: Date, required: true },
  isResolved: { type: Number, default: 0, required: true },
  resolutionNotes: { type: String, trim: true },
  resolvedAt: { type: Date },
  resolvedBy: { type: String },
  comments: {
    type: [taskCommentSchema],
    default: [],
  },
  submittedAt: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  isDeleted: { type: Number, default: 0, required: true },
});

const Task = mongoose.model("Tasks", taskSchema);
module.exports = Task;

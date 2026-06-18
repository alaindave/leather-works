const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUsers",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUsers",
    required: true,
  },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

const Task = mongoose.model("Tasks", taskSchema);
module.exports = Task;

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUsers",
    required: true,
  },
  recipients: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdminUsers",
      },
    ],
    required: true,
    validate: {
      validator: (recipients) => recipients.length > 0,
      message: "At least one recipient is required.",
    },
  },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: {
    type: String,
    required: true,
    enum: ["Haute", "Moyenne", "Basse"],
  },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  isDeleted: { type: Number, default: 0, required: true },
});

const Task = mongoose.model("Tasks", taskSchema);
module.exports = Task;

const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  // title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

const Announcement = mongoose.model("Announcements", announcementSchema);
module.exports = Announcement;

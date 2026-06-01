const express = require("express");
const mongoose = require("mongoose");
const authorize = require("../middleware/authorize.js");
const verifyRole = require("../middleware/verifyRole.js");
const router = express.Router();
const { saveAnnouncement, getAnnouncements } = require("../db");

//Announcements by the manager
router.post("/", authorize, verifyRole("manager"), async (req, res) => {
  try {
    const io = req.app.get("io");
    const announcement = {
      message: req.body.message,
      createdAt: new Date(),
    };
    const savedAnnouncement = await saveAnnouncement(announcement);
    console.log("Saved announcement: ", savedAnnouncement);
    io.emit("new-announcement", savedAnnouncement);
    res.status(201).send(savedAnnouncement);
  } catch (error) {
    console.error("Backend error while creating announcement: ", error);
    return res.status(500).send(error);
  }
});
//Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await getAnnouncements();
    console.log("Fetched announcements: ", announcements);
    res.status(200).send(announcements);
  } catch (error) {
    console.error("An error occured while fetching announcements: ", error);
  }
});

module.exports = router;

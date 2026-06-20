const express = require("express");
const mongoose = require("mongoose");
const authorize = require("../middleware/authorize.js");
const verifyRole = require("../middleware/verifyRole.js");
const router = express.Router();
const { saveTask, getTasks } = require("../db.js");

//Tasks by the manager
router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io");
    const task = {
      author: req.body.author,
      recipients: req.body.recipients,
      message: req.body.message,
      createdAt: new Date(),
    };
    const savedTask = await saveTask(task);
    console.log("SavedTask: ", savedTask);
    io.emit("new-task", savedTask);
    res.status(201).send(savedTask);
  } catch (error) {
    console.error("Backend error while creating task: ", error);
    return res.status(500).send(error);
  }
});
//Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await getTasks();
    console.log("Fetched tasks: ", tasks);
    res.status(200).send(tasks);
  } catch (error) {
    console.error("An error occured while fetching tasks: ", error);
  }
});

module.exports = router;

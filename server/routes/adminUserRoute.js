const express = require("express");
const { validate } = require("../models/adminUserModel.js");
const mongoose = require("mongoose");
const router = express.Router();
const {
  createAdminUser,
  updateAdminUser,
  getAdminUserByID,
  getAllAdmins,
  getAdminUserByEmail,
} = require("../db");
const _ = require("lodash");
const bcrypt = require("bcrypt");

//Create new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }
  let adminUser = await getAdminUserByEmail(req.body.email);
  if (adminUser) {
    console.log("This user is already registered", adminUser);
    return res.status(400).send("Admin user already registered");
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  adminUser = await createAdminUser(
    _.pick(req.body, ["firstName", "lastName", "email", "password"])
  );
  console.log("Registered admin user:", adminUser);
  const token = adminUser.generateAuthToken();

  res
    .set("Access-Control-Expose-Headers", "X-auth-token")
    .header("x-auth-token", token)
    .send(_.pick(adminUser, ["_id", "firstName", "lastName", "email"]));
});

//Fetch all admins
router.get("/", async (req, res) => {
  try {
    const admins = await getAllAdmins();
    if (!admins) {
      return res.status(404).send("No admins found.");
    }
    console.log("Fetched admins: ", admins);
    res.status(200).send(admins);
  } catch (error) {
    console.error("An error occured while fetching admin users: ", error);
    res.status(500).send(error);
  }
});

//Fetch admin user info
router.get("/:_id", async (req, res) => {
  console.log("ID of admin to fetch: ", req.params._id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send("Invalid admin ID");
    }
    const admin = await getAdminUserByID(req.params._id);
    if (!admin) {
      console.log("No admin found with the given ID.");
      return res.status(404).send("No admin found with the given ID.");
    }
    console.log("Fetched admin: ", admin);
    res.status(200).send({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      notes: admin.notes,
    });
  } catch (error) {
    console.error("An error occured while fetching admin user: ", error);
    res.status(500).send(error);
  }
});

//Edit admin user
router.put("/:_id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send("Invalid admin ID");
    }
    const admin = await getAdminUserByID(req.params._id);
    if (!admin) res.status(404).send("No admin found with the given ID.");
    console.log("Admin to update: ", admin);
    console.log("Info to modify: ", req.body);

    const updatedAdmin = await updateAdminUser(req.params._id, req.body);
    res.status(200).send(updatedAdmin);
    console.log("Updated admin: ", updatedAdmin);
  } catch (error) {
    console.error("An error occured while updating admin info: ", error);
    res.status(500).send(error);
  }
});

module.exports = router;

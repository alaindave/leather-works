import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import _ from "lodash";

import { validateAdminUser } from "../models/adminUserModel.js";
import {
  createAdminUser,
  updateAdminUser,
  getAdminUserByID,
  getAllAdmins,
  getAdminUserByEmail,
} from "../db.js";

const router = express.Router();

interface AdminParams {
  _id: string;
}

// Create new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { error } = validateAdminUser(req.body);

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

    return res
      .set("Access-Control-Expose-Headers", "X-auth-token")
      .header("x-auth-token", token)
      .send(_.pick(adminUser, ["_id", "firstName", "lastName", "email"]));
  } catch (error) {
    console.error("Error creating admin user:", error);
    return res.status(500).send(error);
  }
});

// Fetch all admins
router.get("/", async (req: Request, res: Response) => {
  try {
    const admins = await getAllAdmins();

    if (!admins) {
      return res.status(404).send("No admins found.");
    }

    console.log("Fetched admins:", admins);

    return res.status(200).send(admins);
  } catch (error) {
    console.error("An error occurred while fetching admin users:", error);

    return res.status(500).send(error);
  }
});

// Fetch admin user info
router.get("/:_id", async (req: Request<AdminParams>, res: Response) => {
  console.log("ID of admin to fetch:", req.params._id);

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send("Invalid admin ID");
    }

    const admin = await getAdminUserByID(req.params._id);

    if (!admin) {
      console.log("No admin found with the given ID.");
      return res.status(404).send("No admin found with the given ID.");
    }

    console.log("Fetched admin:", admin);

    return res.status(200).send({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      notes: admin.notes,
    });
  } catch (error) {
    console.error("An error occurred while fetching admin user:", error);

    return res.status(500).send(error);
  }
});

// Edit admin user
router.put("/:_id", async (req: Request<AdminParams>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send("Invalid admin ID");
    }

    const admin = await getAdminUserByID(req.params._id);

    if (!admin) {
      return res.status(404).send("No admin found with the given ID.");
    }

    console.log("Admin to update:", admin);
    console.log("Info to modify:", req.body);

    const updatedAdmin = await updateAdminUser(req.params._id, req.body);

    console.log("Updated admin:", updatedAdmin);

    return res.status(200).send(updatedAdmin);
  } catch (error) {
    console.error("An error occurred while updating admin info:", error);

    return res.status(500).send(error);
  }
});

export default router;

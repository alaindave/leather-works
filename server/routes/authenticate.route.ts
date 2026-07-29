import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";

import { getAdminUserByEmail } from "../db.js";

const router = express.Router();

interface LoginRequest {
  email: string;
  password: string;
}

// Authenticate user
router.post("/", async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { error } = validate(req.body);

  if (error) {
    console.error("Validation error:", error);

    return res.status(400).send(error.details[0].message);
  }

  try {
    const adminUser = await getAdminUserByEmail(req.body.email);

    if (!adminUser) {
      return res.status(400).send("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      adminUser.password
    );

    if (!validPassword) {
      return res.status(400).send("Invalid email or password.");
    }

    const token = adminUser.generateAuthToken();

    return res
      .set("Access-Control-Expose-Headers", "X-auth-token")
      .header("x-auth-token", token)
      .send({
        _id: adminUser._id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        role: adminUser.role,
        notes: adminUser.notes,
        createdAt: adminUser.createdAt,
        updatedAt: adminUser.updatedAt,
      });
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).send("Server error");
  }
});

function validate(body: LoginRequest) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),

    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(body);
}

export default router;

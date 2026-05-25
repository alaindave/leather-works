const { getAdminUserByEmail } = require("../db");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

//Authenticate user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    console.error("Validation error: ", error);
    return res.status(400).send(error.details[0].message);
  }
  const adminUser = await getAdminUserByEmail(req.body.email);
  if (!adminUser) return res.status(400).send("Invalid email or password.");
  const validPassword = await bcrypt.compare(
    req.body.password,
    adminUser.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password.");
  const token = adminUser.generateAuthToken();
  res
    .set("Access-Control-Expose-Headers", "X-auth-token")
    .header("x-auth-token", token)
    .send({
      _id: adminUser._id,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      email: adminUser.email,
      role: adminUser.role,
    });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  const validation = schema.validate(req);

  if (validation.error) {
    return validation.error.details[0].message;
  }
  return validation;
}

module.exports = router;

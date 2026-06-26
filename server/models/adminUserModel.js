const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const AdminUserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  firstName: { type: String, required: true, minLength: 2, maxLength: 50 },
  lastName: { type: String, required: true, minLength: 3, maxLength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 1024,
  },

  role: {
    type: String,
    enum: ["manager", "admin"],
    default: "admin",
  },

  notes: {
    type: String,
  },
  isDeleted: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

AdminUserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "1d" }
  );
};

function validateAdminUser(adminUser) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(adminUser);
}

const AdminUser = mongoose.model("AdminUsers", AdminUserSchema);
exports.validate = validateAdminUser;
exports.AdminUser = AdminUser;

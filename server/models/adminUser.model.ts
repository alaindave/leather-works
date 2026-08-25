import mongoose, { Schema, HydratedDocument, Model } from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

export type AdminRole = "MANAGER" | "ADMIN";

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: AdminRole;
  notes?: string;
  serverVersion: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: number;
}

export interface AdminUserMethods {
  generateAuthToken(): string;
}

type AdminUserModel = Model<AdminUser, {}, AdminUserMethods>;

const AdminUserSchema = new Schema<AdminUser, AdminUserModel, AdminUserMethods>(
  {
    _id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    role: {
      type: String,
      enum: ["MANAGER", "ADMIN"],
      default: "ADMIN",
    },
    notes: {
      type: String,
    },
    serverVersion: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Number,
      required: true,
      default: 0,
    },
  }
);

AdminUserSchema.method(
  "generateAuthToken",
  function (this: HydratedDocument<AdminUser, AdminUserMethods>): string {
    return jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      process.env.JWT_PRIVATE_KEY as string,
      {
        expiresIn: "1d",
      }
    );
  }
);

export function validateAdminUser(adminUser: Partial<AdminUser>) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(adminUser);
}

const AdminUser = mongoose.model<AdminUser, AdminUserModel>(
  "AdminUsers",
  AdminUserSchema
);

export default AdminUser;

import { Schema, model } from "mongoose";

export interface EmployeeDocument {
  _id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  idNum: string;
  dateBirth: Date;
  dateHired: Date;
  role: string;
  department: "Administration" | "Atelier" | "Usine" | "Magasin" | "Sentinelle";
  salary: number;
  remainingLeave: number;
  status: "ACTIF" | "INACTIF";
  telephone: string;
  address: string;
  emergencyContact: string;
  relationship: string;
  contactPhone: string;
  photo_filename: string | null;
  photo_path: string | null;
  photo_version: number;
  photo_hash: string | null;
  photo_mime_type: "image/jpeg" | "image/png" | "image/webp" | null;
  photo_last_modified: Date | null;
  serverVersion: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: number;
}

const employeeSchema = new Schema<EmployeeDocument>(
  {
    _id: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    matricule: {
      type: String,
      required: true,
    },

    idNum: {
      type: String,
      required: true,
      default: "BDI/11/222",
    },

    dateBirth: {
      type: Date,
      required: true,
    },

    dateHired: {
      type: Date,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      enum: ["Administration", "Atelier", "Usine", "Magasin", "Sentinelle"],
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    remainingLeave: {
      type: Number,
      default: 20,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIF", "INACTIF"],
      default: "ACTIF",
      required: true,
    },

    telephone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    emergencyContact: {
      type: String,
      required: true,
    },

    relationship: {
      type: String,
      required: true,
    },

    contactPhone: {
      type: String,
      required: true,
    },

    photo_filename: {
      type: String,
      default: null,
    },

    photo_path: {
      type: String,
      default: null,
    },

    photo_version: {
      type: Number,
      default: 0,
      required: true,
    },

    photo_hash: {
      type: String,
      default: null,
    },

    photo_mime_type: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/webp", null],
      default: null,
    },

    photo_last_modified: {
      type: Date,
      default: null,
    },
    serverVersion: {
      type: Number,
      required: true,
      default: 0,
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
      default: 0,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Employee = model<EmployeeDocument>("Employees", employeeSchema);

export default Employee;

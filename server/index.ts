import "dotenv/config";

import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";

import employees from "./routes/employee.route.js";
import attendances from "./routes/attendance.route.js";
import leaves from "./routes/leave.route.js";
import adminUser from "./routes/admin_user.route.js";
import sync from "./routes/sync.route.js";
import auth from "./routes/authenticate.route.js";
import tasks from "./routes/task.route.js";
import employee_photos from "./routes/employees_photos.route.js";
import employee_documents from "./routes/employees_documents.route.js";
import jobsRouter from "./routes/jobs.route.js";

import seedPayrollComponents from "./seeds/payroll-component.seed.js";

import "./jobs/markEmployeeAbsent.cron.js";

const app = express();

const requiredEnvVars = [
  {
    key: "JWT_PRIVATE_KEY",
    name: "JWT Private Key",
  },
  {
    key: "EMAIL_USER",
    name: "Email user",
  },
  {
    key: "EMAIL_PASS",
    name: "Email password",
  },
  {
    key: "MANAGER_EMAIL",
    name: "Manager email",
  },
  {
    key: "MONGO_URI",
    name: "MongoDB URI",
  },
];

for (const item of requiredEnvVars) {
  if (!process.env[item.key]) {
    console.error(`FATAL ERROR: ${item.name} is not defined`);

    process.exit(1);
  }
}

const mongoUri = process.env.MONGO_URI as string;

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("CONNECTED TO AFRITAN DATABASE");

    await seedPayrollComponents();

    console.log("PAYROLL COMPONENTS SEEDED");
  })
  .catch((error) => {
    console.error("AN ERROR OCCURED DURING DATABASE INITIALIZATION:", error);
  });

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("SOCKET CONNECTION... SERVER CONNECTED:", socket.id);

  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTION... CLIENT DISCONNECTED");
  });
});

app.set("io", io);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/employees", employees);
app.use("/documents", employee_documents);
app.use("/photos", employee_photos);
app.use("/attendances", attendances);
app.use("/leaves", leaves);
app.use("/adminUsers", adminUser);
app.use("/tasks", tasks);
app.use("/auth", auth);
app.use("/sync", sync);
app.use("/api/jobs", jobsRouter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}...`);
});

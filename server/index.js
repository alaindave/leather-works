require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const employees = require("./routes/employee.route.js");
const attendances = require("./routes/attendance.route.js");
const leaves = require("./routes/leave.route.js");
const adminUser = require("./routes/admin_user.route.js");
const sync = require("./routes/sync.route.js");
const auth = require("./routes/authenticate.route.js");
const tasks = require("./routes/task.route.js");
const jobsRouter = require("./routes/jobs.route.js");
const app = express();

const requiredEnvVars = [
  { key: "JWT_PRIVATE_KEY", name: "JWT Private Key" },
  { key: "EMAIL_USER", name: "Email user" },
  { key: "EMAIL_PASS", name: "Email password" },
  { key: "MANAGER_EMAIL", name: "Manager email" },
  { key: "MONGO_URI", name: "MongoDB URI" },
];

for (const item of requiredEnvVars) {
  if (!process.env[item.key]) {
    console.error(`FATAL ERROR: ${item.name} is not defined`);
    process.exit(1);
  }
}

//Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("CONNECTED TO AFRITAN DATABASE");
  })
  .catch((error) =>
    console.error("UNABLE TO CONNECT TO AFRITAN DATABASE: ", error)
  );

//Initialize employee absence cron jon
require("./jobs/markEmployeeAbsent.cron.js");

//Create socket.io connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("SOCKET CONNECTION... SERVER CONNECTED:", socket.id);
  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTION...CLIENT DISCONNECTED");
  });
});
app.set("io", io);
app.use(express.json());
app.use(cors());
app.use("/employees", employees);
app.use("/attendances", attendances);
app.use("/leaves", leaves);
app.use("/adminUsers", adminUser);
app.use("/tasks", tasks);
app.use("/auth", auth);
app.use("/sync", sync);
app.use("/api/jobs", jobsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}...`));

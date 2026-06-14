require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const employees = require("./routes/employeeRoute.js");
const attendances = require("./routes/attendanceRoute.js");
const leaves = require("./routes/leaveRoute.js");
const adminUser = require("./routes/adminUserRoute.js");
const auth = require("./routes/authenticate.js");
const tasks = require("./routes/taskRoute.js");

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

const app = express();
//Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Afritan database");
  })
  .catch((error) =>
    console.error("Unable to connect to the database: ", error)
  );

//Create socket.io connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("Socket connection... Server connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnection...Client disconnected");
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

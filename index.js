const express = require("express");
const cors = require("cors");
const employeeRouter = require("./routes/employeeRoute");
const attendanceRouter = require("./routes/attendanceRoute");
const leaveRouter = require("./routes/leaveRoute");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/employees", employeeRouter);
app.use("/employees/attendance", attendanceRouter);
app.use("/employees/leave", leaveRouter);
app.listen(5000, () => console.log("Listening on port 5000..."));

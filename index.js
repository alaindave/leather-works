const express = require("express");
const cors = require("cors");
const employeeRouter = require("./routes/employeeRoute");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/employees", employeeRouter);
app.listen(5000, () => console.log("listening on port 5000..."));

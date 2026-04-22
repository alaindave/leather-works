const mongoose = require("mongoose");
const Employee = require("./models/employeeModel");
const Attendance = require("./models/attendanceModel");
const Leave = require("./models/leaveModel");

//Connect to the database
mongoose
  .connect("mongodb://localhost:27017/Afritan_database")
  .then(() => console.log("Connected to Afritan database"))
  .catch((e) => console.log("Unable to connect to the database", e.message));

//Add an employee
const addEmployee = async ({
  firstName,
  lastName,
  employeeID,
  dateBirth,
  role,
  department,
  salary,
  dateHired,
  telephone,
  address,
}) => {
  const employee = new Employee({
    firstName,
    lastName,
    employeeID,
    dateBirth,
    role,
    department,
    salary,
    dateHired,
    telephone,
    address,
  });

  try {
    return await employee.save();
  } catch (e) {
    return e.message;
  }
};

//Retrieve all employees
const getEmployees = async () => {
  try {
    return await Employee.find();
  } catch (e) {
    return e.message;
  }
};

//Retrieve an employee
const getEmployee = async (id) => {
  try {
    return await Employee.findById(id);
  } catch (e) {
    return e.message;
  }
};

//Update an employee
const updateEmployee = async (id, data) => {
  try {
    return Employee.findByIdAndUpdate(id, data, { new: true });
  } catch (e) {
    return e.message;
  }
};

//Delete an employee
const deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id);
};

//Add attendance
const addAttendance = async (employeeId, date, clockIn) => {
  const attendance = new Attendance({
    employee: employeeId,
    date,
    clockIn,
  });

  try {
    return await attendance.save();
  } catch (e) {
    return e.message;
  }
};

//Get all attendance
const getAllAttendance = async () => {
  try {
    return await Attendance.find()
      .sort({ clockIn: 1 })
      .populate("employee", "firstName lastName employeeID");
  } catch (e) {
    return e.message;
  }
};

//Retrieve one attendance
const getAttendance = async (attendanceId) => {
  try {
    return await Attendance.findById(attendanceId);
  } catch (e) {
    return e.message;
  }
};

//Edit attendance
const editAttendance = async (attendanceId, newTime) => {
  try {
    return Attendance.findByIdAndUpdate(attendanceId, newTime, { new: true });
  } catch (e) {
    return e.message;
  }
};

//Delete an attendance
const deleteAttendance = async (id) => {
  try {
    return await Attendance.findByIdAndDelete(id);
  } catch (e) {
    return e.message;
  }
};

//Add leave
const addLeave = async (employeeId, startDate, endDate, notes) => {
  const leave = new Leave({
    employee: employeeId,
    startDate,
    endDate,
    notes,
  });

  try {
    return await leave.save();
  } catch (e) {
    return e.message;
  }
};

//Get all leaves
const getAllLeave = async () => {
  try {
    return await Leave.find()
      .sort({ startDate: 1 })
      .populate("employee", "firstName lastName employeeID");
  } catch (e) {
    return e.message;
  }
};

//Retrieve one aleave
const getLeave = async (leaveId) => {
  try {
    return await Leave.findById(leaveId);
  } catch (e) {
    return e.message;
  }
};

//Edit attendance
const editLeave = async (leaveId, data) => {
  try {
    return Leave.findByIdAndUpdate(leaveId, data, { new: true });
  } catch (e) {
    return e.message;
  }
};

//Delete an attendance
const deleteLeave = async (id) => {
  try {
    return await Leave.findByIdAndDelete(id);
  } catch (e) {
    return e.message;
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  getEmployee,
  deleteEmployee,
  updateEmployee,
  addAttendance,
  getAttendance,
  editAttendance,
  getAllAttendance,
  deleteAttendance,
  addLeave,
  getLeave,
  editLeave,
  getAllLeave,
  deleteLeave,
};

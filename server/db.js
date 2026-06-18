const Employee = require("./models/employeeModel.js");
const Attendance = require("./models/attendanceModel.js");
const Leave = require("./models/leaveModel.js");
const { AdminUser } = require("./models/adminUserModel.js");
const Task = require("./models/taskModel.js");

//Employee operations
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
  emergencyContact,
  relationship,
  contactPhone,
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
    emergencyContact,
    relationship,
    contactPhone,
  });

  try {
    return await employee.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Retrieve all employees
const getEmployees = async () => {
  try {
    return await Employee.find().sort({ lastName: 1 });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

//Retrieve an employee
const getEmployee = async (id) => {
  try {
    return await Employee.findById(id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

//Update an employee
const updateEmployee = async (id, data) => {
  try {
    return Employee.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("An error occured while updating the employee: ", error);
    throw error;
  }
};

//Delete an employee
const deleteEmployee = async (id) => {
  try {
    await Employee.deleteOne({ _id: id });
    await Attendance.deleteMany({ employee: id });
    await Leave.deleteMany({ employee: id });
    console.log("Transaction was successfull.");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

//Attendance operations
//Add attendance
const addAttendance = async (employeeId, clockIn) => {
  const expectedClockIn = new Date();
  const date = expectedClockIn.toISOString().split("T")[0];
  console.log("Current date: ", date);

  // Expected clock in time
  const expectedHour = 6;
  const expectedMinute = 0;
  expectedClockIn.setHours(expectedHour, expectedMinute, 0, 0);

  console.log("Expected clock in time:", expectedClockIn);
  const diffMs = new Date(clockIn).getTime() - expectedClockIn.getTime();
  const lateMinutes = Math.max(0, Math.floor(diffMs / 60000));
  const status = lateMinutes > 0 ? "retard" : "ponctuel";

  console.log("clockIn time to save to db: ", clockIn);
  console.log("Attendance status:", status);

  const attendance = new Attendance({
    employee: employeeId,
    date,
    clockIn,
    status,
    lateMinutes,
  });

  try {
    return await attendance.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Retrieve attendance by date
const getAttendanceByDate = async (date) => {
  try {
    return await Attendance.find({
      date,
    })
      .sort({ clockIn: 1 })
      .populate("employee", "firstName lastName employeeID role department");
  } catch (error) {
    console.error(
      "An error occured while fetching attendances from database: ",
      error
    );
    throw error;
  }
};

//Retrieve daily attendance by employee ID
const getAttendanceByEmployeeID = async (employeeObjectId) => {
  try {
    return await Attendance.findOne({
      date: new Date().toISOString().split("T")[0],
      employee: employeeObjectId,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Retrieve attendance by attendance ID
const getAttendance = async (attendanceId) => {
  try {
    return await Attendance.findById(attendanceId);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

//Edit attendance
const editAttendance = async (attendanceId, attendanceData) => {
  const { clockIn, ...rest } = attendanceData;
  let updatedAttendance = { ...rest };
  console.log("Clock in time to update: ", clockIn);

  if (clockIn) {
    // Expected clock in time
    const expectedHour = 6;
    const expectedMinute = 0;
    const expectedClockIn = new Date(clockIn);
    expectedClockIn.setHours(expectedHour, expectedMinute, 0, 0);
    console.log("Expected clock in time: ", expectedClockIn);

    const diffMs = new Date(clockIn).getTime() - expectedClockIn.getTime();
    const lateMinutes = Math.max(0, Math.floor(diffMs / 60000));
    const status = lateMinutes > 0 ? "retard" : "ponctuel";

    updatedAttendance.clockIn = new Date(clockIn);
    updatedAttendance.lateMinutes = lateMinutes;
    updatedAttendance.status = status;
  }

  try {
    return Attendance.findByIdAndUpdate(attendanceId, updatedAttendance, {
      new: true,
    });
  } catch (error) {
    console.error("An error occured while updating attendance:", error);
    throw error;
  }
};

//Delete an attendance
const deleteAttendance = async (id) => {
  try {
    return await Attendance.findByIdAndDelete(id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// Leave operations
//Add leave
const addLeave = async (employeeId, startDate, endDate, subject, notes) => {
  const leave = new Leave({
    employee: employeeId,
    submittedAt: new Date(),
    startDate,
    endDate,
    subject,
    notes,
  });

  try {
    const savedLeave = await leave.save();
    const populatedLeave = await Leave.findById(savedLeave._id).populate(
      "employee",
      "firstName lastName employeeID department role remainingLeave"
    );
    return populatedLeave;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Get leaves by month
const getLeavesByMonth = async (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  try {
    return await Leave.find({
      submittedAt: {
        $gte: start,
        $lt: end,
      },
    })
      .sort({ submittedAt: 1 })
      .populate(
        "employee",
        "firstName lastName employeeID department role remainingLeave"
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Get ongoing leaves
const getOnGoingLeaves = async () => {
  try {
    const today = new Date();
    return await Leave.find({
      status: "Approuvé",
      startDate: { $lte: today },
      endDate: { $gte: today },
    })
      .sort({ startDate: 1 })
      .populate(
        "employee",
        "firstName lastName employeeID department role remainingLeave"
      );
  } catch (error) {
    throw error;
  }
};

//Retrieve leave by ID
const getLeaveByID = async (leaveId) => {
  try {
    return await Leave.findById(leaveId).populate(
      "employee",
      "firstName lastName employeeID department role remainingLeave"
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

//Retrieve pending leaves
const getPendingLeaves = async (employeeId) => {
  try {
    return await Leave.find({
      employee: employeeId,
      status: "En attente d'approbation",
    });
  } catch (error) {
    console.error("Error while fetching pending leaves: ", error);
    throw error;
  }
};

//Edit leave
const editLeave = async (leaveId, data) => {
  try {
    return Leave.findByIdAndUpdate(leaveId, data, { new: true }).populate(
      "employee",
      "firstName lastName employeeID remainingLeave"
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Delete leave entry
const deleteLeave = async (id) => {
  try {
    return await Leave.findByIdAndDelete(id);
  } catch (error) {
    console.error("Unable to delete leave entry from the database: ", error);
    throw error;
  }
};

//Admin user operations
//Create new admin user
const createAdminUser = async ({ firstName, lastName, email, password }) => {
  const adminUser = new AdminUser({
    firstName,
    lastName,
    email,
    password,
  });

  try {
    return await adminUser.save();
  } catch (error) {
    console.error("Error while creating admin user", error);
    throw error;
  }
};

//Retrieve admin user by ID
const getAdminUserByID = async (_id) => {
  try {
    return await AdminUser.findOne({ _id });
  } catch (error) {
    console.error("Error while fetching admin user: ", error);
    throw error;
  }
};

//Retrieve admin user by email
const getAdminUserByEmail = async (email) => {
  try {
    return await AdminUser.findOne({ email });
  } catch (error) {
    console.error("Error while fetching admin user: ", error);
    throw error;
  }
};

//Update an admin user
const updateAdminUser = async (id, data) => {
  try {
    return AdminUser.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("An error occured while updating the employee: ", error);
    throw error;
  }
};

//Save new task
const saveTask = async ({ author, recipient, message, createdAt }) => {
  const task = new Task({
    author,
    recipient,
    message,
    createdAt,
  });

  try {
    return await task.save();
  } catch (error) {
    console.error("Error while saving task: ", error);
    throw error;
  }
};

//Get all announcements
const getTasks = async () => {
  try {
    return await Task.find().sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error while fetching tasks: ", error);
    throw error;
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
  getAttendanceByDate,
  getAttendanceByEmployeeID,
  editAttendance,
  deleteAttendance,
  addLeave,
  getLeaveByID,
  getPendingLeaves,
  editLeave,
  getLeavesByMonth,
  getOnGoingLeaves,
  deleteLeave,
  createAdminUser,
  getAdminUserByID,
  getAdminUserByEmail,
  updateAdminUser,
  saveTask,
  getTasks,
};

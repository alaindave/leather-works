const db = require("../db.js");
import Employee from "../../shared/types/Employee";

const addEmployee = (employee: Employee) => {
  return new Promise((resolve, reject) => {
    const {
      firstName,
      lastName,
      employeeID,
      dateBirth,
      role,
      dateHired,
      department,
      telephone,
      address,
      salary,
      status = "active",
      remainingLeave = 20,
    } = employee;

    const query = `
      INSERT INTO employees (
        firstName,
        lastName,
        employeeID,
        dateBirth,
        role,
        dateHired,
        department,
        telephone,
        address,
        salary,
        status,
        remainingLeave
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        firstName,
        lastName,
        employeeID,
        dateBirth,
        role,
        dateHired,
        department,
        telephone,
        address,
        salary,
        status,
        remainingLeave,
      ],
      function (this: { lastID: number }, err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            ...employee,
          });
        }
      }
    );
  });
};

module.exports = {
  addEmployee,
};

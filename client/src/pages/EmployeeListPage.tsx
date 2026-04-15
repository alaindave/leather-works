import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddEmployee from "../components/AddEmployee";
import EmployeeCard from "../components/EmployeeCard";
import "../styles/App.css";
import type Employee from "../Employee";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const handleAddEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
  };

  useEffect(() => {
    axios
      .get<Employee[]>("http://localhost:5000/employees")
      .then((res) => {
        setEmployees(res.data);
        console.log("Response received", res.data);
      })
      .catch((err) => {
        console.log("This is the error", err.message);
      });
  }, []);

  return (
    <Flex direction="column">
      <AddEmployee onAddEmployee={handleAddEmployee} />
      <Box position="relative" top="80px" right="60px">
        <ul>
          {employees.map((employee) => (
            <li key={employee._id}>
              <Link
                to={{
                  pathname: `/employees_admin/employees_list/${employee._id}`,
                }}
                state={employees}
              >
                <EmployeeCard key={employee.employeeID} employee={employee} />
              </Link>
            </li>
          ))}
        </ul>
      </Box>
    </Flex>
  );
};

export default EmployeeListPage;

import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import EmployeeCard from "../components/EmployeeCard";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../css/App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import AddEmployee from "../components/AddEmployee";

interface Employee {
  _id: number;
  firstName: string;
  lastName: string;
  employeeID: string;
  dateBirth: string;
  role: string;
  department: string;
  dateHired: string;
  telephone: number;
  address: string;
  salary: string;
  photo: string;
}

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    axios
      .get<Employee[]>("http://localhost:5000/employees")
      .then((res) => {
        setEmployees(res.data);
        console.log("response received", res.data);
      })
      .catch((err) => {
        console.log("This is the error", err.message);
      });
  }, []);

  return (
    <Flex direction="column">
      <AddEmployee />
      <Box position="relative" top="80px" right="60px">
        <ul>
          {employees.map((employee) => (
            <li>
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

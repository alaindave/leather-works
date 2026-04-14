import { Box, Flex, HStack, Image } from "@chakra-ui/react";
import EmployeeNavBar from "./EmployeeNavBar";
import { Link, Outlet } from "react-router-dom";
// @ts-ignore
import logo from "../assets/AfritanLogo.png";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
}
const EmployeeAdminLayout = () => {
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
    <Flex justify="space-between">
      <Box position="relative" right="30px" top="20px">
        <EmployeeNavBar employees={employees} />
      </Box>
      <Outlet />
      <Link to="/admin">
        <Image src={logo} position="absolute" right="10px" />
      </Link>
    </Flex>
  );
};

export default EmployeeAdminLayout;

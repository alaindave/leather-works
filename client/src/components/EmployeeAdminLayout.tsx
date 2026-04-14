import { Box, Flex, Image } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";
// @ts-ignore
import axios from "axios";
import { useEffect, useState } from "react";
import type Employee from "../Employee";
import logo from "../assets/AfritanLogo.png";

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

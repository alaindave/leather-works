import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EmployeeDashboard from "../components/EmployeeDashboard";
import type Employee from "../Employee";

const EmployeeAdminPage = () => {
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
    <Flex>
      <Box position="relative" top="150px" right="50px" padding="20px">
        <EmployeeDashboard employeeCount={employees.length} />
      </Box>
    </Flex>
  );
};

export default EmployeeAdminPage;

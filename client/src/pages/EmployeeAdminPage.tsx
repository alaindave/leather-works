import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type Attendance from "../Attendance";
import type Employee from "../Employee";
import EmployeeDashboard from "../components/EmployeeDashboard";

const EmployeeAdminPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    axios
      .get<Employee[]>("http://localhost:5000/employees")
      .then((res) => {
        setEmployees(res.data);
        return axios.get<Attendance[]>(
          "http://localhost:5000/employees/attendance"
        );
      })
      .then((res) => {
        setAttendance(res.data);
      })
      .catch((err) => {
        console.log("This is the error", err.message);
      });
  }, []);

  return (
    <Flex>
      <Box position="relative" top="150px" right="50px" padding="20px">
        <EmployeeDashboard
          employeeCount={employees.length}
          attendanceCount={attendance.length}
        />
      </Box>
    </Flex>
  );
};

export default EmployeeAdminPage;

import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type Attendance from "../Attendance";
import type Employee from "../Employee";
import EmployeeDashboard from "../components/EmployeeDashboard";
import type Leave from "../Leave";

const EmployeeAdminPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

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
        setAttendances(res.data);
        return axios.get<Leave[]>("http://localhost:5000/employees/leave");
      })
      .then((res) => setLeaves(res.data))
      .catch((err) => {
        console.log("This is the error", err.message);
      });
  }, []);

  return (
    <Flex>
      <Box position="relative" top="200px" right="60px" padding="20px">
        <EmployeeDashboard
          employeeCount={employees.length}
          attendanceCount={attendances.length}
          leaveCount={leaves.length}
        />
      </Box>
    </Flex>
  );
};

export default EmployeeAdminPage;

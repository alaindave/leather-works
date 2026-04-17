import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type Employee from "../Employee";
import AddEmployee from "../components/AddEmployee";
import EmployeeCard from "../components/EmployeeCard";
import "../styles/App.css";

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
        console.log("Employees received", res.data);
      })
      .catch((err) => {
        console.log("This is the error", err.message);
      });
  }, []);

  return (
    <Flex direction="column">
      {employees.length === 0 ? (
        <Box position="relative" top="300px" right="40px">
          <AddEmployee onAddEmployee={handleAddEmployee} />
        </Box>
      ) : (
        <Box position="relative" marginTop="10px">
          <AddEmployee onAddEmployee={handleAddEmployee} />
        </Box>
      )}

      <Box
        maxH="500px"
        overflowY="auto"
        position="relative"
        top="50px"
        right="40px"
      >
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

import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
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
        <Box position="relative" top="300px" left="80px">
          <AddEmployee onAddEmployee={handleAddEmployee} />
        </Box>
      ) : (
        <Box position="absolute" top="10px" right="10px">
          <AddEmployee onAddEmployee={handleAddEmployee} />
        </Box>
      )}

      <Box
        maxH="500px"
        overflowY="auto"
        position="relative"
        top="150px"
        left="150px"
      >
        <ul>
          {employees.map((employee) => (
            <li key={employee._id}>
              <EmployeeCard
                key={employee.employeeID}
                employee={employee}
                employees={employees}
              />
            </li>
          ))}
        </ul>
      </Box>
    </Flex>
  );
};

export default EmployeeListPage;

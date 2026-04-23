import { Box, Button, Card, Flex, Image, Text } from "@chakra-ui/react";
import { CardBody } from "react-bootstrap";
import type Attendance from "../Attendance";
import type Employee from "../Employee";
// @ts-ignore
import axios from "axios";
import { Link } from "react-router-dom";
import source from "../assets/employee_photos/Jeanne.jpeg";
import "../styles/App.css";
import { MdOutlinePunchClock } from "react-icons/md";

import { useState } from "react";

interface Props {
  employee: Employee;
  employees: Employee[];
}

const EmployeeCard = ({ employees, employee }: Props) => {
  const _lastName = employee.lastName.slice(0, 1);

  const handleClockIn = async () => {
    await axios
      .put<Employee>(`//localhost:5000/employees/${employee._id}`, {
        present: true,
      })
      .then(() => {
        return axios.post<Attendance>(
          `//localhost:5000/employees/attendance/${employee._id}`
        );
      })
      .then((response) => {
        console.log("Attendance success", response.data);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return (
    <Card
      bg="#cca333	"
      height="80px"
      width="320px"
      padding="10px"
      borderRadius="30px"
    >
      <CardBody>
        <Flex>
          <Link
            to={{
              pathname: `/employees_admin/employees_list/${employee._id}`,
            }}
            state={employees}
          >
            <Image
              src={source}
              borderRadius={30}
              width={10}
              position="absolute"
              left="20px"
            />
          </Link>
          <Box>
            <ul>
              <li>
                <Text
                  color=" #262626"
                  fontWeight="700"
                  fontSize="23px"
                  fontFamily="serif"
                  position="relative"
                  left="30px"
                >
                  <span>{employee.firstName}</span>
                  <span>{_lastName}</span>
                </Text>
              </li>
              <li>
                <Text
                  color=" #262626"
                  fontWeight="700"
                  fontSize="23px"
                  fontFamily="ui-monospace"
                  position="relative"
                  left="30px"
                  bottom="30px"
                >
                  <span>{employee.employeeID}</span>
                </Text>
              </li>
            </ul>
          </Box>
          {employee.present ? null : (
            <Button
              position="relative"
              left="40px"
              color="brown"
              backgroundColor="transparent"
              _hover={{ bg: "transparent" }}
              onClick={handleClockIn}
            >
              <MdOutlinePunchClock className="fa-3x" />
            </Button>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default EmployeeCard;

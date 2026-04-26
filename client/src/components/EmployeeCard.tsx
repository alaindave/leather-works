import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { BsFillClockFill } from "react-icons/bs";
import type Attendance from "../Attendance";
import type Employee from "../Employee";
// @ts-ignore
import axios from "axios";
import { Link } from "react-router-dom";
import source from "../assets/employee_photos/Jeanne.jpeg";
import "../styles/App.css";

interface Props {
  employee: Employee;
  employees: Employee[];
}

const EmployeeCard = ({ employees, employee }: Props) => {
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
    <Box
      bg=" #0a2142"
      height="80px"
      width="700px"
      padding="10px"
      borderRadius="30px"
    >
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
          />
        </Link>
        <Box>
          <ul>
            <li>
              <Text
                color="#F2B705"
                fontWeight="700"
                fontSize="23px"
                fontFamily="serif"
                position="relative"
                left="30px"
              >
                <span style={{ color: "#F2B705", marginRight: "8px" }}>
                  {employee.firstName}
                </span>
                <span style={{ color: "#F2B705" }}>{employee.lastName}</span>
              </Text>
            </li>
            <li>
              <Text
                fontWeight="700"
                fontSize="23px"
                fontFamily="ui-monospace"
                position="relative"
                left="30px"
                bottom="30px"
              >
                <span
                  style={{
                    color: "#93A4D1",
                    fontWeight: "400",
                  }}
                >
                  {employee.role}{" "}
                </span>
              </Text>
            </li>
          </ul>
        </Box>

        {employee.present ? (
          <Text
            position="absolute"
            right="20px"
            fontSize="20px"
            color="green.400"
          >
            Present
          </Text>
        ) : (
          <Button
            position="absolute"
            right="10px"
            color="#F2B705"
            backgroundColor="transparent"
            _hover={{ bg: "transparent" }}
            onClick={handleClockIn}
          >
            <BsFillClockFill className="fa-3x" />
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default EmployeeCard;

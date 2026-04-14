import { Box, Card, Flex, Image, Text } from "@chakra-ui/react";
import { CardBody } from "react-bootstrap";
// @ts-ignore
import type Employee from "../Employee";
import source from "../assets/Employeephotos/Jeanne.jpeg";
import "../styles/App.css";

interface Props {
  employee: Employee;
}

const EmployeeCard = ({ employee }: Props) => {
  const _lastName = employee.lastName.slice(0, 1);
  console.log("first letter", _lastName);
  return (
    <Card
      bg="#cca333	"
      height="80px"
      width="300px"
      padding="10px"
      borderRadius="30px"
    >
      <CardBody>
        <Flex>
          <Image
            src={source}
            borderRadius={30}
            width={10}
            position="absolute"
            left="20px"
          />
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
        </Flex>
      </CardBody>
    </Card>
  );
};

export default EmployeeCard;

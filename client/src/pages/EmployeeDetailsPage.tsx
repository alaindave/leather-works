import { Box, Text, VStack } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";
import type Employee from "../Employee";

const EmployeeDetailsPage = () => {
  const { state: employees } = useLocation();
  const { _id } = useParams();

  const employee = employees.find((employee: Employee) => employee._id === _id);

  return (
    <VStack spacing="75px">
      <Box
        bg=" #c39409"
        fontWeight="700"
        borderRadius="30px"
        padding="20px"
        width="500px"
        top="60px"
        position="relative"
        right="60px"
      >
        <ul>
          <li>
            <Text color=" #262626" fontWeight="700">
              Nom:<span>{employee.lastName}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Prenom:<span>{employee.firstName}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Matricule:<span>{employee.employeeID}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Date de naissance:<span>{employee.dateBirth}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Addresse:<span>{employee.address}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Telephone:<span>{employee.telephone}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Salaire:<span>{employee.salary}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Date d'engagement:<span>{employee.dateHired}</span>
            </Text>
          </li>
        </ul>
      </Box>
    </VStack>
  );
};

export default EmployeeDetailsPage;

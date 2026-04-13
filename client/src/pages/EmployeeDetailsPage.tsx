import { useParams, useLocation } from "react-router-dom";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import Footer from "../components/Footer";
import React from "react";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeID: string;
  dateBirth: string;
  role: string;
  department: string;
  dateHired: string;
  telephone: number;
  address: string;
  salary: string;
  photo: string;
}

const EmployeeDetailsPage = () => {
  const location = useLocation();
  const employees = location.state;
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
              Salaire:<span>{employee.salaire}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Date d'engagement:<span>{employee.date_embauche}</span>
            </Text>
          </li>
        </ul>
      </Box>
    </VStack>
  );
};

export default EmployeeDetailsPage;

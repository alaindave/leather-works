import {
  Box,
  Button,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type Employee from "../Employee";
import UpdateEmployee from "../components/UpdateEmployee";
import { useState } from "react";

const EmployeeDetailsPage = () => {
  const { state: employees } = useLocation();
  const { _id } = useParams();
  const employee = employees.find((employee: Employee) => employee._id === _id);
  const navigate = useNavigate();

  const handleDelete = async () => {
    await axios
      .delete<Employee>(`//localhost:5000/employees/${_id}`)
      .then((response) => {
        console.log("Employee successfully deleted", response.data);
        navigate("/employees_admin/employees_list");
      })
      .catch((error) => console.log("Unable to delete employee:", error));
  };

  return (
    <Box
      bg=" #c39409"
      borderWidth="4px"
      borderColor="black"
      fontWeight="700"
      borderRadius="30px"
      padding="20px"
      width="500px"
      top="80px"
      position="relative"
      left="300px"
    >
      <Tabs variant="line" colorScheme="gray">
        <TabList>
          <Tab>Bio</Tab>
          <Tab>Contact</Tab>
          <Tab>Autre</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
            </ul>
          </TabPanel>
          <TabPanel>
            <ul>
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
            </ul>
          </TabPanel>
          <TabPanel>
            <ul>
              <li>
                <Text color="#262626" fontWeight="700">
                  Salaire:<span>{employee.salary}</span>
                  <em>FBU</em>
                </Text>
              </li>
              <li>
                <Text color="#262626" fontWeight="700">
                  Date d'engagement:<span>{employee.dateHired}</span>
                </Text>
              </li>
            </ul>
          </TabPanel>
          <HStack ml="30px">
            <UpdateEmployee _id={_id} employee={employee} />
            <Button
              borderColor="black"
              bg="brown"
              borderRadius="15px"
              borderWidth="4px"
              color="#d6b65c"
              size="lg"
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </HStack>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
export default EmployeeDetailsPage;

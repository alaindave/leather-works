import { Box, HStack, Text, Button } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type Employee from "../Employee";
import axios from "axios";

const EmployeeDetailsPage = () => {
  const { state: employees } = useLocation();
  const navigate = useNavigate();
  const { _id } = useParams();

  const employee = employees.find((employee: Employee) => employee._id === _id);

  console.log("employee:", employee);

  const handleDelete = async () => {
    await axios
      .delete(`//localhost:5000/employees/${_id}`)
      .then((response) => {
        console.log("Employee successfully deleted", response.data);
        navigate("/employees_admin/employees_list");
      })
      .catch((error) => console.log("Unable to delete employee:", error));
  };

  return (
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
      <HStack ml="50px">
        <Button size="sm" bg="#280901">
          Modifier
        </Button>
        <Button size="sm" bg="#280901" onClick={handleDelete}>
          Supprimer
        </Button>
      </HStack>
    </Box>
  );
};

export default EmployeeDetailsPage;

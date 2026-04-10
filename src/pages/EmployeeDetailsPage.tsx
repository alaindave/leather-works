import { useParams } from "react-router-dom";
import employees from "../employees";
import { Box, Flex, Text } from "@chakra-ui/react";

const EmployeeDetailsPage = () => {
  let { id } = useParams();

  let matricule: number;

  if (id) {
    matricule = parseInt(id);
  }

  const employee = employees.filter((employee) => employee.id === matricule);

  return (
    <Flex
      height="90vh"
      direction="column"
      align="center"
      justify="space-between"
    >
      <Box
        bg=" #c39409"
        fontWeight="700"
        borderRadius="30px"
        padding="30px"
        width="500px"
        marginTop="110px"
      >
        <ul>
          <li>
            <Text color=" #262626" fontWeight="700">
              Nom:<span>{employee[0].lastName}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Prenom:<span>{employee[0].firstName}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Matricule:<span>{employee[0].matricule}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Date de naissance:<span>{employee[0].dateBirth}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Addresse:<span>{employee[0].address}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Telephone:<span>{employee[0].telephone}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Salaire:<span>{employee[0].salaire}</span>
            </Text>
          </li>
          <li>
            <Text color=" #262626" fontWeight="700">
              Date d'engagement:<span>{employee[0].date_embauche}</span>
            </Text>
          </li>
        </ul>
      </Box>
    </Flex>
  );
};

export default EmployeeDetailsPage;

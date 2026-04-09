import { useParams } from "react-router-dom";
import employees from "../employees";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "../components/Footer";

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
        borderColor="yellow"
        borderRadius="30px"
        borderWidth="10px"
        borderStyle="solid"
        padding="20px"
        width="500px"
        marginTop="110px"
      >
        <ul>
          <li>Noms:{employee[0].lastName}</li>
          <li>Prenom:{employee[0].firstName}</li>
          <li>Matricule:{employee[0].matricule}</li>
          <li>Date de naissance:{employee[0].dateBirth}</li>
          <li>Addresse:{employee[0].address}</li>
          <li>Telephone:{employee[0].telephone}</li>
          <li>Salaire:{employee[0].salaire}</li>
          <li>Date d'embauche:{employee[0].date_embauche}</li>
        </ul>
      </Box>
      <Box>
        <Footer />
      </Box>
    </Flex>
  );
};

export default EmployeeDetailsPage;

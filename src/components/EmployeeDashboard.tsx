import { Box, Flex, Text } from "@chakra-ui/react";
import "../css/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  return (
    <>
      <Flex direction="column">
        <div className="container">
          <Box marginRight="30px">
            <Text>Nombres d'employes</Text>
            <Text>50</Text>
          </Box>
          <Box marginRight="30px">
            <Text>Employes presents</Text>
            <Text>30</Text>
          </Box>
          <Box>
            <Text>Conges</Text>
            <Text>5</Text>
          </Box>
        </div>
      </Flex>
    </>
  );
};

export default EmployeeDashboard;

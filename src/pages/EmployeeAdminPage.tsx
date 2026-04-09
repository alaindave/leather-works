import { Box, Flex, Spacer } from "@chakra-ui/react";
import EmployeeDashboard from "../components/EmployeeDashboard";
import Footer from "../components/Footer";

const EmployeeAdminPage = () => {
  return (
    <Flex
      height="90vh"
      direction="column"
      align="center"
      justify="space-between"
    >
      <Box
        borderColor="white"
        borderRadius="30px"
        borderStyle="solid"
        borderWidth="3px"
        marginTop="150px"
        padding="20px"
      >
        <EmployeeDashboard />
      </Box>
      <Box>
        <Footer />
      </Box>
    </Flex>
  );
};

export default EmployeeAdminPage;

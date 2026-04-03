import { Box, Flex, Spacer } from "@chakra-ui/react";
import EmployeeNavBar from "./EmployeeNavBar";
import EmployeeDashboard from "./EmployeeDashboard";
import Footer from "./Footer";

const EmployeeAdminPage = () => {
  return (
    <Flex
      height="100vh"
      direction="column"
      align="center"
      justify="space-between"
    >
      <Box>
        <EmployeeNavBar />
      </Box>
      <Box
        borderColor="white"
        borderStyle="solid"
        borderWidth="3px"
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

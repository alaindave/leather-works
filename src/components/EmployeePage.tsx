import { Box, Flex } from "@chakra-ui/react";
import EmployeeNavBar from "./EmployeeNavBar";
import EmployeeDashboard from "./EmployeeDashboard";
import "../css/EmployeePage.css";

const EmployeePage = () => {
  return (
    <>
      <Flex direction="column" align="center">
        <Box>
          <EmployeeNavBar />
        </Box>

        <Box className="_container">
          <EmployeeDashboard />
        </Box>
      </Flex>
    </>
  );
};

export default EmployeePage;

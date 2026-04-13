import { Box, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import EmployeeDashboard from "../components/EmployeeDashboard";
import Footer from "../components/Footer";
import React from "react";

const EmployeeAdminPage = () => {
  return (
    <Flex>
      <Box position="relative" top="150px" right="50px" padding="20px">
        <EmployeeDashboard />
      </Box>
    </Flex>
  );
};

export default EmployeeAdminPage;

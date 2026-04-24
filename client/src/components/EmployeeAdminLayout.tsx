import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";

const EmployeeAdminLayout = () => {
  return (
    <Flex justify="space-between">
      <Box position="relative">
        <EmployeeNavBar />
      </Box>
      <Outlet />
    </Flex>
  );
};

export default EmployeeAdminLayout;

import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";

const EmployeeAdminLayout = () => {
  return (
    <Flex
      height="100vh"
      width="100%"
      bg="#F8FAFC"
      overflowY="hidden"
      overflowX="hidden"
    >
      <Box>
        <EmployeeNavBar />
      </Box>
      <Outlet />
    </Flex>
  );
};

export default EmployeeAdminLayout;

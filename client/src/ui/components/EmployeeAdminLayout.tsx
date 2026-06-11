import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";

const EmployeeAdminLayout = () => {
  return (
    <Flex
      margin="0"
      height="100vh"
      width="100%"
      bg="gray.800"
      overflowY="hidden"
      overflowX="hidden"
    >
      <Box ml={1.5}>
        <EmployeeNavBar />
      </Box>
      <Outlet />
    </Flex>
  );
};

export default EmployeeAdminLayout;

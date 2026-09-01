import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";

const EmployeeAdminLayout = () => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      height="100vh"
      width="100%"
      bg="#ffffff"
      overflow="hidden"
    >
      {/* Navigation */}
      <Box
        flexShrink={0}
        width={{ base: "100%", md: "210px", lg: "225px", xl: "240px" }}
        maxWidth={{ base: "100%", md: "240px" }}
        overflow="hidden"
      >
        <EmployeeNavBar />
      </Box>

      {/* Page content */}
      <Box
        flex="1"
        minWidth={0}
        minHeight={0}
        width="100%"
        overflowY="auto"
        overflowX="hidden"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

export default EmployeeAdminLayout;

import { Box, Flex, HStack, Image } from "@chakra-ui/react";
import EmployeeNavBar from "./EmployeeNavBar";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/afritan-logo.png";

const EmployeeAdminLayout = () => {
  return (
    <Flex justify="space-between">
      <Box position="relative" right="30px" top="20px">
        <EmployeeNavBar />
      </Box>
      <Outlet />
      <Link to="/admin">
        <Image src={logo} position="absolute" right="10px" />
      </Link>
    </Flex>
  );
};

export default EmployeeAdminLayout;

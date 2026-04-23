import { Box, Flex, Image } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import EmployeeNavBar from "./EmployeeNavBar";
// @ts-ignore
import logo from "../assets/afritan_logo.png";

const EmployeeAdminLayout = () => {
  return (
    <Flex justify="space-between">
      <Box position="relative" right="35px" top="60px">
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

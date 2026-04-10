import { Box } from "@chakra-ui/react";
import EmployeeNavBar from "./EmployeeNavBar";
import { Outlet } from "react-router-dom";

const EmployeeAdminLayout = () => {
  return (
    <>
      <Box marginTop="10px">
        <EmployeeNavBar />
      </Box>
      <Outlet />
    </>
  );
};

export default EmployeeAdminLayout;

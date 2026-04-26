import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import { FaFileSignature, FaRegClock } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";

import { NavLink } from "react-router-dom";
// @ts-ignore
import "../styles/App.css";
import Logo from "./Logo";

const EmployeeNavBar = () => {
  return (
    <Flex
      direction="column"
      borderWidth="1px"
      marginTop="10px"
      marginLeft="10px"
      borderRadius="15px"
      padding="8px"
      background="#0B1E3A"
    >
      <Box className="logo">
        <Logo />
      </Box>
      <Box className="nav-list">
        <ul>
          <li>
            <HStack position="relative" right="30px">
              <FaHome />
              <NavLink end to="/employees_admin">
                Tableau de bord
              </NavLink>
            </HStack>
          </li>
          <li>
            <HStack position="relative" right="30px">
              <IoPeopleSharp />
              <NavLink
                className="nav-button"
                to="/employees_admin/employees_list"
              >
                Employés
              </NavLink>
            </HStack>
          </li>
          <li>
            <HStack position="relative" right="30px">
              <FaRegClock />
              <NavLink to="/employees_admin/attendance">Présence</NavLink>
            </HStack>
          </li>
          <li>
            <HStack position="relative" right="30px">
              <FaRegCalendarAlt />
              <NavLink to="/employees_admin/leave">Congés</NavLink>
            </HStack>
          </li>

          <li>
            <HStack position="relative" right="30px">
              <FaFileSignature />
              <NavLink to="/employees_admin/payslips">Fiches de paye</NavLink>
            </HStack>
          </li>
        </ul>
      </Box>
    </Flex>
  );
};

export default EmployeeNavBar;

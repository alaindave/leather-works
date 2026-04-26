import {
  Box,
  Divider,
  Flex,
  Image,
  VStack,
  Text,
  Card,
  HStack,
} from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaFileSignature } from "react-icons/fa6";

import { Link, NavLink } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import "../styles/App.css";
import Logo from "./Logo";

const EmployeeNavBar = () => {
  return (
    <VStack
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
              <NavLink className="nav-button" to="/employees_admin">
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
              <NavLink className="nav-button" to="/employees_admin/attendance">
                Présence
              </NavLink>
            </HStack>
          </li>
          <li>
            <HStack position="relative" right="30px">
              <FaRegCalendarAlt />
              <NavLink className="nav-button" to="/employees_admin/leave">
                Congés
              </NavLink>
            </HStack>
          </li>

          <li>
            <HStack position="relative" right="30px">
              <FaFileSignature />
              <NavLink className="nav-button" to="/employees_admin/payslips">
                Fiches de paye
              </NavLink>
            </HStack>
          </li>
        </ul>
      </Box>
    </VStack>
  );
};

export default EmployeeNavBar;

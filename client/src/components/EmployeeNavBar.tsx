import {
  Box,
  Divider,
  Flex,
  Image,
  VStack,
  Text,
  Card,
} from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import "../styles/App.css";
import Logo from "./Logo";

const EmployeeNavBar = () => {
  return (
    <VStack
      borderWidth="1px"
      marginTop="40px"
      marginLeft="10px"
      borderRadius="15px"
      padding="10px"
      background="#0B1E3A"
    >
      <Box className="logo">
        <Logo />
      </Box>
      <Box className="nav-list">
        <ul>
          <li>
            <NavLink className="nav-button" to="/employees_admin">
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink
              className="nav-button"
              to="/employees_admin/employees_list"
            >
              Employés
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-button" to="/employees_admin/attendance">
              Présence
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-button" to="/employees_admin/leave">
              Congés
            </NavLink>
          </li>

          <li>
            <NavLink className="nav-button" to="/employees_admin/payslips">
              Fiches de paye
            </NavLink>
          </li>
        </ul>
      </Box>
    </VStack>
  );
};

export default EmployeeNavBar;

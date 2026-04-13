import { Box, Divider, Flex, Image, VStack } from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/afritan-logo.png";
import "../css/App.css";

const EmployeeNavBar = () => {
  return (
    <ul>
      <li>
        <NavLink className="nav-button" to="/employees_admin">
          Tableau de bord
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />
      <li>
        <NavLink className="nav-button" to="/employees_admin/employees_list">
          Employes
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />

      <li>
        <NavLink className="nav-button" to="/employees_admin/leave">
          Conges
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />

      <li>
        <NavLink className="nav-button" to="/employees_admin/leave">
          Presence
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />

      <li>
        <NavLink className="nav-button" to="/employees_admin/payslips">
          Fiches de paye
        </NavLink>
      </li>
    </ul>
  );
};

export default EmployeeNavBar;

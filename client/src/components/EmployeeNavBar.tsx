import { Box, Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import "../styles/App.css";

const EmployeeNavBar = () => {
  return (
    <Box className="nav-bar">
      <ul className="nav-list">
        <li>
          <NavLink className="nav-button" to="/employees_admin">
            Tableau de bord
          </NavLink>
        </li>
        <Divider orientation="horizontal" w="160px" borderColor="white" />
        <li>
          <NavLink className="nav-button" to="/employees_admin/employees_list">
            Employés
          </NavLink>
        </li>
        <Divider orientation="horizontal" w="160px" borderColor="white" />
        <li>
          <NavLink className="nav-button" to="/employees_admin/attendance">
            Presence
          </NavLink>
        </li>
        <Divider orientation="horizontal" w="160px" borderColor="white" />
        <li>
          <NavLink className="nav-button" to="/employees_admin/leave">
            Congés
          </NavLink>
        </li>
        <Divider orientation="horizontal" w="160px" borderColor="white" />

        <li>
          <NavLink className="nav-button" to="/employees_admin/payslips">
            Fiches de paye
          </NavLink>
        </li>
      </ul>
    </Box>
  );
};

export default EmployeeNavBar;

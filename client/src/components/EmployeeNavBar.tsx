import { Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import "../styles/App.css";

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
        <NavLink className="nav-button" to="/employees_admin/attendance">
          Presence
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
        <NavLink className="nav-button" to="/employees_admin/payslips">
          Fiches de paye
        </NavLink>
      </li>
    </ul>
  );
};

export default EmployeeNavBar;

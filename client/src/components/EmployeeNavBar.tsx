import { Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import "../styles/App.css";
import type Employee from "../Employee";

interface Props {
  employees: Employee[];
}

const EmployeeNavBar = ({ employees }: Props) => {
  return (
    <ul>
      <li>
        <NavLink className="nav-button" to="/employees_admin">
          Tableau de bord
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />
      <li>
        <NavLink
          className="nav-button"
          to="/employees_admin/employees_list"
          state={employees}
        >
          Employes
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />

      <li>
        <NavLink
          className="nav-button"
          to="/employees_admin/leave"
          state={employees}
        >
          Conges
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />

      <li>
        <NavLink
          className="nav-button"
          to="/employees_admin/leave"
          state={employees}
        >
          Presence
        </NavLink>
      </li>
      <Divider orientation="horizontal" w="40px" borderColor="white" />

      <li>
        <NavLink
          className="nav-button"
          to="/employees_admin/payslips"
          state={employees}
        >
          Fiches de paye
        </NavLink>
      </li>
    </ul>
  );
};

export default EmployeeNavBar;

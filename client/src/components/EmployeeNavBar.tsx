import { Divider } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import "../css/App.css";
import employees from "../employees";

interface Employee {
  _id: number;
  firstName: string;
  lastName: string;
  employeeID: string;
  dateBirth: string;
  role: string;
  department: string;
  dateHired: string;
  telephone: number;
  address: string;
  salary: string;
}

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

import { Divider, Flex } from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";

const EmployeeNavBar = () => {
  return (
    <Flex justify="center">
      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink to="/employees_admin">Tableau de bord</NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />
      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink to="/employees_admin/employees_list">Employes</NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink to="/employees_admin/leave">Conges</NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink to="/employees_admin/leave">Presence</NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink to="/employees_admin/payslips">Fiches de paye</NavLink>
        </div>
      </nav>
    </Flex>
  );
};

export default EmployeeNavBar;

import { Box, Divider, Flex, Image } from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/afritan-logo.png";
import "../css/App.css";

const EmployeeNavBar = () => {
  return (
    <Flex justify="center">
      <Box position="relative" marginRight="10px">
        <Link to="/admin">
          <Image src={logo} />
        </Link>
      </Box>
      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink className="nav-button" to="/employees_admin">
            Tableau de bord
          </NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="40px" borderColor="white" />
      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink className="nav-button" to="/employees_admin/employees_list">
            Employes
          </NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="40px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink className="nav-button" to="/employees_admin/leave">
            Conges
          </NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="40px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink className="nav-button" to="/employees_admin/leave">
            Presence
          </NavLink>
        </div>
      </nav>
      <Divider orientation="vertical" h="40px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <NavLink className="nav-button" to="/employees_admin/payslips">
            Fiches de paye
          </NavLink>
        </div>
      </nav>
    </Flex>
  );
};

export default EmployeeNavBar;

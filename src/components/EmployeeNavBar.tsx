import { Divider, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EmployeeNavBar = () => {
  return (
    <Flex>
      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees_admin">Tableau de bord</Link>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />
      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees_admin/employees_list">Employes</Link>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees_admin/leave">Conges</Link>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees_admin/leave">Presence</Link>
        </div>
      </nav>
      <Divider orientation="vertical" h="30px" borderColor="white" />

      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees_admin/payslips">Fiches de paye</Link>
        </div>
      </nav>
    </Flex>
  );
};

export default EmployeeNavBar;

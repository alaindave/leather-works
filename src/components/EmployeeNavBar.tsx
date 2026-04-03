import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EmployeeNavBar = () => {
  return (
    <Flex>
      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees">Tableau de bord</Link>
        </div>
      </nav>
      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees/employees_list">Employes</Link>
        </div>
      </nav>
      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees/leave">Conges</Link>
        </div>
      </nav>
      <nav className="navbar ">
        <div className="container-fluid">
          <Link to="/employees/payslips">Fiches de paye</Link>
        </div>
      </nav>
    </Flex>
  );
};

export default EmployeeNavBar;

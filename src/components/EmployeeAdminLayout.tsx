import EmployeeNavBar from "./EmployeeNavBar";
import { Outlet } from "react-router-dom";

const EmployeeAdminLayout = () => {
  return (
    <>
      <EmployeeNavBar />
      <div id="main">
        <Outlet />
      </div>
    </>
  );
};

export default EmployeeAdminLayout;

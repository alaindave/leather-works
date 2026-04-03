import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import employees from "../employees";
import EmployeeCard from "./EmployeeCard";
import EmployeeNavBar from "./EmployeeNavBar";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const EmployeeList = () => {
  return (
    <Flex
      height="100vh"
      direction="column"
      align="center"
      justify="space-between"
    >
      <Box>
        <EmployeeNavBar />
      </Box>
      <Box>
        <SimpleGrid columns={2} spacing={6} margin={20}>
          {employees.map((employee) => (
            <Link
              to={{
                pathname: `/employees_admin/employees_list/${employee.id}`,
              }}
            >
              <EmployeeCard key={employee.id} employee={employee} />
            </Link>
          ))}
        </SimpleGrid>
      </Box>
      <Box>
        <Footer />
      </Box>
    </Flex>
  );
};

export default EmployeeList;

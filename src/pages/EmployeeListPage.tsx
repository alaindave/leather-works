import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import employees from "../employees";
import EmployeeCard from "../components/EmployeeCard";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../css/App.css";

const EmployeeListPage = () => {
  return (
    <Flex
      height="180vh"
      direction="column"
      align="center"
      justify="space-between"
    >
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

export default EmployeeListPage;

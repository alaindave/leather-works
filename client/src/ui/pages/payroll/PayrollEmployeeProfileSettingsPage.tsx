import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MdOutlineChevronRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import PayrollEmployeeProfileList from "./PayrollEmployeeProfileList";
import { Link, useLocation } from "react-router-dom";
import Employee from "../../../common/types/Employee";

type PhotoState = {
  photo_url?: string;
};

type EmployeeState = {
  employee: Employee;
};

export default function PayrollEmployeeProfileSettingsPage() {
  const location = useLocation();
  const { employee } = (location.state as EmployeeState) || {};
  const { photo_url } = (location.state as PhotoState) || "";
  return (
    <Box p={6}>
      <HStack>
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employee?._id}`,
          }}
          state={{ photo_url, employee }}
        >
          <Box
            ml="0.8rem"
            mb="2rem"
            p={2}
            border="1px solid #14376b"
            borderRadius="10px"
          >
            <FaArrowLeftLong color="black" />
          </Box>
        </Link>
        <Box mt="0.5rem">
          <HStack ml="0.3rem" position="relative" bottom="1rem">
            <Text fontSize="1.1rem" fontWeight="500">
              Employés
            </Text>
            <Box position="relative" bottom="0.3rem">
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text fontSize="1.1rem" fontWeight="500">
              {" "}
              {employee?.firstName} {employee?.lastName}
            </Text>
            <Box position="relative" bottom="0.3rem">
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text fontSize="1.1rem" fontWeight="500">
              Fiche de paye
            </Text>
            <Box position="relative" bottom="0.3rem">
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text fontSize="1.1rem" fontWeight="500">
              Parametres
            </Text>
          </HStack>
        </Box>
      </HStack>

      <Tabs colorScheme="yellow">
        <TabList gap="20rem">
          <Tab>Remuneration</Tab>
          <Tab>Deductions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <PayrollEmployeeProfileList
              employeeID={employee._id}
              type="EARNING"
            />
          </TabPanel>
          <TabPanel px={0}>
            <PayrollEmployeeProfileList
              employeeID={employee._id}
              type="DEDUCTION"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

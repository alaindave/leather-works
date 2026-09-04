import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import PayrollComponentList from "../components/PayrollComponentList";
import PayrollDefaults from "./PayrollDefaultsPage";
import { Link } from "react-router-dom";

const PayrollSettingsPage = () => {
  return (
    <Box>
      <HStack mt="1.2rem">
        <Link
          to={{
            pathname: `/employees_admin/payroll`,
          }}
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
        <Box>
          <HStack ml="0.3rem" position="relative" bottom="1rem">
            <Text fontSize="1.1rem" fontWeight="500">
              Fiches de paye
            </Text>
            <Box>
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text fontSize="1.1rem" fontWeight="500">
              Paramètres
            </Text>
          </HStack>
        </Box>
      </HStack>

      <Tabs colorScheme="yellow">
        <TabList>
          <Tab>Remuneration</Tab>
          <Tab>Deductions</Tab>
          <Tab>Paramètres</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <PayrollComponentList type="EARNING" showTaxable />
          </TabPanel>

          <TabPanel px={0}>
            <PayrollComponentList type="DEDUCTION" showTaxable={false} />
          </TabPanel>

          <TabPanel px={0}>
            <PayrollDefaults />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PayrollSettingsPage;

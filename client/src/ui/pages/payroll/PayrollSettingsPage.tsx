import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from "@chakra-ui/react";

import PayrollComponentList from "./PayrollComponentList";
import PayrollDefaults from "./PayrollDefaults";

export default function PayrollSettingsPage() {
  return (
    <Box p={6}>
      <Heading mb={6}>Parametres-Fiche de paye</Heading>

      <Tabs colorScheme="yellow">
        <TabList>
          <Tab>Remuneration</Tab>
          <Tab>Deductions</Tab>
          <Tab>Parametres</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <PayrollComponentList type="EARNING" />
          </TabPanel>

          <TabPanel px={0}>
            <PayrollComponentList type="DEDUCTION" />
          </TabPanel>

          <TabPanel px={0}>
            <PayrollDefaults />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

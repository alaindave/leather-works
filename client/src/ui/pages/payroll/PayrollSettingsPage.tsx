import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import PayrollComponentList from "./PayrollComponentList";
import PayrollDefaults from "./PayrollDefaults";

const PayrollSettingsPage = () => {
  return (
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
  );
};

export default PayrollSettingsPage;

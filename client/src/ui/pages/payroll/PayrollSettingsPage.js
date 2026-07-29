import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import PayrollComponentList from "./PayrollComponentList";
import PayrollDefaults from "./PayrollDefaults";
const PayrollSettingsPage = () => {
    return (_jsxs(Tabs, { colorScheme: "yellow", children: [_jsxs(TabList, { children: [_jsx(Tab, { children: "Remuneration" }), _jsx(Tab, { children: "Deductions" }), _jsx(Tab, { children: "Parametres" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { px: 0, children: _jsx(PayrollComponentList, { type: "EARNING" }) }), _jsx(TabPanel, { px: 0, children: _jsx(PayrollComponentList, { type: "DEDUCTION" }) }), _jsx(TabPanel, { px: 0, children: _jsx(PayrollDefaults, {}) })] })] }));
};
export default PayrollSettingsPage;

import { jsx as _jsx } from "react/jsx-runtime";
import "./styles/App.css";
import { Box, Flex } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
    return (_jsx(Flex, { margin: "0", minHeight: "100vh", bgGradient: "radial(#47370b, #061962)", direction: "column", align: "center", justify: "center", height: "100vh", children: _jsx(Box, { children: _jsx(LoginPage, {}) }) }));
}
export default App;

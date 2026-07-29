import { jsx as _jsx } from "react/jsx-runtime";
import { Text, Flex } from "@chakra-ui/react";
const PageErrorFallback = () => {
    return (_jsx(Flex, { h: "100vh", justify: "center", align: "center", children: _jsx(Text, { position: "relative", left: "15rem", color: "red.400", fontWeight: "500", fontSize: "1.4rem", children: "Une erreur est survenue. Veuillez contacter ADB Tech." }) }));
};
export default PageErrorFallback;

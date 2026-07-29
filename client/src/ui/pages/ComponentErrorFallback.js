import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from "@chakra-ui/react";
const ComponentErrorFallback = () => {
    return (_jsx(Text, { color: "red.600", mt: "1rem", mr: "2rem", fontSize: "1.3rem", children: "Une erreur est survenue. Veuillez contacter ADB Tech." }));
};
export default ComponentErrorFallback;

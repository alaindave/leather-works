import { jsx as _jsx } from "react/jsx-runtime";
import { ChakraProvider } from "@chakra-ui/react";
export function Provider({ children }) {
    return _jsx(ChakraProvider, { children: children });
}

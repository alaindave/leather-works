import { jsx as _jsx } from "react/jsx-runtime";
import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes.js";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(ChakraProvider, { children: _jsx(RouterProvider, { router: router }) }) }));

import "./css/App.css";
import { Box, Flex } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import React from "react";

function App() {
  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      <Box>
        <LoginPage />
      </Box>
    </Flex>
  );
}

export default App;

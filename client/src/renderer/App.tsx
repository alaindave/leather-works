import { useEffect } from "react";
import { initializeRendererSync } from "./services/syncManager.service";
import "./styles/App.css";
import { Box, Flex } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";

function App() {
  useEffect(() => {
    initializeRendererSync();
  }, []);

  return (
    <Flex
      w="100%"
      minH="100vh"
      bgGradient="linear(to-br, #1E3A5F, #0078D4)"
      direction="column"
      align="center"
      justify="center"
      px={{ base: 4, sm: 6, md: 8 }}
      py={{ base: 4, md: 6 }}
      overflow="auto"
    >
      <Box w="100%" maxW="1400px" minW={0}>
        <LoginPage />
      </Box>
    </Flex>
  );
}

export default App;

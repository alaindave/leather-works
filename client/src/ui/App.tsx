import "./styles/App.css";
import { Box, Flex } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Flex
      margin="0"
      minHeight="100vh"
      bgGradient="linear(to-br, #1E3A5F, #0078D4)"
      direction="column"
      align="center"
      justify="center"
      height="100vh"
    >
      <Box>
        <LoginPage />
      </Box>
    </Flex>
  );
}

export default App;

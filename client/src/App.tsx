import "./styles/App.css";
import { Box, Flex } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";

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

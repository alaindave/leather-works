import "./App.css";

import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="login-form"
      height="100vh"
    >
      <Box>
        <LoginPage />
      </Box>

      <Box pos="absolute" bottom="25px">
        <Footer />
      </Box>
    </Flex>
  );
}

export default App;

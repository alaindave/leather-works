import "./css/App.css";
import { Box, Flex, Image } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import logo from "../src/assets/afritan-logo.png";

function App() {
  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      <Box>
        <LoginPage />
      </Box>

      <Box className="login_footer">
        <Footer />
      </Box>
    </Flex>
  );
}

export default App;

import { Box, Flex, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react/button";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const AdminPage = () => {
  return (
    <Flex direction="column" height="100vh" align="center">
      <VStack position="relative" top="250px" spacing="30px">
        <Link to="/employees_admin">
          <Button fontSize="50px" width="300px" padding="10px" height="80px">
            Personnel
          </Button>
        </Link>

        <Link to="admin/stock">
          <Button fontSize="50px" width="300px" height="80px">
            Stock
          </Button>
        </Link>
      </VStack>
      <Box position="absolute" bottom="10px">
        <Footer />
      </Box>
    </Flex>
  );
};

export default AdminPage;

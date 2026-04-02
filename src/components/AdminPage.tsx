import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react/button";
import React from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <Flex direction="column" height="100vh" align="center" justify="center">
      <Box marginBottom="60px">
        <Link to="/personnel">
          <Button fontSize="50px" width="300px" padding="10px" height="80px">
            Personnel
          </Button>
        </Link>
      </Box>
      <Box>
        <Link to="/stock">
          <Button fontSize="50px" width="300px" height="80px">
            Stock
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default AdminPage;

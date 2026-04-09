import { Box, Flex, VStack, Image } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react/button";
import { Link } from "react-router-dom";
import logo from "../assets/afritan-logo.png";

const AdminPage = () => {
  return (
    <>
      <Image src={logo} position="relative" left="30px" top="30px" />
      <Flex direction="column" height="100vh" align="center">
        <VStack position="relative" top="200px" spacing="35px">
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
      </Flex>
    </>
  );
};

export default AdminPage;

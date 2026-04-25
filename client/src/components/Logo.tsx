import { Box, Flex, Image, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import "../styles/App.css";

const Logo = () => {
  return (
    <Flex>
      <Box>
        <Link to="/admin">
          <Image src={logo} boxSize="70px" borderRadius="30px" />
        </Link>
      </Box>
      <Box marginLeft="8px">
        <Text color="#F2B705" fontSize="25px" fontWeight="700">
          AFRITAN
        </Text>
        <Text
          position="relative"
          bottom="25px"
          fontSize="16px"
          fontWeight="500"
        >
          Gestion du personnel
        </Text>
      </Box>
    </Flex>
  );
};

export default Logo;

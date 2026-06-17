import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import "../styles/App.css";

interface Props {
  text: string;
}

const Logo = ({ text }: Props) => {
  return (
    <Flex>
      <Box>
        <Link to="/admin">
          <Image src={logo} boxSize="70px" borderRadius="30px" />
        </Link>
      </Box>
      <Box marginLeft="10px">
        <Text color="#F2B705" fontSize="25px" fontWeight="700">
          AFRITAN
        </Text>
        <Text
          position="relative"
          bottom="25px"
          fontSize="0.75rem"
          fontWeight="500"
          color="#ffffff"
        >
          {text}
        </Text>
      </Box>
    </Flex>
  );
};

export default Logo;

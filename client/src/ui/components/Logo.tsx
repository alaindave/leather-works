import { Box, Flex, Image, VStack, Text } from "@chakra-ui/react";
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
      <Box marginLeft="8px">
        <Text color="#1F2937" fontSize="25px" fontWeight="700">
          AFRITAN
        </Text>
        <Text
          position="relative"
          bottom="1.5rem"
          fontSize="1rem"
          fontWeight="500"
          color="#1F2937"
        >
          {text}
        </Text>
      </Box>
    </Flex>
  );
};

export default Logo;

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
          <Image src={logo} width="5rem" height="5rem" />
        </Link>
      </Box>
      <Box position="relative" left="0.4rem" top="0.3rem">
        <Text color="#1F2937" fontSize="25px" fontWeight="700">
          AFRITAN
        </Text>
        <Text
          position="relative"
          left="0.1rem"
          bottom="1.5rem"
          fontSize="0.92rem"
          color="gray.900"
          fontWeight="500"
          whiteSpace="nowrap"
        >
          {text}
        </Text>
      </Box>
    </Flex>
  );
};

export default Logo;

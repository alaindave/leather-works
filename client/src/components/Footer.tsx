import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Box>
      <Text fontWeight="700" fontSize="30px" color="#c9990a ">
        Powered by{" "}
        <span style={{ fontSize: "20px", color: "#c9990a", fontWeight: "500" }}>
          ADB Tech{" "}
        </span>
      </Text>
    </Box>
  );
};

export default Footer;

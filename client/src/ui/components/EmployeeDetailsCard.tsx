import { Box, Flex, Icon as ChakraIcon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  property: string;
  value?: string | number | null;
  icon: IconType;
}

const EmployeeDetailsCard = ({ property, value, icon }: Props) => {
  return (
    <Flex
      align="center"
      gap={4}
      mb={3}
      p={4}
      w="100%"
      minH="4rem"
      maxH="6rem"
      bg="#F8F9FB"
      borderRadius="12px"
      borderWidth="2px"
      borderColor="gray.200"
    >
      <Box
        p={3}
        borderWidth="2px"
        borderRadius="full"
        borderColor="purple.400"
        bg="rgba(242,183,5,0.08)"
        flexShrink={0}
        height="2.2rem"
        width="2.2rem"
        position="relative"
      >
        <ChakraIcon
          as={icon}
          color="purple.600"
          fontSize="1.3rem"
          position="relative"
          bottom="0.6rem"
          right="0.4rem"
        />
      </Box>

      <Box flex="1" minW={0} ml="0.3rem" mt="1.5rem">
        <Text
          color="gray.700"
          fontWeight="700"
          fontSize={{ base: "md", md: "lg", lg: "lg" }}
        >
          {property}
        </Text>

        <Text
          color="gray.600"
          fontSize={{ base: "md", md: "lg" }}
          wordBreak="break-word"
          position="relative"
          bottom="0.8rem"
        >
          {value || "N.D."}
          {property === "Salaire" ? " FBU" : ""}
        </Text>
      </Box>
    </Flex>
  );
};

export default EmployeeDetailsCard;

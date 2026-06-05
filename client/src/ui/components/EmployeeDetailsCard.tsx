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
      bg="#0E1E47"
      borderRadius="12px"
      borderWidth="1px"
      borderColor="gray.600"
    >
      <Box p={3} borderRadius="full" bg="rgba(242,183,5,0.08)" flexShrink={0}>
        <ChakraIcon as={icon} color="#F2B705" boxSize={{ base: 5, md: 6 }} />
      </Box>

      <Box flex="1" minW={0} ml="0.3rem" mt="1.5rem">
        <Text
          color="#C7D2FE"
          fontWeight="700"
          fontSize={{ base: "md", md: "lg", lg: "lg" }}
        >
          {property}
        </Text>

        <Text
          color="gray.300"
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

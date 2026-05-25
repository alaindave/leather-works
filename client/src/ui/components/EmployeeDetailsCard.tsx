import { VStack, Text, Box, HStack, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

interface Props {
  property: string;
  value?: string | null;
  icon: IconType;
}

const EmployeeDetailsCard = ({ property, value, icon: Icon }: Props) => {
  return (
    <HStack
      marginBottom="5px"
      borderRadius="6px"
      bg="#0E1E47"
      width="47vw"
      height="90px"
      borderWidth="0.5px"
      borderColor="gray.600"
    >
      <Box
        borderWidth="0.5px"
        borderRadius="20px"
        padding="8px"
        marginBottom="8px"
      >
        <Icon color="#F2B705" size="1.2rem" />
      </Box>

      <HStack marginLeft="4px">
        <Text color="#C7D2FE" fontWeight="700" fontSize="1.3rem">
          {property}:
        </Text>
        <Text color="gray.300" fontSize="1.2rem">
          {value} {""}
          {property === "Salaire" ? "FBU" : ""}
        </Text>
      </HStack>
    </HStack>
  );
};

export default EmployeeDetailsCard;

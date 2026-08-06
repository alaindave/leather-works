import { HStack, Text, Icon as ChakraIcon, Box } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { formatCurrency } from "../../util/currencyFormatter";

interface Props {
  itemName: string;
  amount: number;
  icon: IconType;
  color: string;
}

const PayslipCardDisplay = ({ itemName, amount, color, icon }: Props) => {
  const cardBgColor = `${color}.50`;
  const iconBgColor = `${color}.100`;
  const iconColor = `${color}.600`;

  return (
    <HStack height="100px" width="300px" bg={cardBgColor} mt="1rem">
      <Box
        ml="0.5rem"
        height="3rem"
        width="3rem"
        borderRadius="1.5rem"
        bg={iconBgColor}
      >
        <ChakraIcon
          as={icon}
          color={iconColor}
          fontSize="1.8rem"
          position="relative"
          left="0.5rem"
          top="0.5rem"
        />
      </Box>

      <Box ml="0.2rem">
        <Text fontSize="0.9rem" fontWeight="500">
          {itemName}
        </Text>
        <Text fontSize="1.1rem" fontWeight="600">
          {formatCurrency(amount)}
        </Text>
      </Box>
    </HStack>
  );
};

export default PayslipCardDisplay;

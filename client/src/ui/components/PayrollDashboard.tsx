import { Box, Card, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { BsFillPeopleFill } from "react-icons/bs";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";

import { MdCoPresent } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { formatCurrency } from "../util/currencyFormatter";

interface Props {
  employeeCount: number;
  totalEarnings: number;
  totalDeductions: number;
}

const PayrollDashboard = ({
  employeeCount,
  totalEarnings,
  totalDeductions,
}: Props) => {
  return (
    <Flex justify="space-evenly" width="100%">
      <Box
        bg="linear-gradient(
          135deg,
          rgba(255,255,255,0.08),
          rgba(255,255,255,0.03)
        )"
        border="1px solid rgba(255,255,255,0.12)"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        borderRadius="0.4rem"
        width="12rem"
        height="8rem"
      >
        <HStack position="relative" top="2rem">
          <Box
            width="2.2rem"
            height="2.2rem"
            backgroundColor="#000080"
            borderRadius="10px"
            padding="8px"
            marginLeft="8px"
          >
            <BsFillPeopleFill color="#ffffff" size="1.2rem" />
          </Box>

          <Text
            color="gray.700"
            fontSize="1.3rem"
            fontWeight="700"
            position="relative"
            left="1rem"
          >
            Employés
          </Text>
        </HStack>

        <Text
          color="gray.600"
          fontSize="1.1rem"
          position="relative"
          left="5.5rem"
          top="1.8rem"
          fontWeight="700"
        >
          {employeeCount}
        </Text>
      </Box>

      <Box
        bg="linear-gradient(
        135deg,
        rgba(255,255,255,0.08),
        rgba(255,255,255,0.03)
      )"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        padding="32px"
        borderRadius="0.4rem"
        width="15rem"
        height="8rem"
      >
        <HStack>
          <Box
            width="2.2rem"
            height="2.2rem"
            backgroundColor=" #16833e"
            borderRadius="10px"
            padding="8px"
            position="relative"
            right="1.3rem"
          >
            <IoWalletOutline color="#ffffff" size="1.2rem" />
          </Box>
          <Text
            color="gray.700"
            fontSize="1.3rem"
            fontWeight="700"
            position="relative"
            left="0.1rem"
            right="1.5rem"
          >
            Remunerations
          </Text>
        </HStack>
        <Text
          color="gray.600"
          fontSize="1.1rem"
          position="relative"
          left="3.5rem"
          fontWeight="700"
        >
          {formatCurrency(totalEarnings)}
        </Text>
      </Box>
      <Box
        bg="linear-gradient(
          135deg,
          rgba(255,255,255,0.08),
          rgba(255,255,255,0.03)
        )"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        padding="30px"
        borderRadius="0.4rem"
        width="13rem"
        height="8rem"
      >
        <HStack>
          <Box
            width="2.2rem"
            height="2.2rem"
            backgroundColor="red.500"
            borderRadius="10px"
            padding="8px"
            position="relative"
            right="1rem"
          >
            <FaRegArrowAltCircleDown color="#ffffff" size="1.2rem" />
          </Box>
          <Text
            color="gray.700"
            fontWeight="700"
            fontSize="1.3rem"
            marginLeft="0.8rem"
            position="relative"
            right="1.5rem"
          >
            Deductions
          </Text>
        </HStack>
        <Text
          color="gray.600"
          fontSize="1.1rem"
          position="relative"
          left="3rem"
          fontWeight="700"
        >
          {formatCurrency(totalDeductions)}
        </Text>
      </Box>
      <Box
        bg="linear-gradient(
          135deg,
          rgba(255,255,255,0.08),
          rgba(255,255,255,0.03)
        )"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        padding="30px"
        borderRadius="0.4rem"
        width="13rem"
        height="8rem"
      >
        <HStack>
          <Box
            width="2.2rem"
            height="2.2rem"
            borderRadius="10px"
            padding="8px"
            backgroundColor="blue.500"
            position="relative"
            right="1rem"
          >
            <FaRegCreditCard color="#ffffff" size="1.2rem" />
          </Box>
          <Text
            color="gray.700"
            fontWeight="700"
            fontSize="1.3rem"
            position="relative"
            left="1rem"
            right="1rem"
          >
            Net
          </Text>
        </HStack>
        <Text
          color="gray.600"
          fontSize="1.1rem"
          position="relative"
          left="3rem"
          fontWeight="700"
        >
          {formatCurrency(totalEarnings - totalDeductions)}
        </Text>
      </Box>
    </Flex>
  );
};

export default PayrollDashboard;

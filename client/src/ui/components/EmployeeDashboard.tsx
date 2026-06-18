import { Box, Card, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { BsFillPeopleFill } from "react-icons/bs";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";

import { MdCoPresent } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";

interface Props {
  employeeCount: number;
  attendanceCount: number;
  leaveCount: number;
  lateCount: number;
}

const EmployeeDashboard = ({
  employeeCount,
  attendanceCount,
  lateCount,
  leaveCount,
}: Props) => {
  return (
    <Flex justify="space-evenly">
    <Flex justify="space-evenly">
      <Box
        bg="linear-gradient(
          135deg,
          rgba(255,255,255,0.08),
          rgba(255,255,255,0.03)
        )"
        border="1px solid rgba(255,255,255,0.12)"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        borderRadius="24px"
        width="250px"
        height="150px"
        marginRight="5px"
      >
        <HStack position="relative" top="30px">
          <Box
            width="53px"
            height="53px"
            backgroundColor="#000080"
            borderRadius="10px"
            padding="8px"
            marginLeft="8px"
          >
            <BsFillPeopleFill color="#ffffff" size="33px" />
          </Box>

          <Text
            color="gray.700"
            fontSize="22px"
            fontWeight="700"
            marginLeft="15px"
          >
            Total
          </Text>
        </HStack>

        <Text
          color="black"
          fontSize="1.5rem"
          position="relative"
          left="95px"
          top="30px"
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
        borderRadius="24px"
        width="250px"
        height="150px"
        marginRight="5px"
      >
        <HStack>
          <Box
            width="53px"
            height="53px"
            backgroundColor=" #16833e"
            borderRadius="10px"
            padding="8px"
          >
            <MdCoPresent color="#ffffff" size="33px" />
          </Box>
          <Text
            color="gray.700"
            fontSize="22px"
            fontWeight="700"
            marginLeft="15px"
          >
            Présents
          </Text>
        </HStack>
        <Text
          color="black"
          fontSize="1.5rem"
          position="relative"
          left="100px"
          fontWeight="700"
        >
          {attendanceCount}
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
        borderRadius="20px"
        width="250px"
        height="150px"
        marginRight="5px"
      >
        <HStack>
          <Box
            width="53px"
            height="53px"
            backgroundColor="red.500"
            borderRadius="10px"
            padding="8px"
          >
            <FaRegClock color="#ffffff" size="33px" />
          </Box>
          <Text
            color="gray.700"
            fontWeight="700"
            fontSize="22px"
            marginLeft="15px"
          >
            Retards
          </Text>
        </HStack>
        <Text
          color="black"
          fontSize="1.5rem"
          position="relative"
          left="100px"
          fontWeight="700"
        >
          {lateCount}
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
        borderRadius="20px"
        width="250px"
        height="150px"
      >
        <HStack>
          <Box
            width="53px"
            height="53px"
            backgroundColor="blue.500"
            borderRadius="10px"
            padding="8px"
          >
            <CiCalendarDate color="#ffffff" size="33px" />
            <CiCalendarDate color="#ffffff" size="33px" />
          </Box>
          <Text
            color="gray.700"
            fontWeight="700"
            fontSize="22px"
            marginLeft="15px"
          >
            Congés
          </Text>
        </HStack>
        <Text
          color="black"
          fontSize="1.5rem"
          position="relative"
          left="100px"
          fontWeight="700"
        >
          {leaveCount}
        </Text>
      </Box>
    </Flex>
  );
};

export default EmployeeDashboard;

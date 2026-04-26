import { Box, Card, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdCoPresent } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";

interface Props {
  employeeCount: number;
  attendanceCount: number;
  leaveCount: number;
}

const EmployeeDashboard = ({
  employeeCount,
  attendanceCount,
  leaveCount,
}: Props) => {
  return (
    <Flex>
      <Card
        background="#0B1E3A"
        marginRight="5px"
        padding="32px"
        borderRadius="24px"
        width="300px"
        height="160px"
      >
        <HStack>
          <div
            style={{
              width: "53px",
              height: "53px",
              backgroundColor: "#000080",
              borderRadius: "10px",
              padding: "8px",
            }}
          >
            <BsFillPeopleFill color="#ffffff" size="33px" />
          </div>

          <Text
            color="#A9B4C2"
            fontSize="22px"
            fontWeight="700"
            marginLeft="15px"
          >
            Total
          </Text>
        </HStack>

        <Text
          color="#F5F7FA"
          position="relative"
          left="90px"
          fontSize="30px"
          fontWeight="700"
        >
          {employeeCount}
        </Text>
      </Card>
      <Card
        background="#0B1E3A"
        padding="32px"
        borderRadius="24px"
        width="300px"
        height="160px"
        marginRight="5px"
      >
        <HStack>
          <div
            style={{
              width: "53px",
              height: "53px",
              backgroundColor: " #16833e",
              borderRadius: "10px",
              padding: "8px",
            }}
          >
            <MdCoPresent color="#ffffff" size="33px" />
          </div>
          <Text
            color="#A9B4C2"
            fontSize="22px"
            fontWeight="700"
            marginLeft="15px"
          >
            Présents
          </Text>
        </HStack>
        <Text
          color="#F5F7FA"
          position="relative"
          left="100px"
          fontSize="30px"
          fontWeight="700"
        >
          {attendanceCount}
        </Text>
      </Card>
      <Card
        background="#0B1E3A"
        padding="30px"
        borderRadius="20px"
        width="300px"
        height="160px"
      >
        <HStack>
          <div
            style={{
              width: "53px",
              height: "53px",
              backgroundColor: "#FACC15",
              borderRadius: "10px",
              padding: "8px",
            }}
          >
            <FaRegClock color="#ffffff" size="33px" />
          </div>
          <Text color="#A9B4C2" fontWeight="700" marginLeft="15px">
            Congés
          </Text>
        </HStack>
        <Text
          color="#F5F7FA"
          position="relative"
          left="100px"
          fontSize="30px"
          fontWeight="700"
        >
          {leaveCount}
        </Text>
      </Card>
    </Flex>
  );
};

export default EmployeeDashboard;

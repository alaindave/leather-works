import { Box, Card, Divider, HStack, Text } from "@chakra-ui/react";

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
    <HStack>
      <Card
        background="#0B1E3A"
        marginRight="30px"
        padding="30px"
        borderRadius="20px"
      >
        <Text color="#A9B4C2" fontWeight="700" marginLeft="25px">
          Total des employés
        </Text>
        <Text color="#F5F7FA" position="relative" left="100px">
          {employeeCount}
        </Text>
      </Card>
      <Card
        background="#0B1E3A"
        marginRight="30px"
        padding="30px"
        borderRadius="20px"
        position="relative"
        right="38px"
      >
        <Text color="#A9B4C2" fontWeight="700" marginLeft="25px">
          Présents aujourd'hui
        </Text>
        <Text color="#F5F7FA" position="relative" left="100px">
          {attendanceCount}
        </Text>
      </Card>
      <Card
        background="#0B1E3A"
        marginRight="20px"
        padding="30px"
        borderRadius="20px"
        position="relative"
        right="73px"
      >
        <Text color="#A9B4C2" fontWeight="700">
          En Congés
        </Text>
        <Text color="#F5F7FA" position="relative" left="60px">
          {leaveCount}
        </Text>
      </Card>
    </HStack>
  );
};

export default EmployeeDashboard;

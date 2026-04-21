import { Box, Divider, HStack, Text } from "@chakra-ui/react";

interface Props {
  employeeCount: number;
  attendanceCount: number;
}

const EmployeeDashboard = ({ employeeCount, attendanceCount }: Props) => {
  return (
    <HStack bg=" #c39409" borderRadius="20px">
      <Box marginRight="30px" padding="20px">
        <Text color="#262626" fontWeight="700" marginLeft="25px">
          Employes
        </Text>
        <Text color="#220e0e" marginLeft="60px">
          {employeeCount}
        </Text>
      </Box>
      <Divider orientation="vertical" h="150px" borderColor="white" />
      <Box marginRight="30px" padding="20px">
        <Text color="#262626" fontWeight="700" marginLeft="25px">
          Presents
        </Text>
        <Text color="#220e0e" marginLeft="60px">
          {attendanceCount}
        </Text>
      </Box>
      <Divider orientation="vertical" h="150px" borderColor="white" />
      <Box marginRight="20px" padding="20px">
        <Text color="#262626" fontWeight="700" marginLeft="10px">
          Conges
        </Text>
        <Text color="#220e0e" marginLeft="45px">
          5
        </Text>
      </Box>
    </HStack>
  );
};

export default EmployeeDashboard;

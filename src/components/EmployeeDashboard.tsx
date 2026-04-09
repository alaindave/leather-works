import { Box, Divider, Flex, HStack, Text } from "@chakra-ui/react";

const EmployeeDashboard = () => {
  return (
    <HStack>
      <Box marginRight="30px" padding="20px">
        <Text>Nombres d'employes</Text>
        <Text marginLeft="100px">50</Text>
      </Box>
      <Divider orientation="vertical" h="150px" borderColor="white" />
      <Box marginRight="30px" padding="20px">
        <Text>Employes presents</Text>
        <Text marginLeft="90px">30</Text>
      </Box>
      <Divider orientation="vertical" h="150px" borderColor="white" />
      <Box marginRight="20px" padding="20px">
        <Text>Conges</Text>
        <Text marginLeft="30px">5</Text>
      </Box>
    </HStack>
  );
};

export default EmployeeDashboard;

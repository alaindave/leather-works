import { Box, Divider, HStack, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { IoStatsChart } from "react-icons/io5";

interface Props {
  onTaskCreate: () => void;
}

const QuickActions = ({ onTaskCreate }: Props) => {
  return (
    <Box
      bg="linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))"
      border="1px solid rgba(255,255,255,0.12)"
      boxShadow="0 2px 8px rgba(0,0,0,0.5)"
      borderRadius="md"
      w="full"
      maxW="1000px"
      height="110px"
      mx="auto"
      p={{ base: 2, md: 3 }}
    >
      <Text ml="0.2rem" mt="0.5rem" fontWeight="600">
        Actions rapides
      </Text>
      <HStack spacing={3}>
        <HStack flex="1" mb="0.7rem" onClick={onTaskCreate} cursor="pointer">
          <Box
            bg="blue.400"
            height="1.5rem"
            width="1.5rem"
            borderRadius="0.2rem"
            position="relative"
            left="0.2rem"
            bottom="0.5rem"
          >
            <Box mt="0.2rem" ml="0.25rem" color="#ffffff">
              <FaPlus />
            </Box>
          </Box>
          <Text fontWeight="600" fontSize="1rem">
            Creer une nouvelle tache
          </Text>
        </HStack>
        <Divider
          orientation="vertical"
          h="2.5rem"
          borderColor="gray.500"
          borderWidth="1px"
          position="relative"
          bottom="1rem"
        />
        <HStack flex="1" mb="0.7rem">
          <Box
            bg="green.400"
            height="1.5rem"
            width="1.7rem"
            borderRadius="0.2rem"
            position="relative"
            left="0.2rem"
            bottom="0.5rem"
          >
            <Box mt="0.2rem" ml="0.3rem" color="#ffffff">
              <FaSearch />
            </Box>
          </Box>
          <Text fontWeight="600" fontSize="1rem">
            Rechercher un employe
          </Text>
        </HStack>
        <Divider
          orientation="vertical"
          h="2.5rem"
          borderColor="gray.500"
          borderWidth="1px"
          position="relative"
          bottom="1rem"
        />

        <HStack flex="1" mb="0.7rem">
          <Box
            bg="purple.400"
            height="1.5rem"
            width="1.5rem"
            borderRadius="0.2rem"
            position="relative"
            left="0.2rem"
            bottom="0.5rem"
          >
            <Box mt="0.2rem" ml="0.25rem" color="#ffffff">
              <CiCalendarDate />
            </Box>
          </Box>
          <Text fontWeight="600" fontSize="1rem">
            Demande de conge
          </Text>
        </HStack>
        <Divider
          orientation="vertical"
          h="2.5rem"
          borderColor="gray.500"
          borderWidth="1px"
          position="relative"
          bottom="1rem"
        />
        <HStack flex="1" mb="0.7rem">
          <Box
            bg="orange.400"
            height="1.5rem"
            width="1.5rem"
            borderRadius="0.2rem"
            position="relative"
            left="0.2rem"
            bottom="0.5rem"
          >
            <Box mt="0.2rem" ml="0.25rem" color="#ffffff">
              <IoStatsChart />
            </Box>
          </Box>
          <Text fontWeight="600" fontSize="1rem">
            Generer un rapport
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default QuickActions;

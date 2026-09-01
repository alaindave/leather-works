import { Box, Divider, HStack, Text, Center } from "@chakra-ui/react";
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
      h="50px"
      maxW="1500px"
      mx="auto"
      p={2}
      ml="4rem"
    >
      <HStack spacing={5} align="center" h="full">
        {/* CREATE TASK */}
        <HStack
          flex="1"
          spacing={3}
          px={2}
          py={2}
          cursor="pointer"
          onClick={onTaskCreate}
          _hover={{ bg: "blackAlpha.100", borderRadius: "md" }}
        >
          <Center
            boxSize="1.8rem"
            bg="blue.400"
            color="white"
            borderRadius="md"
            flexShrink={0}
          >
            <FaPlus size={12} />
          </Center>

          <Text
            fontWeight="600"
            fontSize="0.95rem"
            whiteSpace={{ base: "normal", lg: "nowrap" }}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Créer une nouvelle tâche
          </Text>
        </HStack>

        {/* SEARCH EMPLOYEE */}
        <HStack
          flex="1"
          spacing={3}
          px={2}
          py={2}
          cursor="pointer"
          _hover={{ bg: "blackAlpha.100", borderRadius: "md" }}
        >
          <Center
            boxSize="1.8rem"
            bg="green.400"
            color="white"
            borderRadius="md"
            flexShrink={0}
          >
            <FaSearch size={12} />
          </Center>

          <Text
            fontWeight="600"
            fontSize="0.95rem"
            whiteSpace={{ base: "normal", lg: "nowrap" }}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Rechercher un employé
          </Text>
        </HStack>

        {/* LEAVE */}
        <HStack
          flex="1"
          spacing={3}
          px={2}
          py={2}
          cursor="pointer"
          _hover={{ bg: "blackAlpha.100", borderRadius: "md" }}
        >
          <Center
            boxSize="1.8rem"
            bg="purple.400"
            color="white"
            borderRadius="md"
            flexShrink={0}
          >
            <CiCalendarDate size={16} />
          </Center>

          <Text
            fontWeight="600"
            fontSize="0.95rem"
            whiteSpace={{ base: "normal", lg: "nowrap" }}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Demande de congé
          </Text>
        </HStack>

        {/* REPORT */}
        <HStack
          flex="1"
          spacing={3}
          px={2}
          py={2}
          cursor="pointer"
          _hover={{ bg: "blackAlpha.100", borderRadius: "md" }}
        >
          <Center
            boxSize="1.8rem"
            bg="orange.400"
            color="white"
            borderRadius="md"
            flexShrink={0}
          >
            <IoStatsChart size={14} />
          </Center>

          <Text
            fontWeight="600"
            fontSize="0.95rem"
            whiteSpace={{ base: "normal", lg: "nowrap" }}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Générer un rapport
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default QuickActions;

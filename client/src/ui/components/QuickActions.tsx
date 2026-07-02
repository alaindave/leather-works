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
      maxW="1000px"
      h="110px"
      mx="auto"
      p={3}
    >
      <Text fontWeight="600" mb={3}>
        Actions rapides
      </Text>

      <HStack spacing={0} align="center" h="full">
        {/* CREATE TASK */}
        <HStack
          flex="1"
          spacing={3}
          px={4}
          py={2}
          mb={5}
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
            mt={3}
          >
            Créer une nouvelle tâche
          </Text>
        </HStack>

        <Divider
          orientation="vertical"
          alignSelf="center"
          borderColor="gray.700"
          height="60%"
          mb={10}
        />

        {/* SEARCH EMPLOYEE */}
        <HStack
          flex="1"
          spacing={3}
          px={4}
          py={2}
          mb={5}
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
            mt={3}
          >
            Rechercher un employé
          </Text>
        </HStack>

        <Divider
          orientation="vertical"
          alignSelf="center"
          borderColor="gray.700"
          height="60%"
          mb={10}
        />

        {/* LEAVE */}
        <HStack
          flex="1"
          spacing={3}
          px={4}
          py={2}
          mb={5}
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
            mt={3}
          >
            Demande de congé
          </Text>
        </HStack>

        <Divider
          orientation="vertical"
          alignSelf="center"
          borderColor="gray.700"
          height="60%"
          mb={10}
        />

        {/* REPORT */}
        <HStack
          flex="1"
          spacing={3}
          px={4}
          py={2}
          mb={5}
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
            mt={3}
          >
            Générer un rapport
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default QuickActions;

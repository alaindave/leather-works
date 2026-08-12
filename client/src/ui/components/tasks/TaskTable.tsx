import {
  Badge,
  Box,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import Task from "../../../common/types/Task";
import { useNavigate } from "react-router-dom";

interface TaskTableProps {
  tasks: Pick<
    Task,
    | "_id"
    | "taskNumber"
    | "author"
    | "subject"
    | "priority"
    | "deadline"
    | "isResolved"
  >[];
}

const TaskTable = ({ tasks }: TaskTableProps) => {
  const navigate = useNavigate();
  const formatDeadline = (deadline: string | Date) => {
    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return "— - - -";
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "HAUTE":
        return "red";
      case "MOYENNE":
        return "orange";
      case "BASSE":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="sm"
      maxW="75vw"
    >
      <TableContainer>
        <Table variant="simple">
          <Thead position="sticky" top="0" bg="white" zIndex={1}>
            <Tr>
              <Th>Numero de tache</Th>
              <Th>Auteur</Th>
              <Th>Sujet</Th>
              <Th>Priorite</Th>
              <Th>Date limite</Th>
              <Th>Statut</Th>
            </Tr>
          </Thead>

          <Tbody>
            {tasks.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center" py={10}>
                  <Text color="gray.500" fontSize="sm">
                    Pas de taches a afficher
                  </Text>
                </Td>
              </Tr>
            ) : (
              tasks.map((task) => (
                <Tr
                  key={task._id}
                  _hover={{
                    bg: "gray.50",
                  }}
                  transition="background 0.15s ease"
                >
                  {/* Task Number */}
                  <Td>
                    <Text
                      maxW="200px"
                      fontSize="md"
                      fontWeight="600"
                      color="blue.600"
                      whiteSpace="normal"
                      onClick={() =>
                        navigate(`/employees_admin/tasks/details/${task._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {task.taskNumber}
                    </Text>
                  </Td>

                  {/* Author */}
                  <Td>
                    <Text fontSize="md" color="gray.700">
                      {task.author.firstName}
                      {""} {task.author.lastName}
                    </Text>
                  </Td>

                  {/* Subject */}
                  <Td maxW="320px">
                    <Text
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      noOfLines={2}
                      maxW="200px"
                      whiteSpace="normal"
                    >
                      {task.subject}
                    </Text>
                  </Td>

                  {/* Priority */}
                  <Td>
                    <Badge
                      colorScheme={getPriorityColor(task.priority)}
                      borderRadius="full"
                      px={2.5}
                      py={1}
                      fontSize="xs"
                      mb="1rem"
                    >
                      {task.priority}
                    </Badge>
                  </Td>

                  {/* Deadline */}
                  <Td>
                    <Text fontSize="md" color="gray.600">
                      {formatDeadline(task.deadline)}
                    </Text>
                  </Td>

                  {/* Status */}
                  <Td>
                    {task.isResolved ? (
                      <HStack spacing={2}>
                        <Badge
                          colorScheme="green"
                          borderRadius="full"
                          px={2.5}
                          py={1}
                          mb="1rem"
                        >
                          Resolue
                        </Badge>
                      </HStack>
                    ) : (
                      <HStack spacing={2}>
                        <Badge
                          colorScheme="orange"
                          borderRadius="full"
                          px={2.5}
                          py={1}
                          mb="1rem"
                        >
                          Ouverte
                        </Badge>
                      </HStack>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaskTable;

import { VStack, Text, Flex, Box, HStack } from "@chakra-ui/react";
import Task from "../../shared/types/Task";

interface Props {
  task: Task;
}

const TaskCard = ({ task }: Props) => {
  const taskMapping = (priority: string): string => {
    if (priority === "Haute") return "H";
    if (priority === "Moyenne") return "M";
    return "B";
  };

  return (
    <VStack
      border="1px solid black"
      borderRadius="0.4rem"
      mb="0.4rem"
      height="6rem"
      pb={2}
      borderColor="#D1D9E0"
      boxShadow="0 2px 8px rgba(1,0,1,1)"
      width="25rem"
      cursor="pointer"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
      }}
    >
      <Flex justify="space-between" width="25rem">
        <Text
          fontFamily="monospace"
          fontSize="1.1rem"
          fontWeight="800"
          mt="0.4rem"
          ml="0.4rem"
        >
          {task.taskNumber}
        </Text>
        <Text mt="0.4rem">{task.author.firstName}</Text>
        <Text fontSize="1.1rem" fontWeight="800" mt="0.3rem" mr="0.5rem">
          {taskMapping(task.priority)}
        </Text>
      </Flex>

      <Flex width="25rem" justifyContent="space-between">
        <Text ml="0.4rem" color="gray.700" fontSize="1.1rem" fontWeight="500">
          {task.subject}
        </Text>
        <Text mr="1rem">
          {new Date(task.deadline).toLocaleDateString("fr-FR")}
        </Text>
      </Flex>
    </VStack>
  );
};

export default TaskCard;

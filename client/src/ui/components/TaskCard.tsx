import { VStack, Text, Flex, Box, HStack } from "@chakra-ui/react";
import PopulatedTask from "../../shared/types/PopulatedTask";

interface Props {
  task: PopulatedTask;
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
      mb="0.2rem"
      height="8rem"
      borderColor="#D1D9E0"
      boxShadow="0 2px 8px rgba(1,0,1,1)"
      width="25rem"
    >
      <Flex justify="space-between" width="25rem">
        <Text fontWeight="800" mt="0.4rem" ml="0.4rem">
          {task.taskNumber}
        </Text>
        <Text fontSize="1.1rem" fontWeight="800" mt="0.3rem" mr="0.5rem">
          {taskMapping(task.priority)}
        </Text>
      </Flex>

      <Text
        color="gray.700"
        fontWeight="500"
        position="relative"
        bottom="0.3rem"
      >
        {task.subject}
      </Text>
      <Flex
        position="relative"
        bottom="0.3rem"
        width="25rem"
        justifyContent="space-between"
      >
        <Text ml="1rem">Ouvert par:{task.author.firstName}</Text>
        <Text mr="1rem">
          Date limite:{new Date(task.deadline).toLocaleDateString("fr-FR")}
        </Text>
      </Flex>
    </VStack>
  );
};

export default TaskCard;

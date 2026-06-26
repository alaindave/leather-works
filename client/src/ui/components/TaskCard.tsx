import { VStack, Text, HStack } from "@chakra-ui/react";
import PopulatedTask from "../../shared/types/PopulatedTask";

interface Props {
  task: PopulatedTask;
}

const TaskCard = ({ task }: Props) => {
  return (
    <VStack
      border="1px solid black"
      borderRadius="0.4rem"
      mb="0.2rem"
      height="8rem"
      borderColor="#D1D9E0"
      boxShadow="0 2px 8px rgba(1,0,1,1)"
    >
      <Text fontWeight="700" mt="0.4rem">
        {task.taskNumber}
      </Text>
      <Text position="relative" bottom="1.5rem">
        {task.subject}
      </Text>
      <HStack>
        <Text position="relative" bottom="1rem">
          Ouvert par:{task.author.firstName}
        </Text>
        <Text position="relative" bottom="1rem">
          /
        </Text>
        <Text position="relative" bottom="1rem">
          Date limite:{new Date(task.deadline).toLocaleDateString("fr-FR")}
        </Text>
      </HStack>
      <Text></Text>
    </VStack>
  );
};

export default TaskCard;

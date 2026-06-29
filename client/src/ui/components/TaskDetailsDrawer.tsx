import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiCalendar, FiCheckCircle, FiClock, FiUser } from "react-icons/fi";
import Task from "../../shared/types/Task";
import useAdminUser from "../../store/authStore";
import { useState } from "react";

interface Props {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsDrawer({ task, isOpen, onClose }: Props) {
  if (!task) return null;
  const user = useAdminUser((store) => store.adminUser);

  const handleTaskComment = async () => {
    console.log("Task ID:", task._id);
    console.log("author name:", user.firstName);
    console.log("comment:", comment);
    try {
      const result = await window.electron.taskComments.create({
        taskId: task._id,
        author: user._id,
        message: comment,
      });
      console.log("Comment submission result:", result);
    } catch (error) {
      console.error("An error occured during comment submission: ", error);
    }
  };

  const [comment, setComment] = useState("");

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" borderColor="gray.500">
          <VStack align="start" spacing={1} position="relative">
            <Text fontWeight="bold">{task.taskNumber}</Text>
            <Text
              color="gray.600"
              fontSize="l"
              position="relative"
              bottom="1.1rem"
            >
              {task.subject}
            </Text>
            <Text position="absolute" top="4rem" right="0.1rem">
              {task.author._id === user._id ? <Button>Resoudre</Button> : null}
            </Text>

            <HStack spacing={3} position="absolute" right="0.5rem">
              <Badge
                colorScheme={
                  task.priority === "Haute"
                    ? "red"
                    : task.priority === "Moyenne"
                    ? "orange"
                    : "green"
                }
              >
                {task.priority}
              </Badge>

              <Badge colorScheme={task.isResolved ? "green" : "yellow"}>
                {task.isResolved ? "Resolu" : "Ouvert"}
              </Badge>
            </HStack>
            <Flex width="20rem" justify="space-between">
              <Text
                position="relative"
                top="1.5rem"
                fontSize="0.93rem"
                color="gray.600"
              >
                Ouvert le:{" "}
                {new Date(task.submittedAt!).toLocaleDateString("fr-FR")}
              </Text>
              <Text
                position="relative"
                top="1.5rem"
                fontSize="0.93rem"
                color="gray.600"
              >
                Date limite:{" "}
                {new Date(task.deadline).toLocaleDateString("fr-FR")}
              </Text>
            </Flex>
          </VStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack align="stretch" spacing={6}>
            {/* Author */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Auteur
              </Text>

              <HStack>
                <Avatar
                  name={`${task.author.firstName} ${task.author.lastName}`}
                  size="sm"
                />

                <Box>
                  <Text fontWeight="medium" mt="0.7rem">
                    {task.author.firstName} {task.author.lastName}
                  </Text>
                </Box>
              </HStack>
            </Box>

            <Divider borderColor="gray.500" />

            {/* Recipients */}
            <Box>
              <Text fontWeight="bold" mb={3}>
                Destinataires
              </Text>

              <Stack spacing={3}>
                {task.recipients.map((user) => (
                  <HStack key={user._id}>
                    <Avatar
                      size="sm"
                      name={`${user.firstName} ${user.lastName}`}
                    />

                    <Box ml="0.1rem">
                      <Text position="relative" top="0.4rem">
                        {user.firstName} {user.lastName}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </Stack>
            </Box>

            <Divider borderColor="gray.500" />

            {/* Description */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Description
              </Text>

              <Text whiteSpace="pre-wrap">{task.message}</Text>
            </Box>

            <Box>
              <VStack align="stretch" spacing={3}>
                {task.isResolved && (
                  <>
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" />
                      <Text>Resolu le {task.resolvedAt}</Text>
                    </HStack>

                    {task.resolvedBy && (
                      <HStack>
                        <Icon as={FiUser} />

                        <Text>
                          {task.resolvedBy.firstName} {task.resolvedBy.lastName}
                        </Text>
                      </HStack>
                    )}

                    {task.resolutionNotes && (
                      <Box p={3} bg="gray.50" rounded="md">
                        <Text fontWeight="bold" mb={1}>
                          Notes de resolution
                        </Text>

                        <Text>{task.resolutionNotes}</Text>
                      </Box>
                    )}
                  </>
                )}
              </VStack>
            </Box>

            <Divider borderColor="gray.500" />

            {/* Comments */}
            <Box>
              <Text fontWeight="bold" mb={4}>
                Commentaires ({task.comments?.length ?? 0})
              </Text>

              <Stack spacing={4}>
                {task.comments?.map((comment) => (
                  <Box key={comment._id} borderWidth="1px" rounded="md" p={3}>
                    <HStack mb={2}>
                      <Avatar
                        size="sm"
                        name={`${comment.author.firstName} ${comment.author.lastName}`}
                      />

                      <Box
                        flex={1}
                        position="relative"
                        top="1rem"
                        left="0.2rem"
                      >
                        <Text fontWeight="semibold">
                          {comment.author.firstName} {comment.author.lastName}
                        </Text>

                        <Text
                          position="relative"
                          bottom="1.1rem"
                          fontSize="0.92rem"
                          color="gray.500"
                        >
                          {comment.createdAt}
                        </Text>
                      </Box>
                    </HStack>

                    <Text ml="2.5rem" whiteSpace="pre-wrap">
                      {comment.message}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <HStack w="100%">
            <Textarea
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button colorScheme="blue" onClick={handleTaskComment}>
              Commenter
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

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
import { FiCheckCircle, FiUser } from "react-icons/fi";
import Task from "../../shared/types/Task";
import useAdminUser from "../../store/auth.store";
import useTaskStore from "../../store/task.store";
import { useState } from "react";
import TaskResolutionPopover from "./TaskResolutionPopover";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";

interface Props {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function TaskDetailsDrawer({
  task,
  isOpen,
  onClose,
  onRefresh,
}: Props) {
  if (!task) return null;
  const author = useAdminUser((store) => store.adminUser);
  const addComment = useTaskStore((store: any) => store.addComment);
  const _task = useTaskStore((s) => s.tasks.find((t) => t._id === task._id));
  const [comment, setComment] = useState("");

  console.log("Fetched task from store:", _task);

  const handleTaskComment = async () => {
    if (!comment.trim()) return;
    await addComment(task._id, author, comment);
    onRefresh?.();
    setComment("");
  };
  const handleResolution = async (
    notes: string | undefined
  ): Promise<boolean> => {
    console.log("Resolution notes to submit:", notes);
    const resolvedBy = `${author.firstName} ${author.lastName}`;

    const updatedTask: Task = {
      ...task,
      isResolved: 1,
      resolutionNotes: notes,
      resolvedAt: new Date().toISOString(),
      resolvedBy,
    };
    console.log("Task to update", updatedTask);
    try {
      const result = await window.electron.tasks.update(updatedTask);
      console.log("Task update result", result);
      onRefresh?.();
      return true;
    } catch (error) {
      console.error("An error occured during task update:", error);
      return false;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" borderColor="gray.500">
          <VStack align="start" spacing={1} position="relative">
            <Flex justify="space-between">
              <Box>
                <HStack>
                  <Text fontWeight="bold" fontFamily="monospace">
                    {task.taskNumber}
                  </Text>
                  <Badge
                    colorScheme={task.isResolved ? "green" : "yellow"}
                    mb="1rem"
                    ml="2rem"
                  >
                    {task.isResolved ? "Resolue" : "Ouverte"}
                  </Badge>
                </HStack>
                <HStack position="relative" bottom="1rem">
                  <Avatar
                    size="sm"
                    name={`${task.author.firstName} ${task.author.lastName}`}
                  />
                  <Box ml="0.1rem">
                    <Text position="relative" top="0.4rem" fontSize="1.1rem">
                      {task.author.firstName} {task.author.lastName}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {!task.isResolved && (
                <Box position="absolute" right="0.2rem">
                  <TaskResolutionPopover onSubmit={handleResolution} />
                </Box>
              )}
            </Flex>

            {/* Details */}
            <Flex
              bg="gray.100"
              borderRadius="0.4rem"
              height="4.5rem"
              width="42vw"
              justify="space-between"
              mt="0.2rem"
            >
              <HStack ml="3rem" position="relative" top="0.6rem">
                <Box
                  position="relative"
                  right="0.3rem"
                  bottom="0.8rem"
                  fontSize="1.7rem"
                  color="blue.500"
                >
                  <CiCalendarDate />
                </Box>
                <Box>
                  <Text mt="0.3rem" fontSize="0.93rem" color="gray.600">
                    Ouverte le
                  </Text>
                  <Text
                    position="relative"
                    bottom="0.98rem"
                    fontSize="0.98rem"
                    color="gray.600"
                  >
                    {new Date(task.submittedAt!).toLocaleDateString("fr-FR")}
                  </Text>
                </Box>
              </HStack>
              <HStack position="relative" top="0.6rem">
                <Box
                  fontSize="1.6rem"
                  mr="0.3rem"
                  position="relative"
                  right="0.3rem"
                  bottom="0.8rem"
                  color="blue.500"
                >
                  <CiClock2 />
                </Box>
                <Box mr="3rem">
                  <Text fontSize="0.94rem" color="gray.600" mt="0.3rem">
                    Date limite
                  </Text>
                  <Text
                    position="relative"
                    bottom="1.1rem"
                    fontSize="0.95rem"
                    color="gray.600"
                  >
                    {new Date(task.deadline).toLocaleDateString("fr-FR")}
                  </Text>
                </Box>
              </HStack>
            </Flex>
            <Flex width="42vw" justify="space-between">
              <Box>
                <Text
                  mt="1rem"
                  whiteSpace="pre-wrap"
                  fontSize="1.18rem"
                  color="gray.900"
                >
                  {task.subject}
                </Text>
                <Text
                  position="relative"
                  bottom="0.3rem"
                  fontSize="1.1rem"
                  fontWeight="300"
                  color="black"
                  fontFamily="system-ui"
                >
                  {task.message}
                </Text>
              </Box>
            </Flex>
          </VStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack align="stretch" spacing={1}>
            {/* Recipients */}
            <Box>
              <Text fontWeight="bold" mb={3} fontSize="1.2rem">
                Destinataires
              </Text>

              <Stack spacing={3}>
                {task.recipients?.map((user) => (
                  <HStack key={user._id}>
                    <Avatar
                      size="sm"
                      name={`${user.firstName} ${user.lastName}`}
                    />

                    <Box ml="0.1rem">
                      <Text position="relative" top="0.4rem" fontSize="1.1rem">
                        {user.firstName} {user.lastName}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </Stack>
            </Box>
            {task.isResolved && (
              <Box>
                <Divider borderColor="gray.500" />
                <VStack align="stretch" spacing={3}>
                  <>
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" />
                      <Box>
                        <Text position="relative" top="1rem">
                          Resolue le{" "}
                        </Text>
                        <Text>
                          {new Date(task.resolvedAt!)
                            .toLocaleString("fr-FR")
                            .replaceAll(" ", " à ")}
                        </Text>
                      </Box>
                    </HStack>

                    {task.resolvedBy && (
                      <HStack>
                        <Icon as={FiUser} />

                        <Text position="relative" top="0.4rem">
                          par {task.resolvedBy}
                        </Text>
                      </HStack>
                    )}

                    {task.resolutionNotes && (
                      <Box p={3} bg="gray.100" rounded="md">
                        <Text fontWeight="bold" mb={1}>
                          Notes de resolution
                        </Text>

                        <Text fontFamily="mono">{task.resolutionNotes}</Text>
                      </Box>
                    )}
                  </>
                </VStack>
              </Box>
            )}

            <Divider borderColor="gray.500" />

            {/* Comments */}
            <Box>
              <Text fontWeight="bold" mb={4}>
                Commentaires ({_task?.comments?.length ?? 0})
              </Text>

              <Stack spacing={4}>
                {_task?.comments?.map((comment) => (
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
                          {new Date(comment.createdAt!).toLocaleString(
                            "fr-FR",
                            {
                              timeZone: "Africa/Bujumbura",
                            }
                          )}
                        </Text>
                      </Box>
                    </HStack>

                    <Text
                      fontFamily="mono"
                      ml="2.5rem"
                      whiteSpace="pre-wrap"
                      position="relative"
                      bottom="0.6rem"
                    >
                      {comment.comment}
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
              placeholder="Ecrivez vos commentaires..."
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

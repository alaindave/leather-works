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
import Task from "../../../common/types/Task";
import useAdminUser from "../../../store/auth.store";
import useTaskStore from "../../../store/task.store";
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
  const author = useAdminUser((store) => store.adminUser);

  const addComment = useTaskStore((store: any) => store.addComment);

  const storeTask = useTaskStore((state) =>
    task ? state.tasks.find((t) => t._id === task._id) : undefined
  );

  const currentTask = storeTask ?? task;

  const [comment, setComment] = useState("");

  if (!currentTask) {
    return null;
  }

  console.log("CURRENT TASK FROM STORE:", currentTask);

  const handleTaskComment = async () => {
    if (!comment.trim()) {
      return;
    }
    try {
      await addComment(currentTask._id, author, comment);
      setComment("");
      onRefresh?.();
    } catch (error) {
      console.error("Failed to add task comment:", error);
    }
  };

  const handleResolution = async (
    notes: string | undefined
  ): Promise<boolean> => {
    if (!currentTask) {
      return false;
    }

    if (!author) {
      console.error("CANNOT RESOLVE TASK: ADMIN USER NOT AVAILABLE");

      return false;
    }
    const resolvedBy = `${author.firstName} ${author.lastName}`;

    const updatedTask: Task = {
      ...currentTask,
      isResolved: 1,
      resolutionNotes: notes,
      resolvedAt: new Date().toISOString(),
      resolvedBy,
    };

    console.log("TASK TO UPDATE:", updatedTask);

    try {
      const result = await window.electron.tasks.update(updatedTask);
      console.log("TASK UPDATE RESULT:", result);
      useTaskStore.setState((state) => ({
        tasks: state.tasks.map((existingTask) =>
          existingTask._id === updatedTask._id
            ? {
                ...existingTask,
                ...updatedTask,
              }
            : existingTask
        ),
      }));
      onRefresh?.();
      onClose();
      return true;
    } catch (error) {
      console.error("An error occurred during task update:", error);
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
                    {currentTask.taskNumber}
                  </Text>

                  <Badge
                    colorScheme={currentTask.isResolved ? "green" : "yellow"}
                    mb="1rem"
                    ml="2rem"
                  >
                    {currentTask.isResolved ? "Resolue" : "Ouverte"}
                  </Badge>
                </HStack>

                {/* Author */}
                <HStack position="relative" bottom="1rem">
                  <Avatar
                    size="sm"
                    name={`${currentTask.author.firstName} ${currentTask.author.lastName}`}
                  />

                  <Box ml="0.1rem">
                    <Text position="relative" top="0.4rem" fontSize="1.1rem">
                      {currentTask.author.firstName}{" "}
                      {currentTask.author.lastName}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Resolve button */}
              {!currentTask.isResolved && (
                <Box position="absolute" right="0.2rem">
                  <TaskResolutionPopover onSubmit={handleResolution} />
                </Box>
              )}
            </Flex>

            {/* =================================================
                DATES
            ================================================== */}

            <Flex
              bg="gray.100"
              borderRadius="0.4rem"
              height="4.5rem"
              width="42vw"
              justify="space-between"
              mt="0.2rem"
            >
              {/* Opened date */}
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
                  <HStack>
                    <Text
                      position="relative"
                      bottom="0.98rem"
                      fontSize="0.98rem"
                      color="gray.600"
                    >
                      {currentTask.submittedAt &&
                        new Date(currentTask.submittedAt).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                    </Text>
                    <Text
                      position="relative"
                      bottom="0.98rem"
                      fontSize="0.98rem"
                      color="gray.600"
                    >
                      {currentTask.submittedAt &&
                        new Date(currentTask?.submittedAt).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                    </Text>
                  </HStack>
                </Box>
              </HStack>

              {/* Deadline */}
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
                    {currentTask.deadline &&
                      new Date(currentTask.deadline).toLocaleDateString(
                        "fr-FR"
                      )}
                  </Text>
                </Box>
              </HStack>
            </Flex>

            {/* =================================================
                SUBJECT + MESSAGE
            ================================================== */}

            <Flex width="42vw" justify="space-between">
              <Box>
                <Text
                  mt="1rem"
                  whiteSpace="pre-wrap"
                  fontSize="1.18rem"
                  color="gray.900"
                >
                  {currentTask.subject}
                </Text>

                <Text
                  position="relative"
                  bottom="0.3rem"
                  fontSize="1.1rem"
                  fontWeight="300"
                  color="black"
                  fontFamily="system-ui"
                >
                  {currentTask.message}
                </Text>
              </Box>
            </Flex>
          </VStack>
        </DrawerHeader>

        {/* =====================================================
            BODY
        ====================================================== */}

        <DrawerBody>
          <VStack align="stretch" spacing={1}>
            {/* =================================================
                RECIPIENTS
            ================================================== */}

            <Box>
              <Text fontWeight="bold" mb={3} fontSize="1.2rem">
                Destinataires
              </Text>

              <Stack spacing={3}>
                {currentTask.recipients?.map((user) => (
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

            {/* =================================================
                RESOLUTION
            ================================================== */}

            {currentTask.isResolved && (
              <Box>
                <Divider borderColor="gray.500" />

                <VStack align="stretch" spacing={3}>
                  {/* Resolved date */}
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />

                    <Box>
                      <Text position="relative" top="1rem">
                        Resolue le
                      </Text>

                      <Text>
                        {currentTask.resolvedAt &&
                          new Date(currentTask.resolvedAt)
                            .toLocaleString("fr-FR")
                            .replaceAll(" ", " à ")}
                      </Text>
                    </Box>
                  </HStack>

                  {/* Resolved by */}
                  {currentTask.resolvedBy && (
                    <HStack>
                      <Icon as={FiUser} />

                      <Text position="relative" top="0.4rem">
                        par {currentTask.resolvedBy}
                      </Text>
                    </HStack>
                  )}

                  {/* Resolution notes */}
                  {currentTask.resolutionNotes && (
                    <Box p={3} bg="gray.100" rounded="md">
                      <Text fontWeight="bold" mb={1}>
                        Notes de resolution
                      </Text>

                      <Text fontFamily="mono">
                        {currentTask.resolutionNotes}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            )}

            <Divider borderColor="gray.500" />

            {/* =================================================
                COMMENTS
            ================================================== */}

            <Box>
              <Text fontWeight="bold" mb={4}>
                Commentaires ({currentTask.comments?.length ?? 0})
              </Text>

              <Stack spacing={4}>
                {currentTask.comments?.map((comment) => (
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
                          {comment.createdAt &&
                            new Date(comment.createdAt).toLocaleString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
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

        {/* =====================================================
            FOOTER / COMMENT INPUT
        ====================================================== */}

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

import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Task from "../../../common/types/Task";
import useAdminUser from "../../../store/auth.store";
import useTaskStore from "../../../store/task.store";
import TaskResolutionPopover from "./TaskResolutionPopover";

export default function TaskDetailsPage() {
  const { _id } = useParams();

  const [task, setTask] = useState<Task | null>(null);
  const [comment, setComment] = useState("");

  const author = useAdminUser((store) => store.adminUser);

  const addComment = useTaskStore((store: any) => store.addComment);

  const storeTask = useTaskStore((state) =>
    task ? state.tasks.find((t) => t._id === task._id) : undefined
  );

  const currentTask = storeTask ?? task;

  useEffect(() => {
    loadTask();
  }, [_id]);

  const loadTask = async () => {
    if (!_id) return;

    try {
      const result = await window.electron.tasks.getById(_id);

      if (!result) {
        setTask(null);
        return;
      }

      setTask(result);

      useTaskStore.setState((state) => ({
        tasks: state.tasks.map((existingTask) =>
          existingTask._id === result._id ? result : existingTask
        ),
      }));
    } catch (error) {
      console.error("AN ERROR OCCURED WHILE FETCHING TASK", error);
    }
  };

  const handleTaskComment = async () => {
    if (!comment.trim()) {
      return;
    }

    try {
      await addComment(currentTask?._id, author, comment);

      setComment("");

      await loadTask();
    } catch (error) {
      console.error("FAILED TO ADD TASK COMMENT:", error);
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

    try {
      await window.electron.tasks.update(updatedTask);

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

      await loadTask();

      return true;
    } catch (error) {
      console.error("AN ERROR OCCURED DURING TASK UPDATE:", error);

      return false;
    }
  };

  return (
    <Flex
      width="100%"
      height="93vh"
      minH={0}
      bg="gray.50"
      direction="column"
      overflow="hidden"
    >
      {/* =====================================================
          STICKY TOP BAR
      ====================================================== */}

      <Flex
        width="100%"
        height="68px"
        flexShrink={0}
        px={{ base: 4, md: 8 }}
        py={3}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
        justify="space-between"
        zIndex={10}
      >
        {/* LEFT
            Back + Task Number
        */}

        <HStack spacing={4}>
          <Link to="/employees_admin/tasks">
            <Button variant="ghost" size="sm" leftIcon={<FaArrowLeftLong />}>
              Retour
            </Button>
          </Link>

          <Divider orientation="vertical" height="28px" />

          <Text
            fontSize="lg"
            fontWeight="700"
            fontFamily="monospace"
            color="gray.800"
            mt="1rem"
          >
            {currentTask?.taskNumber}
          </Text>
        </HStack>

        {/* RIGHT
            Status + Resolve
        */}

        <HStack spacing={4}>
          <Badge
            colorScheme={currentTask?.isResolved ? "green" : "yellow"}
            borderRadius="full"
            px={4}
            py={1.5}
            fontSize="sm"
          >
            {currentTask?.isResolved ? "Résolue" : "Ouverte"}
          </Badge>

          {!currentTask?.isResolved && (
            <TaskResolutionPopover onSubmit={handleResolution} />
          )}
        </HStack>
      </Flex>

      {/* =====================================================
          SCROLLABLE CONTENT AREA
      ====================================================== */}

      <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" width="100%">
        <Box
          width="100%"
          maxW="850px"
          mx="auto"
          px={{ base: 5, md: 8 }}
          py={{ base: 8, md: 12 }}
        >
          <VStack align="stretch" spacing={8}>
            {/* =================================================
                AUTHOR
            ================================================== */}
            <Flex width="100%" justify="space-between">
              <Box>
                <Text fontSize="md" fontWeight="600" color="gray.500" mb={3}>
                  Auteur
                </Text>

                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    name={
                      currentTask?.author
                        ? `${currentTask.author.firstName} ${currentTask.author.lastName}`
                        : "Auteur"
                    }
                    position="relative"
                    bottom="0.3rem"
                  />

                  <Box>
                    <Text fontSize="md" fontWeight="600" color="gray.800">
                      {currentTask?.author
                        ? `${currentTask.author.firstName} ${currentTask.author.lastName}`
                        : "Auteur inconnu"}
                    </Text>

                    {currentTask?.submittedAt && (
                      <Text
                        position="relative"
                        bottom="1rem"
                        fontSize="sm"
                        color="gray.500"
                      >
                        {new Date(currentTask.submittedAt).toLocaleString(
                          "fr-FR"
                        )}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </Box>

              {/* <Divider /> */}

              {/* =================================================
                RECIPIENTS
            ================================================== */}

              <Box>
                <Text fontSize="md" fontWeight="600" color="gray.500" mb={3}>
                  Destinataires
                </Text>

                {currentTask?.recipients?.length ? (
                  <HStack spacing={3} flexWrap="wrap">
                    {currentTask?.recipients.map((user) => (
                      <HStack
                        key={user._id}
                        spacing={2}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="full"
                        px={3}
                        py={1.5}
                      >
                        <Avatar
                          size="xs"
                          name={`${user.firstName} ${user.lastName}`}
                        />

                        <Text
                          position="relative"
                          top="0.3rem"
                          fontSize="sm"
                          color="gray.700"
                        >
                          {user.firstName} {user.lastName}
                        </Text>
                      </HStack>
                    ))}
                  </HStack>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    Aucun destinataire.
                  </Text>
                )}
              </Box>
            </Flex>

            <Divider />

            {/* =================================================
                SUBJECT
            ================================================== */}

            <Box>
              <Text fontSize="md" fontWeight="600" color="gray.500" mb={2}>
                Sujet
              </Text>

              <Text
                fontSize={{
                  base: "xl",
                  md: "2xl",
                }}
                fontWeight="700"
                color="gray.900"
                lineHeight="1.3"
              >
                {currentTask?.subject}
              </Text>
            </Box>

            {/* =================================================
                MESSAGE
            ================================================== */}

            <Box>
              <Text fontSize="md" fontWeight="600" color="gray.500" mb={2}>
                Message
              </Text>

              <Text
                fontSize="md"
                color="gray.700"
                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {currentTask?.message}
              </Text>
            </Box>

            <Divider />

            {/* =================================================
                RESOLUTION
            ================================================== */}

            {currentTask?.isResolved && (
              <Box
                bg="green.50"
                border="1px solid"
                borderColor="green.200"
                borderRadius="lg"
                p={4}
              >
                <HStack spacing={3} mb={3}>
                  <Icon as={FiCheckCircle} color="green.500" boxSize={5} />

                  <Text fontWeight="600" color="green.700">
                    Tâche résolue
                  </Text>
                </HStack>

                {currentTask.resolvedAt && (
                  <Text fontSize="sm" color="gray.600">
                    Résolue le{" "}
                    {new Date(currentTask.resolvedAt).toLocaleString("fr-FR")}
                  </Text>
                )}

                {currentTask.resolvedBy && (
                  <Text fontSize="md" color="gray.600" mt={1}>
                    Par {currentTask.resolvedBy}
                  </Text>
                )}

                {currentTask.resolutionNotes && (
                  <Box mt={3}>
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      color="gray.600"
                      mb={1}
                    >
                      Notes
                    </Text>

                    <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
                      {currentTask.resolutionNotes}
                    </Text>
                  </Box>
                )}
              </Box>
            )}

            {/* =================================================
                COMMENTS
            ================================================== */}

            <Box>
              <Flex align="center" justify="space-between" mb={4}>
                <Text fontSize="md" fontWeight="600" color="gray.500">
                  Commentaires
                </Text>

                <Badge borderRadius="full" colorScheme="gray" px={3}>
                  {currentTask?.comments?.length ?? 0}
                </Badge>
              </Flex>

              <Stack spacing={5}>
                {currentTask?.comments?.length ? (
                  currentTask?.comments.map((comment) => (
                    <Box key={comment._id}>
                      <HStack align="start" spacing={3}>
                        <Avatar
                          size="md"
                          name={
                            comment.author
                              ? `${comment.author.firstName} ${comment.author.lastName}`
                              : "Utilisateur"
                          }
                        />

                        <Box flex={1}>
                          <HStack spacing={2} align="baseline">
                            <Text
                              fontSize="md"
                              fontWeight="600"
                              color="gray.800"
                            >
                              {comment.author
                                ? `${comment.author.firstName} ${comment.author.lastName}`
                                : "Utilisateur"}
                            </Text>

                            {comment.createdAt && (
                              <Text fontSize="sm" color="gray.400">
                                {new Date(comment.createdAt).toLocaleString(
                                  "fr-FR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "Africa/Bujumbura",
                                  }
                                )}
                              </Text>
                            )}
                          </HStack>

                          <Text
                            mt={1}
                            fontSize="md"
                            color="gray.700"
                            whiteSpace="pre-wrap"
                            lineHeight="1.6"
                          >
                            {comment.comment}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))
                ) : (
                  <Text fontSize="md" color="gray.500">
                    Aucun commentaire pour le moment.
                  </Text>
                )}
              </Stack>
            </Box>

            {/* =================================================
                ADD COMMENT
            ================================================== */}

            <Box pb={10}>
              <HStack align="end" spacing={3}>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ecrivez votre commentaire..."
                  resize="vertical"
                  minH="80px"
                  bg="white"
                />

                <Button
                  colorScheme="blue"
                  onClick={handleTaskComment}
                  isDisabled={!comment.trim()}
                  minW="120px"
                >
                  Commenter
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}

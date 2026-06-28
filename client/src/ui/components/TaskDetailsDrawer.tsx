import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiCalendar, FiCheckCircle, FiClock, FiUser } from "react-icons/fi";
import Task from "../../shared/types/Task";

interface Props {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsDrawer({ task, isOpen, onClose }: Props) {
  if (!task) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="lg">
      <DrawerOverlay />

      <DrawerContent>
        <DrawerCloseButton />

        <DrawerHeader borderBottomWidth="1px">
          <VStack align="start" spacing={1}>
            <Text fontSize="xl" fontWeight="bold">
              {task.subject}
            </Text>

            <HStack spacing={3}>
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
                {task.isResolved ? "Resolved" : "Open"}
              </Badge>
            </HStack>
          </VStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack align="stretch" spacing={6}>
            {/* Author */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Author
              </Text>

              <HStack>
                <Avatar
                  name={`${task.author.firstName} ${task.author.lastName}`}
                  size="sm"
                />

                <Box>
                  <Text fontWeight="medium">
                    {task.author.firstName} {task.author.lastName}
                  </Text>

                  <Text fontSize="sm" color="gray.500">
                    {task.author.email}
                  </Text>
                </Box>
              </HStack>
            </Box>

            <Divider />

            {/* Recipients */}
            <Box>
              <Text fontWeight="bold" mb={3}>
                Recipients
              </Text>

              <Stack spacing={3}>
                {task.recipients.map((user) => (
                  <HStack key={user._id}>
                    <Avatar
                      size="xs"
                      name={`${user.firstName} ${user.lastName}`}
                    />

                    <Box>
                      <Text>
                        {user.firstName} {user.lastName}
                      </Text>

                      <Text fontSize="xs" color="gray.500">
                        {user.role}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* Description */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Description
              </Text>

              <Text whiteSpace="pre-wrap">{task.message}</Text>
            </Box>

            <Divider />

            {/* Details */}
            <Box>
              <Text fontWeight="bold" mb={3}>
                Details
              </Text>

              <VStack align="stretch" spacing={3}>
                <HStack>
                  <Icon as={FiCalendar} />
                  <Text>Date limite: {task.deadline}</Text>
                </HStack>

                <HStack>
                  <Icon as={FiClock} />
                  <Text>
                    Soumis le:{" "}
                    {new Date(task.submittedAt!).toLocaleDateString("fr-FR")}
                  </Text>
                </HStack>

                {task.isResolved && (
                  <>
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" />
                      <Text>Resolved on {task.resolvedAt}</Text>
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
                          Resolution Notes
                        </Text>

                        <Text>{task.resolutionNotes}</Text>
                      </Box>
                    )}
                  </>
                )}
              </VStack>
            </Box>

            <Divider />

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
                        size="xs"
                        name={`${comment.author.firstName} ${comment.author.lastName}`}
                      />

                      <Box flex={1}>
                        <Text fontWeight="semibold">
                          {comment.author.firstName} {comment.author.lastName}
                        </Text>

                        <Text fontSize="xs" color="gray.500">
                          {comment.createdAt}
                        </Text>
                      </Box>
                    </HStack>

                    <Text whiteSpace="pre-wrap">{comment.message}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <HStack w="100%">
            <Textarea placeholder="Write a comment..." />

            <Button colorScheme="blue">Commenter</Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

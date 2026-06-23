import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { TiDelete } from "react-icons/ti";
import AdminUser from "../../shared/types/AdminUser";
import TaskRecipient from "../../shared/types/TaskRecipient";
import DatePicker from "react-datepicker";

interface Props {
  author: Omit<AdminUser, "password" | "notes">;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  adminUserslist: TaskRecipient[];
}

const errorMessage = "Remplissez tous les champs!";

const schema = z.object({
  subject: z.string().min(1, { message: errorMessage }),
  message: z.string().min(1, { message: errorMessage }),
  deadline: z.string().min(1, { message: errorMessage }),
});

type TaskData = z.infer<typeof schema>;

type Priority = "Haute" | "Moyenne" | "Basse" | "";

const TaskSubmissionModal = ({
  author,
  isOpen,
  onClose,
  onRefresh,
  adminUserslist,
}: Props) => {
  const [selectedRecipient, setSelectedRecipient] = useState<TaskRecipient>(
    {} as TaskRecipient
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskRecipients, setTaskRecipients] = useState<TaskRecipient[]>([]);
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const { register, handleSubmit, control, reset } = useForm<TaskData>({
    resolver: zodResolver(schema),
  });

  const handleSelectRecipients = () => {
    console.log("Recipients: ", taskRecipients);
    console.log("adminUser:", selectedRecipient);
    setTaskRecipients([...taskRecipients, selectedRecipient]);
  };

  const handleRecipientDelete = (_id: string) => {
    const updatedRecipient = taskRecipients.filter((r) => r._id !== _id);
    setTaskRecipients(updatedRecipient);
  };

  const handleFormClose = () => {
    setSelectedRecipient({} as TaskRecipient);
    setTaskRecipients([]);
    setPriority("Moyenne");
    reset();
    onClose();
    setErrorMessage("");
  };

  //Handle task creation
  const onSubmit = async (task: TaskData) => {
    if (!selectedRecipient?._id) {
      console.error("No recipient selected");
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await window.electron.tasks.create({
        author,
        subject: task.subject,
        message: task.message,
        recipients: taskRecipients,
        deadline: task.deadline,
        priority,
      });
      console.log("Task successfully created:", result);
      setSelectedRecipient({} as TaskRecipient);
      setErrorMessage("");
      onRefresh();
      reset();
      onClose();
    } catch (error: any) {
      setErrorMessage("Une erreur est survenue. Veuillez contacter ADB Tech!");
      console.error("Unable to save task:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="auto" backdropBlur="0.5rem" />
      <ModalContent bg="#F8F9FB">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
        >
          <ModalHeader color="#ffffff">
            <Flex justify="space-between">
              <Box>
                <Text color="brown" fontSize="1.5rem">
                  Nouvelle tache
                </Text>
              </Box>
              <Box position="relative" left="3rem">
                <Menu>
                  <HStack>
                    <MenuButton
                      backgroundColor="transparent"
                      as={Button}
                      _hover={{ bg: "transparent" }}
                      position="relative"
                      top="0.4rem"
                      right="5rem"
                    >
                      {selectedRecipient?._id ? (
                        <Text color="blue" fontSize="1.1rem">
                          {selectedRecipient?.firstName}{" "}
                          {selectedRecipient?.lastName}
                        </Text>
                      ) : (
                        <Text
                          color="gray.800"
                          position="relative"
                          top="0.4rem"
                          right="1rem"
                          fontSize="1rem"
                        >
                          Choisissez les destinataires
                        </Text>
                      )}
                    </MenuButton>
                    {selectedRecipient?._id && (
                      <Button
                        position="relative"
                        bottom="0.7rem"
                        right="7.5rem"
                        bg="transparent"
                        onClick={handleSelectRecipients}
                        _hover={{
                          bg: "transparent",
                        }}
                      >
                        <IoIosCheckmarkCircle size="1.2rem" color="green" />
                      </Button>
                    )}
                  </HStack>
                  <MenuList maxH="450px" overflowY="auto">
                    {adminUserslist?.map((adminUser) => (
                      <MenuItem
                        key={adminUser._id}
                        onClick={() => setSelectedRecipient(adminUser)}
                        color="black"
                        _hover={{
                          bg: "gray.400",
                          color: "white",
                        }}
                      >
                        <Text color="gray.800">
                          {adminUser.firstName} {adminUser.lastName}
                        </Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={handleFormClose} />
          <ModalBody bg="#F8F9FB" height="25rem">
            <HStack>
              {/* Subject */}
              <Input
                color="gray.800"
                fontWeight="600"
                fontSize="1.2rem"
                width="19rem"
                height="40px"
                border="2px solid gray"
                position="relative"
                {...register("subject")}
                placeholder="Sujet"
                _placeholder={{
                  opacity: 1,
                  color: "gray.500",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                }}
              />
              {/* Deadline */}
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => {
                      if (!date) {
                        field.onChange("");
                        return;
                      }

                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");

                      field.onChange(`${year}-${month}-${day}`);
                    }}
                    locale="fr"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Date limite"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={80}
                    customInput={
                      <Input
                        color="gray.900"
                        fontWeight="600"
                        width="15rem"
                        bg="#ffffff"
                        borderColor="gray.800"
                        borderWidth="1.5px"
                        _placeholder={{
                          opacity: 1,
                          color: "gray.500",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                        }}
                      />
                    }
                  />
                )}
              />
              {/* Priority */}
              <Menu>
                <MenuButton>
                  <HStack>
                    <Text position="relative" top="0.5rem" fontWeight="700">
                      Priorite:
                    </Text>
                    <Text
                      position="relative"
                      top="0.5rem"
                      right="0.4rem"
                      fontWeight="500"
                    >
                      {priority}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setPriority("Haute")}>
                    Haute
                  </MenuItem>
                  <MenuItem onClick={() => setPriority("Moyenne")}>
                    Moyenne
                  </MenuItem>
                  <MenuItem onClick={() => setPriority("Basse")}>
                    Basse
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
            {/* Task text */}
            <Textarea
              flex="1"
              height="20rem"
              placeholder="Creer une tache ici..."
              resize="none"
              bg="#091735"
              position="relative"
              top="2rem"
              border="1px solid rgba(255,255,255,0.1)"
              color="#ffffff"
              fontWeight="600"
              fontSize="1.1rem"
              _hover={{ borderColor: "yellow.300" }}
              _focus={{
                borderColor: "yellow.400",
                boxShadow: "0 0 0 1px #F4C20D",
              }}
              {...register("message")}
            />
          </ModalBody>

          <ModalFooter bg="#F8F9FB">
            <VStack>
              <Text
                fontWeight="500"
                fontSize="1.1rem"
                position="relative"
                top="10px"
                right="20px"
                color="red.500"
              >
                {errorMessage}
              </Text>
              <HStack>
                {taskRecipients?.map((recipient) => (
                  <Box mr="0.8rem">
                    <Button
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      position="relative"
                      left="1.7rem"
                      top="1rem"
                      onClick={() => handleRecipientDelete(recipient._id)}
                    >
                      <TiDelete size="1.2rem" />
                    </Button>
                    <Text>{recipient.firstName}</Text>
                    <Text position="relative" bottom="1.3rem">
                      {recipient.lastName}
                    </Text>
                  </Box>
                ))}

                <Button
                  borderRadius="10px"
                  borderColor="black"
                  bg="#F2B705"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="black"
                  mr={3}
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Patientez..."
                  spinnerPlacement="start"
                  isDisabled={isSubmitting}
                >
                  <HStack>
                    <Box>
                      <FaSave />
                    </Box>
                    <Text position="relative" top="8px" fontSize="1rem">
                      {" "}
                      Créer
                    </Text>
                  </HStack>
                </Button>
                <Button
                  borderColor="#ffffff"
                  borderRadius="10px"
                  bg="#08162b"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="#1a000d"
                  mr={3}
                  onClick={handleFormClose}
                >
                  <HStack>
                    <Box>
                      <RxCrossCircled color="#ffffff" size="18px" />
                    </Box>
                    <Text
                      color="#ffffff"
                      position="relative"
                      top="8px"
                      fontSize="1rem"
                    >
                      Annuler
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </VStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TaskSubmissionModal;

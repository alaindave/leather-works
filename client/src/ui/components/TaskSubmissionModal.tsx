import {
  Box,
  Button,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
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
import { MdTask } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { GoTag } from "react-icons/go";
import { LuFlag } from "react-icons/lu";

import AdminUser from "../../shared/types/AdminUser";
import DatePicker from "react-datepicker";
import User from "../../shared/types/User";

interface Props {
  author: Omit<User, "password" | "notes">;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  adminUsersList: AdminUser[];
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
  adminUsersList,
}: Props) => {
  const [recipient, setRecipient] = useState<AdminUser>({} as AdminUser);
  const [taskRecipients, setTaskRecipients] = useState<AdminUser[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const { register, handleSubmit, control, reset } = useForm<TaskData>({
    resolver: zodResolver(schema),
  });

  const handleSelectRecipients = () => {
    setErrorMessage("");
    setTaskRecipients([...taskRecipients, recipient]);
  };

  const handleRecipientDelete = (_id: string) => {
    const updatedRecipient = taskRecipients.filter((r) => r._id !== _id);
    setTaskRecipients(updatedRecipient);
  };

  const handleFormClose = () => {
    setRecipient({} as AdminUser);
    setTaskRecipients([]);
    setPriority("Moyenne");
    reset();
    onClose();
    setErrorMessage("");
  };

  //Handle task creation
  const onSubmit = async (task: TaskData) => {
    if (taskRecipients.length === 0) {
      console.error("No recipient selected");
      setErrorMessage("Veuillez selectionner un destinataire");
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await window.electron.tasks.create({
        author: author,
        subject: task.subject,
        message: task.message,
        recipients: taskRecipients,
        deadline: task.deadline,
        priority,
      });
      console.log("Task successfully created:", result);
      setRecipient({} as AdminUser);
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
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="auto" backdropBlur="0.5rem" />
      <ModalContent bg="gray.100">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
        >
          <ModalHeader color="#ffffff">
            <Flex justify="space-between">
              {/* Header */}
              <Box>
                <HStack>
                  <Box
                    position="relative"
                    bottom="0.5rem"
                    color="blue.700"
                    fontSize="1.6rem"
                  >
                    <MdTask />
                  </Box>
                  <Text color="blue.700" fontFamily="heading" fontSize="1.6rem">
                    Nouvelle tache
                  </Text>
                </HStack>
                <Text
                  position="relative"
                  left="2rem"
                  bottom="1.3rem"
                  color="gray.500"
                  fontSize="1rem"
                >
                  Creer une nouvelle tache
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
                      onClick={() => setErrorMessage("")}
                    >
                      {recipient?._id ? (
                        <Text color="blue" fontSize="1.1rem">
                          {recipient?.firstName} {recipient?.lastName}
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
                    {recipient?._id && (
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
                    {adminUsersList?.map((adminUser: AdminUser) => (
                      <MenuItem
                        key={adminUser._id}
                        onClick={() => setRecipient(adminUser)}
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
          <ModalBody bg="#ffffff" height="30rem">
            <HStack position="relative" left="1rem" bottom="1.2rem">
              {/* Subject */}
              <Box>
                <FormLabel position="relative" top="0.5rem">
                  <Text fontWeight="600" fontSize="1rem">
                    Sujet
                  </Text>
                </FormLabel>
                <Input
                  color="gray.800"
                  fontWeight="800"
                  fontSize="1.2rem"
                  width="20rem"
                  height="40px"
                  border="1px solid #E2E8F0"
                  placeholder="Ex:Preparer rapport de caisse"
                  _placeholder={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "gray.400",
                  }}
                  {...register("subject")}
                />
              </Box>
              <Box>
                {/* Deadline */}
                <FormLabel position="relative" top="0.5rem">
                  <Text fontWeight="600" fontSize="1rem">
                    {" "}
                    Date limite
                  </Text>
                </FormLabel>

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
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={80}
                      customInput={
                        <Input
                          position="relative"
                          color="gray.600"
                          fontWeight="800"
                          fontSize="1.2rem"
                          width="20rem"
                          height="40px"
                          border="1px solid #E2E8F0"
                          placeholder="Selectionner une date"
                          _placeholder={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "gray.700",
                          }}
                        />
                      }
                    />
                  )}
                />
              </Box>

              {/* Priority */}
              <Box>
                <FormLabel>
                  <Text
                    position="relative"
                    top="1.1rem"
                    fontWeight="600"
                    fontSize="1rem"
                  >
                    Priorite
                  </Text>
                </FormLabel>
                <Menu>
                  <MenuButton>
                    <HStack>
                      <Text
                        position="relative"
                        top="0.2rem"
                        fontWeight="600"
                        border="1px solid #E2E8F0"
                        borderRadius="0.5rem"
                        padding="0.5rem"
                        mt="0.4rem"
                        ml="0.1rem"
                        width="150px"
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
              </Box>
            </HStack>
            {/* Task text */}
            <FormLabel>
              <Text
                position="relative"
                top="0.5rem"
                fontWeight="600"
                fontSize="1rem"
              >
                Description de la tache
              </Text>
            </FormLabel>
            <Textarea
              flex="1"
              height="20rem"
              placeholder="Decrivez la tache en detail..."
              resize="none"
              bg="#ffffff"
              border="1px solid #E2E8F0"
              color="gray.200"
              fontWeight="600"
              fontSize="1.2rem"
              _hover={{ borderColor: "yellow.300" }}
              _focus={{
                borderColor: "yellow.400",
                boxShadow: "0 0 0 1px #F4C20D",
              }}
              {...register("message")}
            />
          </ModalBody>

          <ModalFooter bg="gray.100">
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
              <HStack height="50px">
                {taskRecipients?.map((recipient) => (
                  <Box mr="2rem" key={`${recipient._id}-${recipient.email}`}>
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

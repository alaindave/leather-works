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
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FaSave } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { AdminUser, AdminUserData } from "../../shared/types/AdminUser";

interface Props {
  author: AdminUserData;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  adminUsers: AdminUser[];
}

const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  subject: z.string().min(1, { message: errorMessage }),
  message: z.string().min(1, { message: errorMessage }),
  recipient: z.string().min(1, { message: errorMessage }),
  priority: z.string().min(1, { message: errorMessage }),
});

type TaskData = z.infer<typeof schema>;

const TaskSubmissionModal = ({
  author,
  isOpen,
  onClose,
  onRefresh,
  adminUsers,
}: Props) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState([""]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskData>({ resolver: zodResolver(schema) });

  const handleMenuClick = (adminUser: AdminUser) => {
    console.log("Admin selected: ", adminUser);
    console.log("Recipients: ", recipients);
    setAdminUser(adminUser);
    setRecipients([...recipients, adminUser._id]);
  };

  const handleFormClose = () => {
    setAdminUser(null);
    reset();
    onClose();
    setErrorMessage("");
  };

  //Handle task creation
  const onSubmit = async (task: TaskData) => {
    setIsSubmitting(true);
    if (!adminUser?._id) {
      console.error("No employee selected");
      return;
    }
    try {
      const result = await window.electron.tasks.create({
        author: author._id,
        subject: task.subject,
        recipients,
        message: task.message,
        priority: "high",
      });
      console.log("Task successfully created:", result);
      setAdminUser(null);
      setErrorMessage("");
      onRefresh();
      reset();
      onClose();
    } catch (error: any) {
      console.error("Unable to save task:", error.message);
      console.error("Unable to save task:error status", error.status);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="auto" backdropBlur="0.5rem" />
      <ModalContent bg="#F8F9FB">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <ModalHeader color="#ffffff" position="relative" left="120px">
            <HStack>
              <Box position="relative" left="120px">
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "21px",
                    fontWeight: "600",
                  }}
                >
                  Nouvelle tache
                </p>
              </Box>
              <Box position="relative" left="150px">
                <Menu>
                  <MenuButton
                    backgroundColor="transparent"
                    as={Button}
                    _hover={{ bg: "transparent" }}
                  >
                    {adminUser?._id ? (
                      <HStack spacing={2}>
                        <Text
                          color="#ffffff"
                          fontSize="22px"
                          position="relative"
                        >
                          {adminUser?.firstName} {adminUser?.lastName}
                        </Text>
                      </HStack>
                    ) : (
                      <p style={{ color: "#ffffff", fontSize: "16px" }}>
                        Destinataires
                      </p>
                    )}
                  </MenuButton>
                  <MenuList maxH="450px" overflowY="auto">
                    {adminUsers.map((adminUser) => (
                      <MenuItem
                        key={adminUser._id}
                        onClick={() => handleMenuClick(adminUser)}
                        color="black"
                        _hover={{
                          backgroundColor: "#08162b",
                          color: "#ffffff",
                        }}
                      >
                        <Text>
                          {adminUser.firstName} {adminUser.lastName}
                        </Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            </HStack>
          </ModalHeader> */}
          <ModalCloseButton onClick={handleFormClose} />
          <ModalBody
            bg="#F8F9FB"
            height="28rem"
            border="1px solid"
            borderColor="#D1D9E0"
            borderRadius="12px"
            boxShadow="0 2px 8px rgba(1,0,1,1)"
          >
            <Input
              color="#e6ebfe"
              width="300px"
              height="40px"
              {...register("subject")}
            />
            {errors.subject && (
              <Text className="text-danger">{errors.subject.message}</Text>
            )}

            <Textarea
              flex="1"
              height="18rem"
              placeholder="Creer une tache ici..."
              resize="none"
              bg="#091735"
              position="relative"
              top="2rem"
              border="1px solid rgba(255,255,255,0.1)"
              color="#ffffff"
              _hover={{ borderColor: "yellow.300" }}
              _focus={{
                borderColor: "yellow.400",
                boxShadow: "0 0 0 1px #F4C20D",
              }}
              {...register("message")}
            />
            {errors.message && (
              <Text className="text-danger">{errors.message.message}</Text>
            )}
          </ModalBody>

          {/* <ModalFooter bg="#F8F9FB">
            <HStack position="relative" right="2rem">
              <Text
                fontWeight="500"
                fontSize="1.1rem"
                position="relative"
                top="10px"
                right="20px"
                color="red.300"
              >
                {errorMessage}
              </Text>
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
          </ModalFooter> */}
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TaskSubmissionModal;

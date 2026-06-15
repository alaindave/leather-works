import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
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
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { z } from "zod";
import Leave from "../../shared/types/Leave";
import axios from "axios";
import { LeaveWithEmployee } from "../../shared/types/LeaveWithEmployee";

const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  startDate: z.string().min(1, { message: errorMessage }),
  endDate: z.string().min(1, { message: errorMessage }),
  subject: z.string().min(1, { message: errorMessage }),
  notes: z.string().min(1, { message: errorMessage }),
});

type LeaveData = z.infer<typeof schema>;

interface Props {
  leave: LeaveWithEmployee;
  onUpdated?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const LeaveEdit = ({ leave, onUpdated, isOpen, onClose }: Props) => {
  const [ServerErrorMessage, setServerErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [isUpdating, setIsUpdating] = useState(false);

  console.log("LeaveEdit received:", leave);
  if (!leave) {
    console.log("Leave is undefined");
    return null;
  }
  const {
    _id,
    firstName,
    lastName,
    department,
    role,
    startDate,
    endDate,
    subject,
    notes,
  } = leave;

  const onSubmit = async (data: LeaveData) => {
    setServerErrorMessage("");
    setIsUpdating(true);
    try {
      console.log("Info to update:", data);
      const updatedLeave = await window.electron.leave.updateLeave(
        leave._id,
        data
      );
      console.log("Updated leave:", updatedLeave);
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error("An error occurred while updating info:", error);
      setServerErrorMessage(
        "Une erreur s'est produite. Veuillez contacter ADB Tech."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LeaveData>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: startDate,
      endDate: endDate,
      subject: subject,
      notes: notes,
    },
  });
  const handleFormClose = () => {
    reset();
    onClose();
    setServerErrorMessage("");
  };

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="auto" backdropBlur="0.5rem" />
      <ModalContent bg="#08162b">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader color="#ffffff" position="relative" left="120px">
            <Text
              position="relative"
              left="120px"
              color="#ffffff"
              fontWeight="600"
              fontSize="21px"
            >
              Modification de la demande de congé
            </Text>
          </ModalHeader>
          <ModalCloseButton onClick={handleFormClose} />
          <ModalBody bg="#08162b">
            <FormControl>
              <VStack spacing="10px">
                <HStack>
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Nom
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      type="text"
                      color="#e6ebfe"
                      width="250px"
                      value={lastName || ""}
                      isReadOnly
                    />
                  </Box>
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Prenom
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      type="text"
                      color="#e6ebfe"
                      width="250px"
                      value={firstName || ""}
                      isReadOnly
                    />
                  </Box>
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Poste
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      type="text"
                      color="#e6ebfe"
                      width="250px"
                      value={role || ""}
                      isReadOnly
                    />
                  </Box>
                </HStack>

                <HStack alignItems="flex-start">
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Departement
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      type="text"
                      color="#e6ebfe"
                      width="250px"
                      value={department || ""}
                      isReadOnly
                    />
                  </Box>
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Date de début de congé
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date: any) => {
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : ""
                            );
                          }}
                          locale="fr"
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          customInput={
                            <Input
                              color="#e6ebfe"
                              width="300px"
                              bg="#08162b"
                              borderColor="#ffffff"
                              borderWidth="1px"
                              value={new Date(
                                leave.startDate
                              ).toLocaleDateString("fr-FR")}
                            />
                          }
                        />
                      )}
                    />
                    {errors.startDate && (
                      <Text className="text-danger">
                        {errors.startDate.message}
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Date de fin de congé
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Controller
                      control={control}
                      name="endDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date: any) => {
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : ""
                            );
                          }}
                          locale="fr"
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          customInput={
                            <Input
                              color="#e6ebfe"
                              width="300px"
                              bg="#08162b"
                              borderColor="#ffffff"
                              borderWidth="1px"
                            />
                          }
                        />
                      )}
                    />
                    {errors.endDate && (
                      <Text className="text-danger">
                        {errors.endDate.message}
                      </Text>
                    )}
                  </Box>
                </HStack>
                <VStack>
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Sujet
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      color="#e6ebfe"
                      width="300px"
                      height="40px"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <Text className="text-danger">
                        {errors.subject.message}
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <HStack>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Motif
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Textarea
                      color="#e6ebfe"
                      height="300px"
                      width="350px"
                      resize="none"
                      placeholder="Decrivez brievement le motif de votre demande..."
                      _placeholder={{ opacity: 1, color: "gray.500" }}
                      {...register("notes")}
                    />
                    {errors.notes && (
                      <Text className="text-danger">
                        {errors.notes.message}
                      </Text>
                    )}
                  </Box>
                </VStack>
              </VStack>
            </FormControl>
          </ModalBody>

          <ModalFooter bg="#08162b">
            <HStack position="relative" right="2rem">
              <Text
                fontWeight="500"
                fontSize="1.1rem"
                position="relative"
                top="10px"
                right="20px"
                color="red.300"
              >
                {ServerErrorMessage}
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
                isLoading={isUpdating}
                loadingText="Patientez..."
                spinnerPlacement="start"
                isDisabled={isUpdating}
              >
                <HStack>
                  <Box>
                    <FaSave />
                  </Box>
                  <Text position="relative" top="8px" fontSize="1rem">
                    {" "}
                    Soumettre
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
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default LeaveEdit;

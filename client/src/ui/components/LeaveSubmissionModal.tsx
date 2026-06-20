import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
  VStack
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Employee from "../../shared/types/Employee";
import DatePicker from "react-datepicker";
import { FaSave } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";




interface Props{
    isOpen:boolean;
    onClose:()=>void;
    onRefresh:()=>void;
    employees:Employee[];
}


const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  startDate: z.string().min(1, { message: errorMessage }),
  endDate: z.string().min(1, { message: errorMessage }),
  subject: z.string().min(1, { message: errorMessage }),
  notes: z.string().min(1, { message: errorMessage }),
});

type LeaveData = z.infer<typeof schema>;

const LeaveSubmissionModal = ({isOpen,onClose,onRefresh,employees}:Props) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);



  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LeaveData>({ resolver: zodResolver(schema) });

  const handleMenuClick = (employee: Employee) => {
    console.log("Employee selected: ", employee);
    setEmployee(employee);
  };

  const handleFormClose = () => {
    setEmployee(null);
    reset();
    onClose();
    setErrorMessage("");
  };


  //Handle leave submission
  const onSubmit = async (data: LeaveData) => {
    setIsSubmitting(true);
    if (!employee?._id) {
      console.error("No employee selected");
      return;
    }
    try {
      const leave = await window.electron.leave.create(
        employee._id,
        data.startDate,
        data.endDate,
        data.subject,
        data.notes
      );
      console.log("Leave successfully saved:",leave)
      setEmployee(null);
      setErrorMessage("");
      onRefresh();
      reset();
      onClose();
      
    } catch (error: any) {
      console.error("Unable to save leave:", error.message);
      console.error("Unable to save leave:error status", error.status);
      if (error.status == "400")
        setErrorMessage("Une demande de congé existe deja pour cet employé");
    } finally {
      setIsSubmitting(false);
    }
  };


  return(
  <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
    <ModalOverlay backdropFilter="auto" backdropBlur="0.5rem" />
    <ModalContent bg="#08162b">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader color="#ffffff" position="relative" left="120px">
          <HStack>
            <Box position="relative" left="120px">
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "21px",
                  fontWeight: "600",
                }}
              >
                Demande de congé
              </p>
            </Box>
            <Box position="relative" left="150px">
              <Menu>
                <MenuButton
                  backgroundColor="transparent"
                  as={Button}
                  _hover={{ bg: "transparent" }}
                >
                  {employee?._id ? (
                    <HStack spacing={2}>
                      <Text color="#ffffff" fontSize="22px" position="relative">
                        {employee?.firstName} {employee?.lastName}
                      </Text>
                      <Text color="#ffffff" fontSize="18px" position="relative">
                        #{employee.matricule}
                      </Text>
                    </HStack>
                  ) : (
                    <p style={{ color: "#ffffff", fontSize: "16px" }}>
                      Choisissez un employé
                    </p>
                  )}
                </MenuButton>
                <MenuList maxH="450px" overflowY="auto">
                  {employees.map((employee) => (
                    <MenuItem
                      key={employee._id}
                      onClick={() => handleMenuClick(employee)}
                      color="black"
                      _hover={{
                        backgroundColor: "#08162b",
                        color: "#ffffff",
                      }}
                    >
                      <Text>
                        {employee.firstName} {employee.lastName}
                      </Text>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </HStack>
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
                    value={employee?.lastName || ""}
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
                    value={employee?.firstName || ""}
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
                    value={employee?.role || ""}
                    isReadOnly
                  />
                </Box>
              </HStack>

              <HStack>
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
                    value={employee?.department || ""}
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
                    <Text className="text-danger">{errors.notes.message}</Text>
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
  )
};

export default LeaveSubmissionModal;

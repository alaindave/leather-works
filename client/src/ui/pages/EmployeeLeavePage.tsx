import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
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
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { z } from "zod";
import type Employee from "../../../types/Employee";
import type Leave from "../../../types/Leave";
import EmployeeLeaveCard from "../components/ui/EmployeeLeaveCard";

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;

const Shimmer = ({ width = "100%", height = "18px" }) => (
  <Box
    borderRadius="6px"
    height={height}
    width={width}
    background="linear-gradient(90deg, #0A1F57 25%, #132C68 37%, #0A1F57 63%)"
    backgroundSize="400% 100%"
    animation="shimmer 1.4s ease infinite"
  />
);

const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  startDate: z.date({ message: errorMessage }),
  endDate: z.date({ message: errorMessage }),
  subject: z.string().min(1, { message: errorMessage }),
  notes: z.string().min(1, { message: errorMessage }),
});

type LeaveData = z.infer<typeof schema>;

const gridTemplate = `
1.7fr 1.5fr 1.5fr 1.5fr 1.5fr 100px 100px
`;

const EmployeeLeavePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leave, setLeave] = useState<Leave | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [startDateType, setStartDateType] = useState("text");
  const [endDateType, setEndDateType] = useState("text");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LeaveData>({ resolver: zodResolver(schema) });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  //Handle leave submission
  const onSubmit = async (data: LeaveData) => {
    if (!employee?._id) {
      console.error("No employee selected");
      return;
    }

    const leaveData = {
      startDate: data.startDate,
      endDate: data.endDate,
      subject: data.subject,
      notes: data.notes,
    };

    try {
      const response = await axios.post(
        `${API_URL}/leaves/${employee._id}`,
        leaveData
      );
      setLeaves((prevLeaves) => [response.data, ...prevLeaves]);
      onClose();
      reset();
      setEmployee(null);
      setErrorMessage("");
    } catch (error: any) {
      console.error("Unable to save leave:", error.message);
      console.error("Unable to save leave:error status", error.status);
      if (error.status == "400")
        setErrorMessage("Une demande de congé existe deja pour cet employé");
    }
  };

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

  //Submit leave delete request
  const handleLeaveDelete = async () => {
    console.log("Leave to delete: ", leave);
    console.log("Leave ID to delete: ", leave?._id);

    onConfirmationClose();
    await axios
      .delete(`${API_URL}/leaves/${leave?._id}`)
      .then((res) => {
        console.log("Deleted leave: ", res.data);
        const updatedLeaves = leaves.filter((l) => l._id !== leave?._id);
        setLeaves(updatedLeaves);
      })
      .catch((error) =>
        console.error("An error occured while deleting attendance: ", error)
      );
  };

  //Handle delete button confirmation dialog
  const handleDeleteConfirmation = (leave: Leave) => {
    onConfirmationOpen();
    setLeave(leave);
  };

  useEffect(() => {
    axios
      .get<Leave[]>(`${API_URL}/leaves`)
      .then((res) => {
        setLeaves(res.data);
        return axios.get<Employee[]>(`${API_URL}/employees`);
      })
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((error) => {
        console.error("Error while fetching leaves: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ================= LOADING UI ================= */
  if (loading)
    return (
      <>
        <Box as="style">{shimmerKeyframes}</Box>

        <VStack>
          {/* HEADER */}
          <Box
            position="relative"
            top="50px"
            ml="3px"
            bg="#03143B"
            height="200px"
            width="80vw"
            borderRadius="20px"
            p={4}
          >
            <Shimmer width="200px" height="28px" />
            <Box mt={2}>
              <Shimmer width="320px" height="16px" />
            </Box>

            <Box position="absolute" right="8px" top="8px">
              <Shimmer width="220px" height="40px" />
            </Box>
          </Box>

          {/* TABLE HEADER */}
          <Grid
            templateColumns={gridTemplate}
            bg="#08162b"
            mt="44px"
            ml="4px"
            mr="4px"
            height="66px"
            width="80vw"
            borderRadius="12px"
            px={6}
            alignItems="center"
          >
            {[...Array(7)].map((_, i) => (
              <Shimmer key={i} width="90%" height="18px" />
            ))}
          </Grid>

          {/* ROWS */}
          <Box height="90vh" width="80vw" overflow="hidden">
            {[...Array(6)].map((_, i) => (
              <Grid
                key={i}
                templateColumns={gridTemplate}
                bg="#0A1F57"
                borderBottom="1px solid #1E355A"
                alignItems="center"
                px={6}
                py={4}
              >
                <Shimmer width="140px" />
                <Shimmer width="120px" />
                <Shimmer width="120px" />
                <Shimmer width="120px" />
                <Shimmer width="90px" />
                <Shimmer width="80px" />
                <HStack>
                  <Shimmer width="30px" height="30px" />
                  <Shimmer width="30px" height="30px" />
                </HStack>
              </Grid>
            ))}
          </Box>

          {/* FOOTER */}
          <Box bg="#08162b" height="80px" width="80vw" mb="2px" />
        </VStack>
      </>
    );

  return (
    <>
      <VStack>
        <Box
          position="relative"
          top="50px"
          ml="3px"
          bg="#03143B"
          height="200px"
          width="80vw"
          borderRadius="20px"
        >
          <HStack>
            <Box>
              <Text
                color="#ffffff"
                fontSize="27px"
                fontWeight="700"
                marginLeft="15px"
                marginTop="10px"
              >
                Congés
              </Text>
              <Text
                color="#ffffff"
                fontSize="15px"
                fontWeight="500"
                position="relative"
                bottom="20px"
                marginLeft="15px"
              >
                Gérez les demandes de congés
              </Text>
            </Box>
            <Button
              borderColor="black"
              backgroundColor="#F2B705"
              borderRadius="15px"
              borderWidth="5px"
              color="black"
              size="md"
              onClick={onOpen}
              position="absolute"
              right="8px"
              top="8px"
              zIndex="1"
            >
              <FaCirclePlus />{" "}
              <Text position="relative" top="8px" fontSize="18px" left="8px">
                Soumettre une demande
              </Text>
            </Button>
          </HStack>
        </Box>
        <>
          {leaves.length === 0 ? (
            <Box>
              <Text
                fontSize="35px"
                fontStyle="revert"
                fontWeight="600"
                color="gray.200"
                position="relative"
                top="300px"
              >
                Aucune demande de congé retrouvé
              </Text>
            </Box>
          ) : (
            <>
              <Grid
                templateColumns={gridTemplate}
                fontWeight="600"
                background="#08162b"
                mt="44px"
                ml="4px"
                mr="4px"
                height="66px"
                width="80vw"
                borderRadius="12px"
              >
                <Text fontSize="18px" color="#d6b65c" ml={8} mt={4}>
                  Employé
                </Text>
                <Text
                  fontSize="18px"
                  color="#d6b65c"
                  mt={4}
                  position="relative"
                  left="10px"
                >
                  Debut de congé
                </Text>
                <Text
                  fontSize="18px"
                  color="#d6b65c"
                  mt={4}
                  position="relative"
                  left="10px"
                >
                  Fin de congé
                </Text>
                <Text
                  fontSize="18px"
                  color="#d6b65c"
                  mt={4}
                  position="relative"
                  left="5px"
                >
                  Motif
                </Text>
                <Text
                  fontSize="18px"
                  color="#d6b65c"
                  mt={4}
                  position="relative"
                  right="12px"
                >
                  Statut
                </Text>

                <Text
                  fontSize="18px"
                  color="#d6b65c"
                  mt={3.5}
                  position="relative"
                  right="35px"
                  bottom="5px"
                >
                  Congés restants
                </Text>

                <Text fontSize="18px" color="#d6b65c" mt={4}>
                  Actions
                </Text>
              </Grid>
              <Box
                height="90vh"
                width="80vw"
                overflowX="hidden"
                overflowY="hidden"
                position="relative"
                bottom="6px"
              >
                {leaves.map((leave) => (
                  <EmployeeLeaveCard
                    key={leave._id}
                    leave={leave}
                    gridTemplate={gridTemplate}
                    onDelete={() => handleDeleteConfirmation(leave)}
                  />
                ))}
              </Box>
              <Box
                background="#08162b"
                height="80px"
                width="80vw"
                mb="2px"
              ></Box>
            </>
          )}
        </>
      </VStack>

      {/* Leave deletion confirmation dialog */}
      <AlertDialog
        isOpen={isConfirmationOpen}
        leastDestructiveRef={cancelRef}
        onClose={onConfirmationClose}
      >
        <AlertDialogOverlay backdropFilter="auto" backdropBlur="10px">
          <AlertDialogContent bg="#08162b">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="#ffffff">
              Supprimer de la liste de congé
            </AlertDialogHeader>

            <AlertDialogBody color="#ffffff">
              Etes de vous sur de vouloir supprimer l'employé de la liste de
              congé?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onConfirmationClose}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleLeaveDelete} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* Leave submission modal */}
      <Box>
        <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay backdropFilter="auto" backdropBlur="30px" />
          <ModalContent bg="#08162b" position="relative">
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
                            <Text
                              color="#ffffff"
                              fontSize="22px"
                              position="relative"
                            >
                              {employee?.firstName} {employee?.lastName}
                            </Text>
                            <Text
                              color="#ffffff"
                              fontSize="18px"
                              position="relative"
                            >
                              #{employee.employeeID}
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
                              *
                            </span>
                          </FormLabel>
                        </HStack>
                        <Controller
                          control={control}
                          name="startDate"
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
                              *
                            </span>
                          </FormLabel>
                        </HStack>
                        <Controller
                          control={control}
                          name="endDate"
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
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
                            <span
                              style={{ color: "#F2B705", fontSize: "1rem" }}
                            >
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
      </Box>
    </>
  );
};

export default EmployeeLeavePage;

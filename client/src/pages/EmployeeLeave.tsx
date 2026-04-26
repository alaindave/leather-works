import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
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
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCirclePlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { z } from "zod";
import type Employee from "../Employee";
import type Leave from "../Leave";
import { FaWindowClose } from "react-icons/fa";

const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  employeeID: z.string(),
  role: z.string(),
  department: z.string(),
  startDate: z.union([
    z.date({ message: errorMessage }),
    z.string().min(1, { message: errorMessage }),
  ]),
  endDate: z.union([
    z.date({ message: errorMessage }),
    z.string().min(1, { message: errorMessage }),
  ]),
  notes: z.string().min(1, { message: errorMessage }),
});

type LeaveData = z.infer<typeof schema>;

const EmployeeLeave = () => {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FieldValues) => {
    console.log("Form submitted:", data);
    const leaveData = {
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes,
    };
    await axios
      .put(`//localhost:5000/employees/${employee?._id}`, { leave: true })
      .then(() => {
        return axios.post(
          `//localhost:5000/employees/leave/${employee?._id}`,
          leaveData
        );
      })
      .then((response) => {
        console.log("Leave successfully saved", response.data);
        onClose();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    axios
      .get<Employee[]>("http://localhost:5000/employees")
      .then((res) => {
        setEmployees(res.data);
        return axios.get<Leave[]>("http://localhost:5000/employees/leave");
      })
      .then((res) => setLeaves(res.data))
      .catch((err) => {
        console.log("This is the error", err.message);
      });
  }, []);

  const handleMenuClick = (employee: Employee) => {
    console.log("Employee clicked", employee);
    setEmployee(employee);
  };

  const handleFormClose = () => {
    setEmployee({} as Employee);
    reset();
    onClose();
  };

  const handleLeaveDelete = async () => {
    console.log("Leave to delete", leave);

    await axios
      .put(`//localhost:5000/employees/${leave?.employee._id}`, {
        leave: false,
      })
      .then(() => {
        return axios.delete(`//localhost:5000/employees/leave/${leave?._id}`);
      })
      .then((res) => {
        console.log("Deleted leave", res.data);
        window.location.reload();
      })
      .catch((e) =>
        console.log("An error occured while deleting attendance", e)
      );
  };

  //Handle x delete button
  const handleDelete = (leave: Leave) => {
    onConfirmationOpen();
    setLeave(leave);
  };

  return (
    <>
      <AlertDialog
        isOpen={isConfirmationOpen}
        leastDestructiveRef={cancelRef}
        onClose={onConfirmationClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer de la liste de congé
            </AlertDialogHeader>

            <AlertDialogBody>
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

      <Flex>
        <Box>
          {leaves?.length === 0 || leave?.employee === null ? (
            <Button
              borderColor="black"
              bg="brown"
              borderRadius="15px"
              borderWidth="5px"
              color="#d6b65c"
              size="md"
              onClick={onOpen}
              position="relative"
              top="250px"
              left="250px"
            >
              <FaCirclePlus />
            </Button>
          ) : (
            <Button
              borderColor="black"
              bg="brown"
              borderRadius="15px"
              borderWidth="5px"
              color="#d6b65c"
              size="md"
              onClick={onOpen}
              position="relative"
              left="90px"
              top="10px"
            >
              <FaCirclePlus />
            </Button>
          )}

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter="auto" backdropBlur="30px" />
            <ModalContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader bg=" #952104">
                  <HStack>
                    <Box position="relative" right="13px">
                      <p
                        style={{
                          color: "black",
                          fontSize: "23px",
                          fontWeight: "600",
                        }}
                      >
                        Demande de congé{" "}
                        {employee?._id ? (
                          <span
                            style={{
                              color: "black",
                              fontSize: "23px",
                              fontWeight: "600",
                            }}
                          >
                            pour
                          </span>
                        ) : null}
                      </p>
                    </Box>
                    <Box>
                      <Menu>
                        <MenuButton
                          backgroundColor="transparent"
                          as={Button}
                          _hover={{ bg: "transparent" }}
                          // rightIcon={<FaCircleChevronDown />}
                        >
                          {employee?._id ? (
                            <p style={{ color: "black", fontSize: "23px" }}>
                              {employee?.firstName} {employee?.lastName}
                            </p>
                          ) : (
                            <p style={{ color: "black" }}>
                              Choisissez un employé
                            </p>
                          )}
                        </MenuButton>
                        <MenuList>
                          {employees.map((employee) => (
                            <MenuItem onClick={() => handleMenuClick(employee)}>
                              {employee.firstName} {employee.lastName}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </Box>
                  </HStack>
                </ModalHeader>
                <ModalCloseButton onClick={handleFormClose} />
                <ModalBody bg="#c9990a">
                  <FormControl>
                    <Stack spacing="10px">
                      <Input
                        type="text"
                        placeholder={employee?.lastName}
                        value={employee?.lastName}
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className="text-danger">{errors.lastName.message}</p>
                      )}
                      <Input
                        type="text"
                        placeholder={employee?.firstName}
                        value={employee?.firstName}
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-danger">
                          {errors.firstName.message}
                        </p>
                      )}
                      <Input
                        type="text"
                        placeholder={employee?.employeeID}
                        value={employee?.employeeID}
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("employeeID")}
                      />
                      {errors.employeeID && (
                        <p className="text-danger">
                          {errors.employeeID.message}
                        </p>
                      )}
                      <Input
                        type="text"
                        placeholder={employee?.role}
                        value={employee?.role}
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("role")}
                      />
                      {errors.role && (
                        <p className="text-danger">{errors.role.message}</p>
                      )}
                      <Input
                        type="text"
                        placeholder={employee?.department}
                        value={employee?.department}
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("department")}
                      />
                      {errors.department && (
                        <p className="text-danger">
                          {errors.department.message}
                        </p>
                      )}
                      <Input
                        type={startDateType}
                        placeholder="Debut"
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("startDate")}
                        onFocus={() => setStartDateType("date")}
                        onBlur={() => setStartDateType("text")}
                      />
                      {errors.startDate && (
                        <p className="text-danger">
                          {errors.startDate.message}
                        </p>
                      )}
                      <Input
                        type={endDateType}
                        placeholder="Fin"
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("endDate")}
                        onFocus={() => setEndDateType("date")}
                        onBlur={() => setEndDateType("text")}
                      />
                      {errors.endDate && (
                        <p className="text-danger">{errors.endDate.message}</p>
                      )}
                      <Textarea
                        placeholder="Veuillez entrer le motif"
                        _placeholder={{ opacity: 1, color: "#320c01" }}
                        {...register("notes")}
                      />
                      {errors.notes && (
                        <p className="text-danger">{errors.notes.message}</p>
                      )}
                    </Stack>
                  </FormControl>
                </ModalBody>

                <ModalFooter bg=" #952104">
                  <Button
                    borderColor="black"
                    bg="brown"
                    borderWidth="3px"
                    colorScheme=" #320b01"
                    color="#1a000d"
                    mr={3}
                    type="submit"
                  >
                    Ajouter
                  </Button>
                  <Button
                    borderColor="black"
                    bg="brown"
                    borderWidth="3px"
                    colorScheme=" #320b01"
                    color="#1a000d"
                    mr={3}
                    onClick={handleFormClose}
                  >
                    Fermer
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Box>
        {leaves.length === 0 || leave?.employee === null ? (
          <p
            style={{
              fontSize: "40px",
              color: "#d6b65c",
              position: "relative",
              top: "250px",
              left: "280px",
            }}
          >
            Pas d'employés en congé
          </p>
        ) : (
          <TableContainer position="relative" left="100px" top="8px">
            <Table variant="simple">
              <TableCaption fontSize="30px" color="#000000" fontWeight="500">
                Employés en congé
              </TableCaption>

              <Thead>
                <Tr>
                  <Th color="#d6b65c">Nom et prenom</Th>
                  <Th color="#d6b65c">Debut</Th>
                  <Th color="#d6b65c">Fin</Th>
                  <Th color="#d6b65c">Motif</Th>
                </Tr>
              </Thead>
              <Tbody>
                {leaves.map((leave) => (
                  <Tr key={leave._id}>
                    <Td>
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </Td>
                    <Td>{leave.startDate}</Td>
                    <Td>{leave.endDate}</Td>
                    <Td>{leave.notes}</Td>
                    <FaWindowClose onClick={() => handleDelete(leave)} />
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </>
  );
};

export default EmployeeLeave;

import {
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
import { useEffect, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { z } from "zod";
import type Employee from "../Employee";
import type Leave from "../Leave";
import { FaWindows } from "react-icons/fa";

const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  firstName: z.string().min(1, { message: errorMessage }),
  lastName: z.string().min(1, { message: errorMessage }),
  employeeID: z.string().min(1, { message: errorMessage }),
  role: z.string().min(1, { message: errorMessage }),
  department: z.string().min(1, { message: errorMessage }),
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employee, setEmployee] = useState<Employee>({} as Employee);
  const [startDateType, setStartDateType] = useState("text");
  const [endDateType, setEndDateType] = useState("text");

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
      .put(`//localhost:5000/employees/${employee._id}`, { leave: true })
      .then(() => {
        return axios.post(
          `//localhost:5000/employees/leave/${employee._id}`,
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

  return (
    <Flex>
      <Box position="relative" right="25px">
        <Button
          borderColor="black"
          bg="brown"
          borderRadius="15px"
          borderWidth="5px"
          color="#d6b65c"
          size="md"
          onClick={onOpen}
        >
          <FaCirclePlus />
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay backdropFilter="auto" backdropBlur="30px" />
          <ModalContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader bg=" #952104">
                <HStack>
                  <Box position="relative" right="13px">
                    <p style={{ color: "black", fontSize: "23px" }}>
                      Demande de conge pour
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
                        {employee._id ? (
                          <p style={{ color: "black", fontSize: "23px" }}>
                            {employee.firstName} {employee.lastName}
                          </p>
                        ) : (
                          <p style={{ color: "black" }}>
                            Selectionnez un employé
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
                      placeholder={employee.lastName}
                      value={employee.lastName}
                      _placeholder={{ opacity: 1, color: "#320c01" }}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-danger">{errors.lastName.message}</p>
                    )}
                    <Input
                      type="text"
                      placeholder={employee.firstName}
                      value={employee.firstName}
                      _placeholder={{ opacity: 1, color: "#320c01" }}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-danger">{errors.firstName.message}</p>
                    )}
                    <Input
                      type="text"
                      placeholder={employee.employeeID}
                      value={employee.employeeID}
                      _placeholder={{ opacity: 1, color: "#320c01" }}
                      {...register("employeeID")}
                    />
                    {errors.employeeID && (
                      <p className="text-danger">{errors.employeeID.message}</p>
                    )}
                    <Input
                      type="text"
                      placeholder={employee.role}
                      value={employee.role}
                      _placeholder={{ opacity: 1, color: "#320c01" }}
                      {...register("role")}
                    />
                    {errors.role && (
                      <p className="text-danger">{errors.role.message}</p>
                    )}
                    <Input
                      type="text"
                      placeholder={employee.department}
                      value={employee.department}
                      _placeholder={{ opacity: 1, color: "#320c01" }}
                      {...register("department")}
                    />
                    {errors.department && (
                      <p className="text-danger">{errors.department.message}</p>
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
                      <p className="text-danger">{errors.startDate.message}</p>
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
      {leaves.length === 0 ? (
        <p style={{ fontSize: "40px", color: "#d6b65c" }}>
          Pas d'employés en conge
        </p>
      ) : (
        <TableContainer position="relative" right="23px">
          <Table variant="simple">
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
                    {leave.employee.firstName} {leave.employee.lastName}
                  </Td>
                  <Td>{leave.startDate}</Td>
                  <Td>{leave.endDate}</Td>
                  <Td>{leave.notes}</Td>
                  {/* <FaWindowClose onClick={() => handleClick(leave)} /> */}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Flex>
  );
};

export default EmployeeLeave;

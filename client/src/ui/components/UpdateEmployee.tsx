import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type Employee from "../../shared/types/Employee";

import {
  Box,
  Button,
  Flex,
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
  Select,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { fr } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("fr", fr);

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { FaEdit, FaSave, FaUserEdit } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { GiRotaryPhone } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { GiRelationshipBounds } from "react-icons/gi";
import { MdFactory, MdOutlineNumbers, MdPerson2, MdWork } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";

interface Props {
  _id: string | undefined;
  employee: Employee;
}

const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateBirth: z.coerce.date().nullable().optional(),
  employeeID: z.string().min(1),
  role: z.string().optional(),
  department: z.string().optional(),
  dateHired: z.coerce.date().nullable().optional(),
  telephone: z.string().optional(),
  address: z.string().optional(),
  salary: z.string().optional(),
  emergencyContact: z.string().optional(),
  relationship: z.string().optional(),
  contactPhone: z.string().optional(),
});

type EmployeeData = z.infer<typeof schema>;

const UpdateEmployee = ({ _id, employee }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ServerErrorMessage, setServerErrorMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const {
    firstName,
    lastName,
    employeeID,
    dateBirth,
    role,
    department,
    dateHired,
    salary,
    address,
    telephone,
    emergencyContact,
    relationship,
    contactPhone,
  } = employee;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmployeeData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName,
      lastName,
      employeeID,
      dateBirth,
      role,
      department,
      dateHired,
      salary,
      address,
      telephone,
      emergencyContact,
      relationship,
      contactPhone,
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        employeeID: employee.employeeID,
        role: employee.role,
        department: employee.department,
        salary: employee.salary,
        telephone: employee.telephone,
        emergencyContact: employee.emergencyContact,
        relationship: employee.relationship,
        contactPhone: employee.contactPhone,
        address: employee.address,
        dateBirth: employee.dateBirth ? new Date(employee.dateBirth) : null,
        dateHired: employee.dateHired ? new Date(employee.dateHired) : null,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeData) => {
    console.log("Info to update: ", data);

    await axios
      .put<Employee>(`${API_URL}/employees/${_id}`, data)
      .then((response) => {
        console.log("Updated employee:", response.data);
        navigate("/employees_admin/employees_list");
      })
      .catch((error) => {
        console.error("An error occured while updating info:", error);
        setServerErrorMessage(
          "Une erreur s'est produite.Veuillez contacter ADB Tech."
        );
      });
  };

  const safeDate = (value: unknown): Date | null => {
    if (!value) return null;
    const date = new Date(value as string | Date);
    return isNaN(date.getTime()) ? null : date;
  };
  return (
    <>
      <Button
        bg="#0a2142"
        borderColor="black"
        borderRadius="18px"
        borderWidth="1px"
        color="#F2B705"
        padding="16px"
        _hover={{
          bg: "brown",
          color: "#e6e6e6",
          transform: "scale(1.05)",
        }}
        onClick={onOpen}
      >
        <FaEdit color="#ffffff" size="16px" />
        <Text position="relative" top="8px" left="5px" fontSize="1.2rem">
          Modifier
        </Text>
      </Button>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onClose={onClose}
        returnFocusOnClose={false}
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="8px" />
        <ModalContent
          bg="#08162b"
          position="relative"
          top="2.5rem"
          width="53vw"
        >
          <form
            onSubmit={handleSubmit(
              (data) => {
                console.log("VALID SUBMIT", data);
                onSubmit(data);
              },
              (errors) => {
                console.log("VALIDATION ERRORS", errors);
              }
            )}
          >
            <ModalHeader color="#ffffff">
              <HStack>
                <Flex
                  height="55px"
                  width="55px"
                  padding="5px"
                  borderRadius="27px"
                  borderWidth="0.2px"
                  borderColor="#F2B705"
                  justifyContent="center"
                  alignItems="center"
                >
                  <FaUserEdit color="#F2B705" size="2.3rem" />
                </Flex>
                <VStack position="relative" top="0.7rem" right="3rem">
                  <Text position="relative" top="0.5rem" fontSize="1.7rem">
                    {" "}
                    Modification
                  </Text>
                  <Text
                    color="#C7D2FE"
                    fontSize="15px"
                    position="relative"
                    left="4rem"
                    bottom="20px"
                  >
                    Modifiez les informations de l'employé
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody marginLeft={4}>
              <HStack spacing="12px" marginBottom="10px">
                {/* Last Name */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdPerson2 color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Nom
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-danger">{errors.lastName.message}</p>
                  )}
                </Box>

                {/* First Name */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdPerson2 color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Prenom
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-danger">{errors.firstName.message}</p>
                  )}
                </Box>

                {/* Date of birth */}

                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <IoCalendarNumberSharp color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Date de naissance
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Controller
                    control={control}
                    name="dateBirth"
                    render={({ field }) => (
                      <DatePicker
                        selected={safeDate(field.value)}
                        onChange={(date: Date | null) => field.onChange(date)}
                        locale="fr"
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={80}
                        minDate={new Date(1926, 0, 1)}
                        maxDate={new Date()}
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

                  {errors.dateBirth && (
                    <p className="text-danger">{errors.dateBirth.message}</p>
                  )}
                </Box>
              </HStack>

              <HStack spacing="12px" marginBottom="10px">
                {/* Employee ID */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdOutlineNumbers color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Matricule
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    {...register("employeeID")}
                  />
                  {errors.employeeID && (
                    <p className="text-danger">{errors.employeeID.message}</p>
                  )}
                </Box>

                {/* Role */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdWork color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Poste
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Input type="text" color="gray.300" {...register("role")} />
                  {errors.role && (
                    <p className="text-danger">{errors.role.message}</p>
                  )}
                </Box>

                {/* Department */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdFactory color="#F2B705" size="1.3rem" />
                    </Box>

                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Departement
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Select
                    width="300px"
                    bg="#08162b"
                    color="#e6ebfe"
                    borderColor="#ffffff"
                    focusBorderColor="#F2B705"
                    iconColor="#F2B705"
                    _hover={{
                      borderColor: "#F2B705",
                    }}
                    placeholder="Choisissez un departement"
                    {...register("department")}
                  >
                    <option value="Administration" style={{ color: "black" }}>
                      Administration
                    </option>

                    <option value="Atelier" style={{ color: "black" }}>
                      Atelier
                    </option>

                    <option value="Usine" style={{ color: "black" }}>
                      Usine
                    </option>

                    <option value="Magasin" style={{ color: "black" }}>
                      Magasin
                    </option>

                    <option value="Sentinelle" style={{ color: "black" }}>
                      Sentinelle
                    </option>
                  </Select>

                  {errors.department && (
                    <p className="text-danger">{errors.department.message}</p>
                  )}
                </Box>
              </HStack>

              <HStack spacing="12px" marginBottom="10px">
                {/* Salary */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <LuCircleDollarSign color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Salaire
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Input
                    type="number"
                    color="gray.300"
                    {...register("salary")}
                  />
                  {errors.salary && (
                    <p className="text-danger">{errors.salary.message}</p>
                  )}
                </Box>

                {/* Telephone */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <GiRotaryPhone color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Telephone
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    {...register("telephone")}
                  />
                  {errors.telephone && (
                    <p className="text-danger">{errors.telephone.message}</p>
                  )}
                </Box>
                {/* Hiring date */}
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <FaCalendarDays color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Date d'engagement
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>
                  {/* <InputGroup> */}

                  <Controller
                    control={control}
                    name="dateHired"
                    render={({ field }) => (
                      <DatePicker
                        selected={safeDate(field.value)}
                        onChange={(date: Date | null) => field.onChange(date)}
                        locale="fr"
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={80}
                        minDate={new Date(2003, 0, 1)}
                        maxDate={new Date()}
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

                  {errors.dateHired && (
                    <p className="text-danger">{errors.dateHired.message}</p>
                  )}
                </Box>
              </HStack>

              {/* Emergency contact */}
              <HStack spacing="12px" marginBottom="10px">
                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdPerson2 color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Nom du contact d'urgence
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>

                  <Input
                    color="#e6ebfe"
                    type="text"
                    {...register("emergencyContact")}
                  />
                  {errors.emergencyContact && (
                    <p className="text-danger">
                      {errors.emergencyContact.message}
                    </p>
                  )}
                </Box>

                <Box>
                  <HStack>
                    <Box marginBottom="10px">
                      <GiRelationshipBounds color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Relation avec l'employé
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>
                  <Input
                    color="#e6ebfe"
                    type="text"
                    {...register("relationship")}
                  />
                  {errors.relationship && (
                    <p className="text-danger">{errors.relationship.message}</p>
                  )}
                </Box>

                <Box position="relative" top="10px">
                  <HStack>
                    <Box marginBottom="10px">
                      <MdOutlineNumbers color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Telephone du contact
                      <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                        *
                      </span>
                    </FormLabel>
                  </HStack>
                  <Input
                    color="#e6ebfe"
                    type="text"
                    {...register("contactPhone")}
                  />
                  {errors.contactPhone && (
                    <p className="text-danger">{errors.contactPhone.message}</p>
                  )}
                </Box>
              </HStack>

              {/* Address */}
              <Box marginTop="10px">
                <HStack>
                  <Box marginBottom="10px">
                    <IoHome color="#F2B705" size="1.3rem" />
                  </Box>
                  <FormLabel color="#C7D2FE" marginBottom="10px">
                    Addresse
                    <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                      *
                    </span>
                  </FormLabel>
                </HStack>
                <Input type="text" color="gray.300" {...register("address")} />
                {errors.address && (
                  <p className="text-danger">{errors.address.message}</p>
                )}
              </Box>
            </ModalBody>

            <ModalFooter bg="#08162b">
              <HStack position="relative" right="2rem">
                <Text
                  position="relative"
                  right="20px"
                  fontSize="1.1rem"
                  fontWeight="600"
                  color="red.300"
                >
                  {ServerErrorMessage}
                </Text>
                <Button
                  borderColor="black"
                  bg="#F2B705"
                  borderWidth="3px"
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
                      Modifier
                    </Text>
                  </HStack>
                </Button>
                <Button
                  borderColor="#ffffff"
                  bg="#08162b"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="#1a000d"
                  mr={3}
                  onClick={onClose}
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
                      Fermer
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateEmployee;

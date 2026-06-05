import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import type Employee from "../../shared/types/Employee";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
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
import { Controller, useForm } from "react-hook-form";
import { FaEdit, FaSave, FaUserEdit } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { GiRelationshipBounds, GiRotaryPhone } from "react-icons/gi";
import { IoCalendarNumberSharp, IoHome } from "react-icons/io5";
import { LuCircleDollarSign } from "react-icons/lu";
import { MdFactory, MdOutlineNumbers, MdPerson2, MdWork } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { z } from "zod";
registerLocale("fr", fr);

interface Props {
  _id: string | undefined;
  employee: Employee;
  onUpdated?: () => void;
}
const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  firstName: z.string().min(1, { message: errorMessage }),
  lastName: z.string().min(1, { message: errorMessage }),
  employeeID: z.string().min(1, { message: errorMessage }),
  dateBirth: z.date().optional().nullable(),
  role: z.string().min(1, { message: errorMessage }),
  department: z.string().min(1, { message: errorMessage }),
  dateHired: z.date().optional().nullable(),
  telephone: z
    .string()
    .min(1, "Le numéro de téléphone est obligatoire")
    .regex(/^\+?[0-9]{1,15}$/, "Numéro de téléphone invalide"),
  address: z.string().min(1, { message: errorMessage }),
  emergencyContact: z.string().min(1, { message: errorMessage }),
  relationship: z.string().min(1, { message: errorMessage }),
  contactPhone: z.string().min(1, { message: errorMessage }),
  salary: z
    .number({
      invalid_type_error: "Le salaire doit être un nombre",
    })
    .min(0, "Le salaire ne peut pas être négatif")
    .optional(),
});

type EmployeeData = z.infer<typeof schema>;

const UpdateEmployee = ({ _id, employee, onUpdated }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ServerErrorMessage, setServerErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [isUpdating, setIsUpdating] = useState(false);

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
        dateHired: employee.dateHired ? new Date(employee.dateHired) : null,
        dateBirth: employee.dateBirth ? new Date(employee.dateBirth) : null,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeData) => {
    setServerErrorMessage("");
    setIsUpdating(true);
    try {
      console.log("Info to update:", data);
      const response = await axios.put<Employee>(
        `${API_URL}/employees/${_id}`,
        data
      );
      console.log("Updated employee:", response.data);
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

  const handleFormClosed = () => {
    setServerErrorMessage("");
    onClose();
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
        <ModalOverlay backdropFilter="auto" backdropBlur="0.5rem" />
        <ModalContent bg="#08162b" position="relative" top="1rem" width="53vw">
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
              <HStack
                spacing="0.8rem"
                marginBottom="0.7rem"
                alignItems="flex-start"
              >
                {/* Last Name */}
                <FormControl isInvalid={!!errors.lastName}>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdPerson2 color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Nom
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    {...register("lastName")}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.lastName?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
                {/* First Name */}
                <FormControl isInvalid={!!errors.firstName}>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdPerson2 color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Prenom
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    borderColor={errors.firstName ? "red.400" : undefined}
                    {...register("firstName")}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.firstName?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>

                {/* Date of birth */}
                <FormControl isInvalid={!!errors.firstName}>
                  <HStack>
                    <Box marginBottom="10px">
                      <IoCalendarNumberSharp color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Date de naissance
                    </FormLabel>
                  </HStack>

                  <Controller
                    control={control}
                    name="dateBirth"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ?? null}
                        onChange={(date: Date | null) => {
                          field.onChange(
                            date && !isNaN(date.getTime()) ? date : null
                          );
                        }}
                        locale="fr"
                        dateFormat="dd/MM/yyyy"
                        isClearable
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={80}
                        minDate={new Date(1940, 0, 1)}
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
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.dateBirth?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
              </HStack>

              <HStack
                spacing="0.8rem"
                marginBottom="0.7rem"
                alignItems="flex-start"
              >
                {/* Employee ID */}
                <FormControl isInvalid={!!errors.employeeID}>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdOutlineNumbers color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Matricule
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    {...register("employeeID")}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.employeeID?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>

                {/* Role */}
                <FormControl isInvalid={!!errors.role}>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdWork color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Poste
                    </FormLabel>
                  </HStack>

                  <Input type="text" color="gray.300" {...register("role")} />
                  <Box minH="24px">
                    <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
                  </Box>
                </FormControl>

                {/* Department */}
                <FormControl isInvalid={!!errors.department}>
                  <HStack>
                    <Box marginBottom="10px">
                      <MdFactory color="#F2B705" size="1.3rem" />
                    </Box>

                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Departement
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

                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.department?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
              </HStack>

              <HStack
                spacing="0.8rem"
                marginBottom="0.7rem"
                alignItems="flex-start"
              >
                {/* Salary */}
                <FormControl isInvalid={!!errors.salary}>
                  <HStack>
                    <Box marginBottom="10px">
                      <LuCircleDollarSign color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Salaire
                    </FormLabel>
                  </HStack>

                  <Input
                    type="number"
                    color="gray.300"
                    {...register("salary", { valueAsNumber: true })}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.salary?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>

                {/* Telephone */}
                <FormControl isInvalid={!!errors.telephone}>
                  <HStack>
                    <Box marginBottom="10px">
                      <GiRotaryPhone color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Telephone
                    </FormLabel>
                  </HStack>

                  <Input
                    type="text"
                    color="gray.300"
                    {...register("telephone")}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.telephone?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
                {/* Hiring date */}
                <FormControl isInvalid={!!errors.dateHired}>
                  <HStack>
                    <Box marginBottom="10px">
                      <FaCalendarDays color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel color="#C7D2FE" marginBottom="10px">
                      Date d'embauche
                    </FormLabel>
                  </HStack>
                  {/* <InputGroup> */}

                  <Controller
                    control={control}
                    name="dateHired"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ?? null}
                        onChange={(date: Date | null) => {
                          field.onChange(
                            date && !isNaN(date.getTime()) ? date : null
                          );
                        }}
                        locale="fr"
                        dateFormat="dd/MM/yyyy"
                        isClearable
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={80}
                        minDate={new Date(1990, 0, 1)}
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
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.dateHired?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
              </HStack>

              {/* Emergency contact */}
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {" "}
                <FormControl isInvalid={!!errors.emergencyContact}>
                  <HStack>
                    {" "}
                    <Box marginBottom="10px">
                      <MdPerson2 color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel
                      color="#C7D2FE"
                      marginBottom="10px"
                      alignItems="center"
                    >
                      {" "}
                      Contact d'urgence
                    </FormLabel>
                  </HStack>

                  <Input
                    color="#e6ebfe"
                    type="text"
                    h="40px"
                    {...register("emergencyContact")}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.emergencyContact?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
                <FormControl isInvalid={!!errors.relationship}>
                  <HStack>
                    {" "}
                    <Box marginBottom="10px">
                      <GiRelationshipBounds color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel
                      color="#C7D2FE"
                      marginBottom="10px"
                      alignItems="center"
                    >
                      {" "}
                      Relation avec l'employé
                    </FormLabel>
                  </HStack>
                  <Input
                    color="#e6ebfe"
                    type="text"
                    h="40px"
                    {...register("relationship")}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.relationship?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
                <FormControl isInvalid={!!errors.contactPhone}>
                  <HStack>
                    {" "}
                    <Box marginBottom="10px">
                      <MdOutlineNumbers color="#F2B705" size="1.3rem" />
                    </Box>
                    <FormLabel
                      color="#C7D2FE"
                      marginBottom="10px"
                      alignItems="center"
                    >
                      {" "}
                      Telephone du contact
                    </FormLabel>
                  </HStack>
                  <Input
                    color="#e6ebfe"
                    type="text"
                    h="40px"
                    {...register("contactPhone")}
                  />
                  <Box minH="24px">
                    <FormErrorMessage>
                      {errors.contactPhone?.message}
                    </FormErrorMessage>
                  </Box>
                </FormControl>
              </Grid>

              {/* Address */}
              <FormControl isInvalid={!!errors.address}>
                <HStack>
                  <Box marginBottom="10px">
                    <IoHome color="#F2B705" size="1.3rem" />
                  </Box>
                  <FormLabel color="#C7D2FE" marginBottom="10px">
                    Addresse
                  </FormLabel>
                </HStack>
                <Input type="text" color="gray.300" {...register("address")} />
                <Box minH="24px">
                  <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
                </Box>{" "}
              </FormControl>
            </ModalBody>

            <ModalFooter bg="#08162b">
              <VStack position="relative" right="2rem">
                <Text
                  position="relative"
                  right="20px"
                  fontSize="1.1rem"
                  fontWeight="600"
                  color="red.300"
                >
                  {ServerErrorMessage}
                </Text>
                <Box>
                  <Button
                    borderColor="black"
                    bg="#F2B705"
                    borderWidth="3px"
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
                    onClick={handleFormClosed}
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
                </Box>
              </VStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateEmployee;

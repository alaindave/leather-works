import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { registerLocale } from "react-datepicker";
registerLocale("fr", fr);
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { IoPersonAdd } from "react-icons/io5";
import { GiRelationshipBounds } from "react-icons/gi";
import { BsPersonFillAdd } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { MdPerson2 } from "react-icons/md";
import { MdOutlineNumbers } from "react-icons/md";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { MdFactory } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";
import { LuCircleDollarSign } from "react-icons/lu";
import { GiRotaryPhone } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { IoCalendarNumber } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { z } from "zod";
import type Employee from "../../shared/types/Employee";
import "../styles/App.css";

interface Props {
  onAddEmployee: (employee: Employee) => void;
}

const errorMessage = "Ce champ est obligatoire";

const schema = z.object({
  firstName: z.string().min(1, { message: errorMessage }),
  lastName: z.string().min(1, { message: errorMessage }),
  employeeID: z.string().min(1, { message: errorMessage }),
  dateBirth: z.date({ message: errorMessage }),
  role: z.string().min(1, { message: errorMessage }),
  department: z.string().min(1, { message: errorMessage }),
  dateHired: z.date({ message: errorMessage }),
  telephone: z
    .string()
    .min(1, "Le numéro de téléphone est obligatoire")
    .regex(/^\+?[0-9]{8,15}$/, "Numéro de téléphone invalide"),
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

const AddEmployee = ({ onAddEmployee }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ServerErrorMessage, setServerErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FieldValues) => {
    setIsSaving(true);
    console.log("Form to be submitted:", data);
    try {
      const res = await axios.post(`${API_URL}/employees`, data);
      console.log("Employee successfully saved", res.data);
      onAddEmployee(res.data);
      onClose();
    } catch (error) {
      console.error("An error occured while adding employee: ", error);
      setServerErrorMessage(
        "Une erreur s'est produite.Veuillez contacter ADB Tech."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        borderColor="black"
        bg="#0a2142"
        borderRadius="18px"
        borderWidth="1px"
        color="#F2B705"
        onClick={onOpen}
        _hover={{
          bg: "brown",
          color: "#e6e6e6",
          transform: "scale(1.05)",
        }}
        isLoading={isSaving}
        loadingText="Patientez..."
        spinnerPlacement="start"
        isDisabled={isSaving}
      >
        <IoPersonAdd />{" "}
        <Text fontSize="15px" marginLeft="10px" marginTop="15px">
          Ajouter un employé
        </Text>
      </Button>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="auto" backdropBlur="0.5rem" />
        <ModalContent position="relative" top="2.5rem" bg="#08162b">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader color="#ffffff">
              <HStack>
                <Flex
                  height="55px"
                  width="55px"
                  padding="5px"
                  borderRadius="27px"
                  borderWidth="0.3px"
                  borderColor="#F2B705"
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                  left="12px"
                >
                  <BsPersonFillAdd color="#F2B705" size="2.3rem" />
                </Flex>
                <VStack position="relative" top="10px" right="18px">
                  <Text position="relative" top="8px" fontSize="1.7rem">
                    {" "}
                    Nouveau employé
                  </Text>
                  <Text
                    color="#C7D2FE"
                    fontSize="15px"
                    position="relative"
                    left="2.8rem"
                    bottom="20px"
                  >
                    Ajoutez les informations du nouvel employé
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="#ffffff" />
            <ModalBody>
              <FormControl>
                <HStack spacing="12px" marginBottom="10px">
                  {/* Last name input */}
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
                      color="#e6ebfe"
                      width="300px"
                      type="text"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-danger">{errors.lastName.message}</p>
                    )}
                  </Box>
                  {/* First name input */}
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
                      color="#e6ebfe"
                      width="300px"
                      type="text"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-danger">{errors.firstName.message}</p>
                    )}
                  </Box>
                  {/* Employee ID input */}
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
                      color="#e6ebfe"
                      width="300px"
                      type="text"
                      {...register("employeeID")}
                    />
                    {errors.employeeID && (
                      <p className="text-danger">{errors.employeeID.message}</p>
                    )}
                  </Box>
                </HStack>
                <HStack spacing="12px" marginBottom="10px">
                  {/* Date of birth input */}
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
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          locale="fr"
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={80}
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
                  </Box>
                  {/* Role input */}
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
                    <Input
                      color="#e6ebfe"
                      width="300px"
                      type="text"
                      {...register("role")}
                    />
                    {errors.role && (
                      <p className="text-danger">{errors.role.message}</p>
                    )}
                  </Box>
                  {/* Department input */}
                  {/* Department dropdown */}
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
                  {/* Hire date input */}
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
                          selected={field.value}
                          onChange={(date: Date | null) => field.onChange(date)}
                          locale="fr"
                          dateFormat="dd/MM/yyyy"
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

                    {errors.dateHired && (
                      <p className="text-danger">{errors.dateHired.message}</p>
                    )}
                  </Box>
                  {/* Salary input */}
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
                      color="#e6ebfe"
                      width="300px"
                      type="text"
                      {...register("salary")}
                    />
                    {errors.salary && (
                      <p className="text-danger">{errors.salary.message}</p>
                    )}
                  </Box>
                  {/* Telephone input */}
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
                      color="#e6ebfe"
                      width="300px"
                      type="text"
                      {...register("telephone")}
                    />
                    {errors.telephone && (
                      <p className="text-danger">{errors.telephone.message}</p>
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
                      width="300px"
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
                      width="300px"
                      type="text"
                      {...register("relationship")}
                    />
                    {errors.relationship && (
                      <p className="text-danger">
                        {errors.relationship.message}
                      </p>
                    )}
                  </Box>

                  <Box>
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
                      width="300px"
                      type="text"
                      {...register("contactPhone")}
                    />
                    {errors.contactPhone && (
                      <p className="text-danger">
                        {errors.contactPhone.message}
                      </p>
                    )}
                  </Box>
                </HStack>

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
                <Input
                  color="#e6ebfe"
                  marginBottom="10px"
                  width="58rem"
                  type="text"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-danger">{errors.address.message}</p>
                )}
              </FormControl>
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
                  borderRadius="10px"
                  borderColor="black"
                  bg="#F2B705"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="black"
                  mr={3}
                  type="submit"
                  isLoading={isSaving}
                  loadingText="Patientez..."
                  spinnerPlacement="start"
                  isDisabled={isSaving}
                >
                  <HStack>
                    <Box>
                      <FaSave />
                    </Box>
                    <Text position="relative" top="8px" fontSize="1rem">
                      {" "}
                      Sauvegarder
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
                      Annuler
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

export default AddEmployee;

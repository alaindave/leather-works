import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { z } from "zod";
import type Employee from "../Employee";
import { useNavigate } from "react-router-dom";

interface Props {
  _id: string | undefined;
  employee: Employee;
  // onUpdate: (employee: Employee) => void;
}

const errorMessage = "Ce champ est obligatoire";
const schema = z.object({
  firstName: z.string().min(1, { message: errorMessage }),
  lastName: z.string().min(1, { message: errorMessage }),
  employeeID: z.string().min(1, { message: errorMessage }),
  dateBirth: z.union([
    z.date({ message: errorMessage }),
    z.string().min(1, { message: errorMessage }),
  ]),
  role: z.string().min(1, { message: errorMessage }),
  department: z.string().min(1, { message: errorMessage }),
  dateHired: z.union([
    z.date({ message: errorMessage }),
    z.string().min(1, { message: errorMessage }),
  ]),
  telephone: z.string().min(1, { message: errorMessage }),
  address: z.string().min(1, { message: errorMessage }),
  salary: z.string().min(1, { message: errorMessage }),
});

type EmployeeData = z.infer<typeof schema>;

const UpdateEmployee = ({ _id, employee }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dateBirthType, setDateBirthType] = useState("text");
  const [dateHiredType, setDateHiredType] = useState("text");
  const navigate = useNavigate();

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
  } = employee;

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
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
    },
  });

  const onSubmit = async (data: FieldValues) => {
    const updatedEmployee: Employee | any = {};

    if (dirtyFields.firstName) updatedEmployee.firstName = data.firstName;
    if (dirtyFields.lastName) updatedEmployee.lastName = data.lastName;
    if (dirtyFields.employeeID) updatedEmployee.employeeID = data.employeeID;
    if (dirtyFields.dateBirth) updatedEmployee.dateBirth = data.dateBirth;
    if (dirtyFields.role) updatedEmployee.role = data.role;
    if (dirtyFields.department) updatedEmployee.department = data.department;
    if (dirtyFields.dateHired) updatedEmployee.dateHired = data.dateHired;
    if (dirtyFields.salary) updatedEmployee.salary = data.salary;
    if (dirtyFields.address) updatedEmployee.address = data.address;
    if (dirtyFields.telephone) updatedEmployee.telephone = data.telephone;
    await axios
      .put<Employee>(`//localhost:5000/employees/${_id}`, updatedEmployee)
      .then((response) => {
        console.log("Updated employee:", response.data);
        navigate("/employees_admin/employees_list");
      })
      .catch((e) => console.log("An error occured", e));
  };

  //convert dates into strings
  const _dateBirth = dateBirth.toString();
  const _dateHired = dateHired.toString();

  return (
    <>
      <Button
        borderColor="black"
        bg="brown"
        borderRadius="15px"
        borderWidth="4px"
        color="#d6b65c"
        size="lg"
        onClick={onOpen}
      >
        Modifier
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
        <ModalOverlay backdropFilter="auto" backdropBlur="30px" />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader bg=" #952104">Modification d'information</ModalHeader>
            <ModalCloseButton />
            <ModalBody bg="#c9990a">
              <FormControl>
                <Stack spacing="10px">
                  <Input
                    type="text"
                    placeholder={lastName}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-danger">{errors.lastName.message}</p>
                  )}
                  <Input
                    type="text"
                    placeholder={firstName}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-danger">{errors.firstName.message}</p>
                  )}
                  <Input
                    type="text"
                    placeholder={employeeID}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("employeeID")}
                  />
                  {errors.employeeID && (
                    <p className="text-danger">{errors.employeeID.message}</p>
                  )}
                  <Input
                    type={dateBirthType}
                    placeholder={_dateBirth}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("dateBirth")}
                    onFocus={() => setDateBirthType("date")}
                    onBlur={() => setDateBirthType("text")}
                  />
                  {errors.dateBirth && (
                    <p className="text-danger">{errors.dateBirth.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder={role}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("role")}
                  />
                  {errors.role && (
                    <p className="text-danger">{errors.role.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder={department}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("department")}
                  />
                  {errors.department && (
                    <p className="text-danger">{errors.department.message}</p>
                  )}

                  <Input
                    type={dateHiredType}
                    placeholder={_dateHired}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("dateHired")}
                    onFocus={() => setDateHiredType("date")}
                    onBlur={() => setDateHiredType("text")}
                  />
                  {errors.dateHired && (
                    <p className="text-danger">{errors.dateHired.message}</p>
                  )}

                  <Input
                    type="number"
                    placeholder={salary}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("salary")}
                  />
                  {errors.salary && (
                    <p className="text-danger">{errors.salary.message}</p>
                  )}

                  <Input
                    type="number"
                    placeholder={telephone}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("telephone")}
                  />
                  {errors.telephone && (
                    <p className="text-danger">{errors.telephone.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder={address}
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-danger">{errors.address.message}</p>
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
                disabled={!isDirty}
              >
                Modifier
              </Button>
              <Button
                borderColor="black"
                bg="brown"
                borderWidth="3px"
                colorScheme=" #320b01"
                color="#1a000d"
                mr={3}
                onClick={onClose}
              >
                Fermer
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateEmployee;

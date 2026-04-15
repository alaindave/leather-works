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
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { z } from "zod";
import type Employee from "../Employee";

interface Props {
  _id: string | undefined;
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

const UpdateEmployee = ({ _id }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dateBirthType, setDateBirthType] = useState("text");
  const [dateHiredType, setDateHiredType] = useState("text");

  const onSubmit = async () => {
    console.log("form submitted for employee ID", _id);
    // await axios
    //   .put<Employee>(`//localhost:5000/employees/${_id}`)
    //   .then((response) => console.log("Employee found:", response.data))
    //   .catch((e) => console.log("An error occured", e));
  };

  const handleOnClick = () => {
    console.log("Button clicked");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeData>({ resolver: zodResolver(schema) });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader bg=" #952104">Nouveau employe</ModalHeader>
            <ModalCloseButton />
            <ModalBody bg="#c9990a">
              <FormControl>
                <Stack spacing="10px">
                  <Input
                    type="text"
                    placeholder="Nom"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-danger">{errors.lastName.message}</p>
                  )}
                  <Input
                    type="text"
                    placeholder="Prenom"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-danger">{errors.firstName.message}</p>
                  )}
                  <Input
                    type="text"
                    placeholder="Matricule"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("employeeID")}
                  />
                  {errors.employeeID && (
                    <p className="text-danger">{errors.employeeID.message}</p>
                  )}
                  <Input
                    type={dateBirthType}
                    placeholder="Date de naissance"
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
                    placeholder="Poste"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("role")}
                  />
                  {errors.role && (
                    <p className="text-danger">{errors.role.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder="Departement"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("department")}
                  />
                  {errors.department && (
                    <p className="text-danger">{errors.department.message}</p>
                  )}

                  <Input
                    type={dateHiredType}
                    placeholder="Date d'engagement"
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
                    placeholder="Salaire"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("salary")}
                  />
                  {errors.salary && (
                    <p className="text-danger">{errors.salary.message}</p>
                  )}

                  <Input
                    type="number"
                    placeholder="Telephone"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("telephone")}
                  />
                  {errors.telephone && (
                    <p className="text-danger">{errors.telephone.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder="Addresse"
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
                onClick={handleOnClick}
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

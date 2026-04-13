import {
  Button,
  FormControl,
  FormLabel,
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
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";

interface Employee {
  _id: number;
  firstName: string;
  lastName: string;
  employeeID: string;
  dateBirth: string;
  role: string;
  department: string;
  dateHired: string;
  telephone: number;
  address: string;
  salary: string;
}

const AddEmployee = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Employee>();

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    await axios
      .post("//localhost:5000/employees", data)
      .then((response) =>
        console.log("Employee successfully saved", response.data)
      )
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Button onClick={onOpen}>Ajouter un employe</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Nouveau employe</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <FormControl>
                  <Input
                    placeholder="Nom"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("lastName")}
                  />
                  <Input
                    placeholder="Prenom"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("firstName")}
                  />
                  <Input
                    placeholder="Matricule"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("employeeID")}
                  />
                  <Input
                    placeholder="Date de naissance"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("dateBirth")}
                  />
                  <Input
                    placeholder="Poste"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("role")}
                  />
                  <Input
                    placeholder="Departement"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("department")}
                  />
                  <Input
                    placeholder="Date d'engagement"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("dateHired")}
                  />
                  <Input
                    placeholder="Salaire"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("salary")}
                  />
                  <Input
                    placeholder="Telephone"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("telephone")}
                  />
                  <Input
                    placeholder="Addresse"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("address")}
                  />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose} type="submit">
                Ajouter
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Fermer
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEmployee;

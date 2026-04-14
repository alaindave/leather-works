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
import axios from "axios";
import { useForm, type FieldValues } from "react-hook-form";
import type Employee from "../Employee";

interface Props {
  onAddEmployee: (employee: Employee) => void;
}

const AddEmployee = ({ onAddEmployee }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Employee>();

  const onSubmit = async (data: FieldValues) => {
    console.log("Form submitted:", data);
    await axios
      .post("//localhost:5000/employees", data)
      .then((response) => {
        console.log("Employee successfully saved", response.data);
        onAddEmployee(response.data);
      })
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
              <FormControl>
                <Stack spacing="10px">
                  <Input
                    type="text"
                    placeholder="Nom"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("lastName")}
                  />
                  <Input
                    type="text"
                    placeholder="Prenom"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("firstName")}
                  />
                  <Input
                    type="text"
                    placeholder="Matricule"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("employeeID")}
                  />
                  <Input
                    type="date"
                    placeholder="Date de naissance"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("dateBirth")}
                  />
                  <Input
                    type="text"
                    placeholder="Poste"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("role")}
                  />
                  <Input
                    type="text"
                    placeholder="Departement"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("department")}
                  />
                  <Input
                    type="date"
                    placeholder="Date d'engagement"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("dateHired")}
                  />
                  <Input
                    type="number"
                    placeholder="Salaire"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("salary")}
                  />
                  <Input
                    type="number"
                    placeholder="Telephone"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("telephone")}
                  />
                  <Input
                    type="text"
                    placeholder="Addresse"
                    _placeholder={{ opacity: 1, color: "#320c01" }}
                    {...register("address")}
                  />
                </Stack>
              </FormControl>
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

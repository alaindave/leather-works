import {
  Box,
  HStack,
  Text,
  VStack,
  Image,
  Divider,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import type Employee from "../../shared/types/Employee";
import EmployeeDetailsTab from "../components/EmployeeDetailsTab";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { MdDeleteForever, MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import source from "../assets/employee_photos/Jeanne.jpeg";
import UpdateEmployee from "../components/UpdateEmployee";
import { useEffect, useRef, useState } from "react";

const EmployeeDetailsPage = () => {
  const [employee, setEmployee] = useState<Employee>({} as Employee);
  const { _id } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get<Employee>(`${API_URL}/employees/${_id}`)
      .then((res) => setEmployee(res.data))
      .catch((error) => console.error("Error while fetching employee:", error));
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/employees/${_id}`);
      navigate("/employees_admin/employees_list");
    } catch (error) {
      console.error("Unable to delete employee:", error);
    }
  };

  return (
    <>
      {/* DELETE MODAL */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay backdropFilter="blur(8px)">
          <AlertDialogContent
            bg="#08162b"
            color="white"
            mx={4}
            position="relative"
            top="3rem"
          >
            <AlertDialogHeader>Supprimer l'employé</AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer{" "}
              <b style={{ color: "#F2B705" }}>
                {employee?.firstName} {employee?.lastName}
              </b>{" "}
              ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <HStack>
                <Button
                  bg="brown"
                  onClick={handleDelete}
                  leftIcon={<MdAutoDelete fontSize="1.2rem" />}
                >
                  Supprimer
                </Button>

                <Button ref={cancelRef} onClick={onClose}>
                  <RxCrossCircled fontSize="1.2rem" />
                  Annuler
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* PAGE CONTAINER */}
      <Box
        bg="#03143B"
        borderRadius="20px"
        w="100%"
        maxW="1400px"
        mx="auto"
        ml="0.3rem"
        mr="0.3rem"
        mb="1rem"
        mt={{ base: 1, md: 3 }}
        p={{ base: 3, md: 6 }}
      >
        <VStack spacing={4} align="stretch">
          {/* HEADER */}
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            spacing={4}
          >
            <HStack align="center">
              <Link to="/employees_admin/employees_list">
                <Box
                  p={2}
                  border="1px solid #14376b"
                  borderRadius="10px"
                  position="relative"
                  bottom="0.8rem"
                >
                  <FaArrowLeftLong color="white" />
                </Box>
              </Link>

              <Box>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="700"
                  color="white"
                >
                  Détails de l'employé
                </Text>
                <Text
                  fontSize="md"
                  color="#C7D2FE"
                  position="relative"
                  bottom="1rem"
                >
                  Consultez et gérez les informations de l'employé
                </Text>
              </Box>
            </HStack>

            <UpdateEmployee _id={_id} employee={employee} />
          </Stack>

          {/* MAIN CONTENT */}
          <Stack direction={{ base: "column", lg: "row" }} spacing={4}>
            {/* LEFT PANEL */}
            <Box
              bg="#0E1E47"
              borderRadius="18px"
              p={5}
              flex={{ base: "1", lg: "0.35" }}
              minW={0}
              maxH="70vh"
            >
              <VStack spacing={3}>
                <Image
                  src={source}
                  boxSize="120px"
                  borderRadius="full"
                  objectFit="cover"
                />

                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="gray.200"
                  textAlign="center"
                >
                  {employee?.firstName} {employee?.lastName}
                </Text>

                <Text color="#C7D2FE">{employee?.role}</Text>

                <HStack bg="#08162b" px={3} py={1} borderRadius="full">
                  <GoDotFill color="green" />
                  <Text
                    color="green.400"
                    position="relative"
                    top="0.3rem"
                    right="0.3rem"
                  >
                    Actif
                  </Text>
                </HStack>

                <Divider />

                <Box textAlign="center">
                  <Text color="#C7D2FE">Matricule</Text>
                  <Text color="#F2B705" fontWeight="700">
                    {employee?.employeeID}
                  </Text>
                </Box>

                <Button
                  colorScheme="red"
                  onClick={onOpen}
                  w="100%"
                  mt={4}
                  leftIcon={<MdDeleteForever />}
                >
                  Supprimer
                </Button>
              </VStack>
            </Box>

            {/* RIGHT PANEL */}
            <Box
              bg="#03143B"
              borderRadius="18px"
              flex={1}
              minW={0}
              h={{ base: "auto", lg: "74vh" }}
              overflowY="auto"
            >
              <EmployeeDetailsTab employee={employee} />
            </Box>
          </Stack>
        </VStack>
      </Box>
    </>
  );
};

export default EmployeeDetailsPage;

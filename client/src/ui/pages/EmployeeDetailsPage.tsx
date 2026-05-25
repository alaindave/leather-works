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
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type Employee from "../../types/Employee";
import EmployeeDetailsTab from "../components/EmployeeDetailsTab";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";
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

      .then((res) => {
        setEmployee(res.data);
        console.log("Employee fetched: ", res.data);
      })
      .catch((error) => {
        console.error("Error while fetching employee: ", error);
      });
  }, []);

  const handleDelete = async () => {
    await axios
      .delete<Employee>(`${API_URL}/employees/${_id}`)
      .then((response) => {
        console.log("Employee successfully deleted: ", response.data);
        navigate("/employees_admin/employees_list");
      })
      .catch((error) => console.error("Unable to delete employee:", error));
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay
          backdropFilter="auto"
          backdropBlur="30px"
          bgGradient="radial(circle,#47370b, #061962)"
        >
          <AlertDialogContent
            bg="#08162b"
            color="#ffffff"
            position="relative"
            top="180px"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer l'employé
            </AlertDialogHeader>

            <AlertDialogBody>
              Etes vous sur de vouloir supprimer{" "}
              <span style={{ color: "#F2B705", fontWeight: "bold" }}>
                {" "}
                {employee?.firstName}{" "}
              </span>
              <span style={{ color: "#F2B705", fontWeight: "bold" }}>
                {" "}
                {employee?.lastName}{" "}
              </span>
              de la liste des employés?
            </AlertDialogBody>

            <AlertDialogFooter>
              <HStack position="relative" right="2rem">
                <Button
                  borderRadius="10px"
                  borderColor="black"
                  bg="brown"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  mr={3}
                  onClick={handleDelete}
                >
                  <HStack>
                    <Box>
                      <MdAutoDelete size="1.2rem" />
                    </Box>
                    <Text marginTop="0.9rem" fontSize="1rem">
                      {" "}
                      Supprimer
                    </Text>
                  </HStack>
                </Button>
                <Button
                  ref={cancelRef}
                  borderColor="gray.500"
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
                      <RxCrossCircled color="#ffffff" size="1.2rem" />
                    </Box>
                    <Text color="#ffffff" marginTop="0.9rem" fontSize="1rem">
                      Annuler
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box
        background="#03143B"
        borderRadius="20px"
        height="94vh"
        width="79vw"
        marginTop="50px"
        marginLeft="8px"
      >
        <VStack spacing="2px">
          <Box
            background="#03143B"
            height="10rem"
            width="78vw"
            borderRadius="18px"
            border="none"
            marginTop="5px"
            marginBottom="2px"
          >
            <HStack position="relative" top="10px">
              <Box
                borderRadius="10px"
                borderColor=" #14376b"
                borderWidth="1px"
                padding="8px"
                position="relative"
                bottom="15px"
                left="10px"
              >
                <Link to="/employees_admin/employees_list">
                  <FaArrowLeftLong color="#ffffff" size="1.5rem" />
                </Link>
              </Box>

              <Box marginLeft="1.5rem">
                <Text fontSize="1.5rem" fontWeight="700" color="#ffffff">
                  Détails de l'employé
                </Text>
                <Text color="#C7D2FE" position="relative" bottom="18px">
                  Consultez et gérez les informations de l'employé
                </Text>
              </Box>
              <Box position="absolute" top="3px" right="5px">
                <UpdateEmployee _id={_id} employee={employee} />
              </Box>
            </HStack>
          </Box>
          <HStack marginTop="3px">
            <Box
              bg="#0E1E47"
              borderWidth="1px"
              borderRadius="18px"
              border="none"
              height="74vh"
              width="28vw"
            >
              <VStack position="relative" top="60px">
                <Image
                  src={source}
                  height="120px"
                  width="120px"
                  boxSize="120px"
                  borderRadius="full"
                  fit="cover"
                />
                <Text
                  color="gray.200"
                  fontWeight="700"
                  fontSize="1.4rem"
                  position="relative"
                >
                  {employee?.firstName} {employee?.lastName}
                </Text>

                <Text
                  color="#C7D2FE"
                  position="relative"
                  bottom="15px"
                  fontSize="1rem"
                >
                  {employee?.role}
                </Text>

                <HStack
                  bg="#08162b"
                  width="80px"
                  border="none"
                  borderRadius="40px"
                  marginLeft="12px"
                >
                  <span style={{ position: "relative", left: "5px" }}>
                    <GoDotFill color="green" size="1rem" />
                  </span>
                  <Text position="relative" top="7px" color="green.400">
                    Actif
                  </Text>
                </HStack>
                <Divider orientation="horizontal" color="gray.400" />
                <Box position="relative" top="30px">
                  <Text color="#C7D2FE" fontSize="1.3rem">
                    Matricule
                  </Text>
                  <Text fontSize="1.2rem" color="#F2B705">
                    {employee?.employeeID}
                  </Text>
                </Box>
                <Button
                  borderColor="black"
                  bg="brown"
                  borderRadius="15px"
                  borderWidth="4px"
                  size="lg"
                  position="relative"
                  top="85px"
                  onClick={onOpen}
                >
                  <MdDeleteForever color="#ffffff" size="23px" />
                  <Text
                    position="relative"
                    top="8px"
                    left="5px"
                    fontSize="1.2rem"
                    color="#ffffff"
                  >
                    Supprimer
                  </Text>
                </Button>
              </VStack>
            </Box>
            <Box
              bg="#03143B"
              border="none"
              borderWidth="1px"
              borderRadius="18px"
              height="74vh"
              width="50vw"
              marginTop="1px"
            >
              <EmployeeDetailsTab employee={employee}></EmployeeDetailsTab>
            </Box>
          </HStack>
        </VStack>
      </Box>
    </>
  );
};
export default EmployeeDetailsPage;

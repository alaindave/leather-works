import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { MdAutoDelete, MdDeleteForever } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import type Employee from "../../shared/types/Employee";
import useAdminUser from "../../store/authStore";
import source from "../assets/employee_photos/Jeanne.jpeg";
import EmployeeDetailsTab from "../components/EmployeeDetailsTab";
import UpdateEmployee from "../components/UpdateEmployee";
import ComponentErrorFallback from "./ComponentErrorFallback";
import NotAuthorized from "../components/NotAuthorized";

const EmployeeDetailsPage = () => {
  const [employee, setEmployee] = useState<Employee | null>({} as Employee);
  const [isDeleting, setIsDeleting] = useState(false);
  const { _id } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const adminUser = useAdminUser((store) => store.adminUser);
  // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  console.log("Employee ID:", _id);

  useEffect(() => {
    if (!_id) return;
    window.electron.employees
      .getById(_id)
      .then((employee) => {
        setEmployee(employee);
        console.log("Employee fetched: ", employee);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
      });
  }, [_id]);

  const refreshEmployee = async () => {
    try {
      if (!_id) return;
      const updatedEmployee = await window.electron.employees.getById(_id);
      setEmployee(updatedEmployee);
      console.log("Fetched updated employee:", updatedEmployee);
    } catch (error) {
      console.error("An error occured while refreshing employee data", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!_id) return;
      await window.electron.employees.delete(_id);
      navigate("/employees_admin/employees_list");
    } catch (error) {
      console.error("Unable to delete employee:", error);
    } finally {
      setIsDeleting(false);
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
              de la liste des employés ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <HStack>
                <Button
                  colorScheme="red"
                  onClick={handleDelete}
                  leftIcon={<MdAutoDelete fontSize="1.2rem" />}
                  isLoading={isDeleting}
                  loadingText="Patientez..."
                  spinnerPlacement="start"
                  isDisabled={isDeleting}
                >
                  Supprimer
                </Button>

                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  leftIcon={<RxCrossCircled fontSize="1.2rem" />}
                >
                  Annuler
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* PAGE CONTAINER */}
      <Box
        position="relative"
        marginTop="10px"
        bg="#F8F9FB"
        w="100%"
        maxW="1400px"
        mx="auto"
        ml="0.3rem"
        mr="0.3rem"
        mb="1rem"
        height="98vh"
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
                  ml="0.2rem"
                  mb="1.3rem"
                >
                  <FaArrowLeftLong color="black" />
                </Box>
              </Link>

              <Box mt="0.5rem">
                <Text fontSize="1.4rem" fontWeight="600" color="#1F2937">
                  Détails de l'employé
                </Text>
                <Text
                  fontSize="1rem"
                  fontWeight="500"
                  color="#1F2937"
                  position="relative"
                  bottom="1.4rem"
                >
                  Consultez et gérez les informations de l'employé
                </Text>
              </Box>
            </HStack>
            {adminUser?.role === "manager" ? (
              <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
                <Box position="relative" bottom="1rem">
                  <UpdateEmployee
                    _id={_id}
                    employee={employee}
                    onUpdated={refreshEmployee}
                  />
                </Box>
              </ErrorBoundary>
            ) : (
              <Box position="relative" right="1rem" bottom="1.5rem">
                <NotAuthorized
                  buttonText="Modifier"
                  buttonColor="red"
                  icon={FaUserEdit}
                  placement="left"
                  width="13rem"
                />
              </Box>
            )}
          </Stack>

          {/* MAIN CONTENT */}
          <Stack direction={{ base: "column", lg: "row" }} spacing={4}>
            {/* LEFT PANEL */}
            <Box
              bg="#F8F9FB"
              border="1px solid"
              borderColor="#D1D9E0"
              borderRadius="12px"
              boxShadow="0 2px 8px rgba(1,0,1,1)"
              width="27vw"
              maxH="70vh"
              ml="0.3rem"
            >
              <VStack spacing={3} mt="0.rem">
                <Image
                  src={source}
                  boxSize="7rem"
                  borderRadius="full"
                  objectFit="cover"
                  mt="0.5rem"
                />

                <Text
                  fontSize="1.2rem"
                  fontWeight="700"
                  color="gray.700"
                  textAlign="center"
                >
                  {employee?.firstName} {employee?.lastName}
                </Text>

                <Text fontSize="1rem" color="gray.600" fontWeight="600">
                  {employee?.role}
                </Text>

                <HStack bg="#08162b" px={3} py={1} borderRadius="full">
                  <GoDotFill color="green" />
                  <Text
                    color="green.300"
                    position="relative"
                    top="0.4rem"
                    right="0.3rem"
                  >
                    Actif
                  </Text>
                </HStack>

                <Divider />

                <Box textAlign="center">
                  <Text color="gray.800" fontWeight="700" fontSize="1.1rem">
                    Matricule
                  </Text>
                  <Text color="gray.800" fontWeight="500">
                    #{employee?.matricule}
                  </Text>
                </Box>
                {adminUser?.role === "manager" ? (
                  <Button
                    colorScheme="red"
                    onClick={onOpen}
                    w="100%"
                    mt={4}
                    leftIcon={<MdDeleteForever />}
                  >
                    Supprimer
                  </Button>
                ) : (
                  <NotAuthorized
                    buttonText="Supprimer"
                    buttonColor="red"
                    icon={MdDeleteForever}
                    placement="bottom"
                    width="13rem"
                  />
                )}
              </VStack>
            </Box>

            {/* RIGHT PANEL */}
            <Box
              bg="#F8F9FB"
              border="1px solid"
              borderColor="#D1D9E0"
              borderRadius="12px"
              boxShadow="0 2px 8px rgba(1,0,1,1)"
              overflowY="auto"
            >
              <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
                <EmployeeDetailsTab employee={employee} />
              </ErrorBoundary>
            </Box>
          </Stack>
        </VStack>
      </Box>
    </>
  );
};

export default EmployeeDetailsPage;

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
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
import { FaRegTrashCan } from "react-icons/fa6";
import { MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type Employee from "../../shared/types/Employee";
import useAdminUser from "../../store/auth.store";
import EmployeeDetailsTab from "../components/EmployeeDetailsTab";
import UpdateEmployee from "../components/UpdateEmployee";
import ComponentErrorFallback from "./ComponentErrorFallback";
import NotAuthorized from "../components/NotAuthorized";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa";
import EmployeePhotoUpload from "../components/EmployeePhotoUpload";
import Attendance from "../../shared/types/Attendance";

type PhotoState = {
  photo_url?: string;
};

type AttendanceState = {
  attendance?: Attendance;
};

const EmployeeDetailsPage = () => {
  const [employee, setEmployee] = useState<Employee | null>({} as Employee);
  const [isDeleting, setIsDeleting] = useState(false);
  const { _id } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const adminUser = useAdminUser((store) => store.adminUser);
  const location = useLocation();
  const { photo_url } = (location.state as PhotoState) || "";
  const { attendance } = (location.state as AttendanceState) || {};

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
        bg="#F8F9FB"
        w="100%"
        maxW="1400px"
        mx="auto"
        ml="0.01rem"
        height="94.8vh"
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
                  ml="0.5rem"
                  mb="1.3rem"
                >
                  <FaArrowLeftLong color="black" />
                </Box>
              </Link>

              <Box ml="0.5rem" mt="0.8rem">
                <Text fontSize="1.4rem" fontWeight="600" color="#1F2937">
                  Détails de l'employé
                </Text>
                <Text
                  fontSize="1rem"
                  fontWeight="500"
                  color="gray.500"
                  position="relative"
                  bottom="1.4rem"
                >
                  Consultez et gérez les informations de l'employé
                </Text>
              </Box>
            </HStack>
            <HStack>
              <Link
                to={{
                  pathname: `/employees_admin/employees_list/${_id}/attendances`,
                }}
                state={{ employee, photo_url, attendance }}
              >
                <HStack
                  cursor="pointer"
                  bg="gray.100"
                  border="1px solid rgba(255,255,255,0.12)"
                  boxShadow="0 2px 8px rgba(0,0,0,0.5)"
                  borderRadius="0.4rem"
                  padding="0.4rem"
                >
                  <FaRegClock size="1.3rem" color="purple" />
                  <Text color="gray.900" position="relative" top="0.4rem">
                    Présence
                  </Text>
                </HStack>
              </Link>
              <Link
                to={{
                  pathname: `/employees_admin/employees_list/${_id}/leaves`,
                }}
                state={{ employee, photo_url }}
              >
                <HStack
                  cursor="pointer"
                  bg="gray.100"
                  border="1px solid rgba(255,255,255,0.12)"
                  boxShadow="0 2px 8px rgba(0,0,0,0.5)"
                  borderRadius="0.4rem"
                  padding="0.4rem"
                >
                  <CiCalendarDate size="1.3rem" color="purple" />
                  <Text position="relative" top="0.4rem">
                    Congés
                  </Text>
                </HStack>
              </Link>
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
              <Box position="relative" right="1.3rem" bottom="1.5rem">
                <NotAuthorized
                  buttonText="Modifier"
                  icon={FaUserEdit}
                  placement="left"
                  width="13rem"
                  color="#4F46E5"
                />
              </Box>
            )}
          </Stack>

          {/* MAIN CONTENT */}
          <Stack
            mt="1rem"
            direction={{ base: "column", lg: "row" }}
            spacing={4}
          >
            {/* LEFT PANEL */}
            <Box>
              <Box
                border="1px solid"
                borderColor="#D1D9E0"
                boxShadow="0 2px 8px rgba(1,0,1,1)"
                borderRadius="0.5rem"
                width="27vw"
                ml="1rem"
                bg="#ffffff"
              >
                <Box bg="purple.700" height="8rem" borderRadius="0.5rem" />
                <Box
                  height="15vh"
                  bg="#ffffff"
                  borderRadius="0.5rem"
                  position="relative"
                >
                  <EmployeePhotoUpload
                    employeeId={_id!}
                    currentPhoto={photo_url}
                    onUploaded={refreshEmployee}
                  />
                </Box>
                <VStack
                  position="relative"
                  bottom="3rem"
                  bg="#ffffff"
                  spacing={3}
                >
                  <Text
                    fontSize="1.2rem"
                    fontWeight="700"
                    color="gray.700"
                    textAlign="center"
                  >
                    {employee?.firstName} {employee?.lastName}
                  </Text>
                  <HStack bg="green.100" px={3} py={1} borderRadius="1.1rem">
                    <GoDotFill color="green" size="1.3rem" />
                    <Text
                      color="green.700"
                      position="relative"
                      top="0.4rem"
                      right="0.3rem"
                      fontSize="1rem"
                    >
                      Actif
                    </Text>
                  </HStack>
                </VStack>
              </Box>
              <Box bg="transparent">
                {adminUser?.role === "manager" ? (
                  <Button
                    bg="red.100"
                    color="red.600"
                    width="12rem"
                    height="3rem"
                    onClick={onOpen}
                    fontSize="1rem"
                    ml="6rem"
                    mt={4}
                    leftIcon={<FaRegTrashCan fontSize="1.3rem" />}
                  >
                    Supprimer
                  </Button>
                ) : (
                  <NotAuthorized
                    buttonText="Supprimer"
                    icon={FaRegTrashCan}
                    placement="bottom"
                    width="13rem"
                    color="red"
                  />
                )}
              </Box>
            </Box>

            {/* RIGHT PANEL */}
            <Box
              bg="#F8F9FB"
              border="1px solid"
              borderColor="#D1D9E0"
              borderRadius="12px"
              boxShadow="0 2px 8px rgba(1,0,1,1)"
              overflowY="auto"
              maxHeight="70vh"
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

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import type Employee from "../../shared/types/Employee";
import { LeaveWithEmployee } from "../../shared/types/LeaveWithEmployee";
import EmployeeLeaveCard from "../components/EmployeeLeaveCard";
import MonthDropDown from "../components/MonthDropDown";
import LeaveSubmissionModal from "../components/LeaveSubmissionModal";
import DeletionDialog from "../components/DeletionDialog";

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;

const Shimmer = ({ width = "100%", height = "18px" }) => (
  <Box
    borderRadius="6px"
    height={height}
    width={width}
    background="linear-gradient(90deg, #0A1F57 25%, #132C68 37%, #0A1F57 63%)"
    backgroundSize="400% 100%"
    animation="shimmer 1.4s ease infinite"
  />
);

const gridTemplate = `
1.6fr 1.6fr 1.6fr 1.5fr 1.5fr 1fr 1fr
`;

const EmployeeLeavePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveWithEmployee[]>([]);
  const [leave, setLeave] = useState<LeaveWithEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [submissionMonth, setSubmissionMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    window.electron.employees
      .getAll()
      .then((employees) => {
        setEmployees(employees);
        console.log("Fetched employees:", employees);
      })
      .catch((error) => {
        console.error("Error while fetching employees: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("Selected month: ", submissionMonth);
    window.electron.leave
      .getLeaveByMonth(submissionMonth)
      .then((leaves) => {
        setLeaves(leaves);
        console.log(
          `Fetched leaves for the month of ${submissionMonth}:${leaves}`
        );
      })
      .catch((error) => {
        console.error("Error while fetching leaves: ", error);
      })
      .finally(() => {
        setLoading(false);
        setRefresh(false);
      });
  }, [submissionMonth, refresh]);

  //Submit leave delete request
  const handleLeaveDelete = async () => {
    console.log("Leave to delete: ", leave);
    console.log("Leave ID to delete: ", leave?._id);
    if (!leave?._id) return;
    await window.electron.leave
      .delete(leave?._id)
      .then((leave) => {
        console.log("Deleted leave: ", leave);
        const updatedLeaves = leaves.filter((l) => l._id !== leave?._id);
        setLeaves(updatedLeaves);
        setRefresh(true);
        setSubmissionMonth(submissionMonth);
        onConfirmationClose();
      })
      .catch((error) =>
        console.error("An error occured while deleting attendance: ", error)
      );
  };

  //Handle delete button confirmation dialog
  const handleDeleteConfirmation = (leave: LeaveWithEmployee) => {
    onConfirmationOpen();
    setLeave(leave);
  };

  // /* ================= LOADING UI ================= */
  if (loading)
    return (
      <>
        <Box as="style">{shimmerKeyframes}</Box>

        <VStack>
          {/* HEADER */}
          <Box
            position="relative"
            top="0.5rem"
            ml="3px"
            bg="#03143B"
            height="200px"
            width="80vw"
            borderRadius="20px"
            p={4}
          >
            <Shimmer width="200px" height="28px" />
            <Box mt={2}>
              <Shimmer width="320px" height="16px" />
            </Box>

            <Box position="absolute" right="8px" top="8px">
              <Shimmer width="220px" height="40px" />
            </Box>
          </Box>

          {/* TABLE HEADER */}
          <Grid
            templateColumns={gridTemplate}
            bg="#08162b"
            mt="0.5rem"
            ml="0.3rem"
            mr="0.3rem"
            height="66px"
            width="80vw"
            borderRadius="12px"
            px={6}
            alignItems="center"
          >
            {[...Array(7)].map((_, i) => (
              <Shimmer key={i} width="90%" height="18px" />
            ))}
          </Grid>

          {/* ROWS */}
          <Box height="90vh" width="80vw" overflow="hidden">
            {[...Array(6)].map((_, i) => (
              <Grid
                key={i}
                templateColumns={gridTemplate}
                bg="#0A1F57"
                borderBottom="1px solid #1E355A"
                alignItems="center"
                px={6}
                py={4}
              >
                <Shimmer width="140px" />
                <Shimmer width="120px" />
                <Shimmer width="120px" />
                <Shimmer width="120px" />
                <Shimmer width="90px" />
                <Shimmer width="80px" />
                <HStack>
                  <Shimmer width="30px" height="30px" />
                  <Shimmer width="30px" height="30px" />
                </HStack>
              </Grid>
            ))}
          </Box>

          {/* FOOTER */}
          <Box bg="#08162b" height="80px" width="80vw" mb="1rem" />
        </VStack>
      </>
    );

  return (
    <>
      <Flex direction="column" justify="space-between">
        {/* Header */}
        <Box mt="0.5rem" ml="0.1rem" bg="#F8F9FB" height="10rem" width="79.2vw">
          <Flex>
            <Box>
              <Text
                color="#1F2937"
                fontSize="1.6rem"
                fontWeight="700"
                ml="0.5rem"
                mt="0.5rem"
              >
                Congés
              </Text>
              <Text
                color="#1F2937"
                fontSize="1rem"
                fontWeight="500"
                position="relative"
                bottom="1.5rem"
                ml="0.5rem"
              >
                Gérez les demandes de congés
              </Text>
            </Box>
            <Spacer />
            <Button
              backgroundColor="#F2B705"
              color="black"
              size="md"
              onClick={onOpen}
              zIndex="1"
              mt="0.7rem"
              mr="1.3rem"
            >
              <FaCirclePlus />{" "}
              <Text
                position="relative"
                top="0.5rem"
                fontSize="1.1rem"
                left="0.5rem"
              >
                Soumettre une demande
              </Text>
            </Button>
          </Flex>
        </Box>

        {/* Main area */}
        {leaves.length === 0 ? (
          <Box>
            <Text
              fontSize="2rem"
              fontStyle="revert"
              fontWeight="600"
              color="gray.200"
              position="relative"
              left="20rem"
            >
              Aucune demande de congé retrouvée
            </Text>
          </Box>
        ) : (
          <>
            <Grid
              templateColumns={gridTemplate}
              fontWeight="600"
              bg="#F8F9FB"
              height="5rem"
              mt="0.2rem"
              ml="0.1rem"
              mb="0.2rem"
              width="79vw"
              overflowY="hidden"
              overflowX="hidden"
            >
              <Text color="gray.800" fontSize="1.1rem" ml={8} mt={4}>
                Employé
              </Text>
              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Debut de congé
              </Text>
              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Fin de congé
              </Text>
              <Text mt={4} color="gray.800" fontSize="1.1rem">
                Motif
              </Text>
              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Statut
              </Text>

              <Box mt="0.4rem" position="relative" right="1rem">
                <Text color="gray.800" fontSize="1.1rem">
                  Congés
                </Text>
                <Text
                  color="gray.800"
                  fontSize="1.1rem"
                  position="relative"
                  bottom="1.4rem"
                >
                  restants
                </Text>
              </Box>

              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Actions
              </Text>
            </Grid>
            <Box height="90vh" overflowX="hidden" overflowY="auto">
              {leaves.map((leave, index) => {
                console.log("Leave at index", index, leave);
                return (
                  <EmployeeLeaveCard
                    key={leave?._id ?? index}
                    leave={leave}
                    gridTemplate={gridTemplate}
                    onDelete={() => handleDeleteConfirmation(leave)}
                  />
                );
              })}
            </Box>
          </>
        )}

        {/* Footer */}
        <Flex
          mb="2.7rem"
          ml="0.15rem"
          height="3.5rem"
          width="80.5vw"
          justify="space-between"
          bg="#F8F9FB"
        >
          <Box
            mt="0.47rem"
            ml="1rem"
            fontSize="1.2rem"
            fontFamily="monospace"
            fontWeight="600"
          >
            <MonthDropDown onChange={(month) => setSubmissionMonth(month)} />
          </Box>

          <Box
            color="gray.800"
            fontSize="24px"
            fontWeight="600"
            mt="0.5rem"
            mr="2rem"
          >
            <Text>{new Date().toLocaleDateString("fr-FR")}</Text>
          </Box>
        </Flex>
      </Flex>
      {/* Leave submission */}
      <LeaveSubmissionModal
        isOpen={isOpen}
        onClose={onClose}
        onRefresh={() => setRefresh(true)}
        employees={employees}
      />
      {/* Leave deletion */}
      <DeletionDialog
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        onConfirmation={handleLeaveDelete}
        header="Supprimer"
        body="Etes vous sur de vouloir supprimer cette demande?"
      />
    </>
  );
};

export default EmployeeLeavePage;
